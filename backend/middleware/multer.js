const multer                  = require("multer");
const path                    = require("path");
const Doctor                  = require("../Model/DoctorModel");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    }, 

    filename: async (req, file, cb) => {
        try {

            const {id} = req.params;  
            const doctor = await Doctor.findById(id);

            if(!doctor) {
                return cb(new Error("Invalid Doctor Id"));
            }

            

            const fileName = doctor.doctorId + "-" + Date.now() + path.extname(file.originalname);

            cb(null, fileName);
        } catch (error) {
            cb(error)
            
        }
    }
})


const fileFilter = (req, file, cb) => {
    console.log("Original Name:", file.originalname);
    console.log("Mime Type:", file.mimetype);
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
    ];

    cb(null, true)
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

module.exports = upload;