const Doctor = require("../Model/DoctorModel");
const QRCode = require("qrcode");
const Campaign = require("../Model/CampaignModel")
const Qrscan = require("../Model/Qrscanmodel")
const getUserDeviceInfo = require("../services/getDeviceService")
const { v4: uuidv4 } = require("uuid")

exports.getDoctor = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("doctorId name")


        res.status(200).json({ success: true, data: doctors, count: doctors.length })
    } catch (error) {
        conosle.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: "Server error fetching doctors" });
    }
}


exports.createAndSaveDoctorQr = async (req, res) => {
    try {
        const { doctorId } = req.params;


        console.log("Doctor ID: ", doctorId)

        const doctor = await Doctor.findOne({ doctorId: doctorId });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Invalid Doctor Id." })
        }

        if (doctor.qrCode && doctor.qrCodeSvg && doctor.qrStatus === "active") {
            return res.json({
                success: true,
                message: "QR already exists",
                qrcode: doctor.qrCode,
                qrSvg: doctor.qrCodeSvg
            })
        }

        const url = `http://192.168.1.37:2468/api/doctors/change/${doctorId}`

        const qrcode = await QRCode.toDataURL(url);
        const qrSvg = await QRCode.toString(url, {
            type: "svg",
            margin: 1,
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        })


        doctor.qrCode = qrcode;
        doctor.qrStatus = "active";
        doctor.qrCodeSvg = qrSvg;

        await doctor.save();

        res.json({
            success: true,
            message: "QR code generated and saved successfully",
            qrcode,
            qrSvg
        })



    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        })
    }
}

exports.doActionOnQr = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const sessionId = uuidv4()

        const doctor = await Doctor.findOne({ doctorId: doctorId })

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Invalid Doctor ID."
            })
        }

        const deviceInfo = await getUserDeviceInfo(req);

        const existingScans = await Qrscan.exists({
            doctor: doctor._id,
            ipAddress: deviceInfo.ipAddress,
        })

        await Qrscan.create({//dsadasd
            doctor: doctor._id,
            campaign: doctor.campaign,
            city: deviceInfo.city,
            state: deviceInfo.state,
            ipAddress: deviceInfo.ipAddress,
            deviceType: deviceInfo.deviceType,
            userAgent: deviceInfo.userAgent,
            sessionId: uuidv4(),
        })

        const updateObj = {
            $inc: {
                totalScans: 1,
                ...(existingScans ? {} : { uniqueScans: 1 }),
            }
        }


        await Doctor.findOneAndUpdate(
            { doctorId },
            updateObj
        );

        return res.status(200).json({ success: true, message: "Scan is registered", sessionId })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }


}