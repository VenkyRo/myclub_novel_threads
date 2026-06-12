import mongoose from 'mongoose';
const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  novelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true }
}, { timestamps: true });
bookmarkSchema.index({ userId: 1, chapterId: 1 }, { unique: true });
export default mongoose.model('Bookmark', bookmarkSchema);
