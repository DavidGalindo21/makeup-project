import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "prod_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;