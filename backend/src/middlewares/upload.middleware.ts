import fs from "fs";
import multer from "multer";
import path from "path";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

export const uploadPdf = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf" && path.extname(file.originalname).toLowerCase() !== ".pdf") {
      cb(new HttpError(400, "Envie um arquivo PDF"));
      return;
    }
    cb(null, true);
  }
});
