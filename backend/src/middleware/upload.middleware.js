const multer = require("multer");

const storage = multer.memoryStorage();

const audioUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: function (req, file, callback) {
    if (!file.mimetype.startsWith("audio/")) {
      return callback(new Error("Only audio files are allowed"));
    }

    callback(null, true);
  },
});

module.exports = {
  audioUpload,
};