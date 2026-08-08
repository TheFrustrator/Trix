import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";

const uploadDirectory = path.resolve("uploads", "licenses");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) =>
    callback(
      null,
      `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`,
    ),
});

const licenseUpload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(
      allowedMimeTypes.has(file.mimetype)
        ? null
        : new Error("Only PDF, PNG, and JPEG license files are allowed."),
      allowedMimeTypes.has(file.mimetype),
    );
  },
});

export default licenseUpload;
