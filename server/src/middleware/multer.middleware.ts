import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirName, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });
