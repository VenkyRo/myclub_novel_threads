import cloudinary from '../config/cloudinary.js';
export function uploadBuffer(buffer, folder = 'novel-threads') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => error ? reject(error) : resolve(result));
    stream.end(buffer);
  });
}
