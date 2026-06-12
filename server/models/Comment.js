import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  novelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  content: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ['PENDING','APPROVED','REJECTED'], default: 'PENDING' }
}, { timestamps: true });
export default mongoose.model('Comment', commentSchema);
