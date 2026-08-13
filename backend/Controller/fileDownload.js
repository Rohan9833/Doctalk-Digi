const Doctor = require("../Model/DoctorModel");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

const downloadDoctorImages = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(500).json({
        success: false,
        message: "Doctor not Found",
      });
    }

    if (!doctor.imageFilePath || doctor.imageFilePath.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No images found",
      });
    }

    console.log("Doctor Found:", doctor.name);
    console.log("Images:", doctor.imageFilePath);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${doctor.name}-${doctor.city}-images.zip`,
    );

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("error", (err) => {
      console.error("Archive Error:", err);
    });

    archive.on("end", () => {
      console.log("ZIP completed");
    });

    archive.pipe(res);

    for (const image of doctor.imageFilePath) {
      const filePath = path.resolve(image.filePath);

      if (fs.existsSync(filePath)) {
        archive.file(filePath, {
          name: image.fileName,
        });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Download Images Error: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download images",
      error: error.message,
    });
  }
};

module.exports = {
  downloadDoctorImages,
};
