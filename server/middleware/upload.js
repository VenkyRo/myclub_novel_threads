import multer from 'multer';
const storage = multer.memoryStorage();
function fileFilter(req, file, cb) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.mimetype)) return cb(new Error('Only JPG, PNG and WEBP images are allowed'));
  cb(null, true);
}
export const uploadCover = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter }).single('coverImage');
