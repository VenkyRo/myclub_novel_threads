import mongoose from 'mongoose';
const chapterSchema = new mongoose.Schema({
  novelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true, index: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  publishStatus: { type: String, enum: ['DRAFT','PUBLISHED'], default: 'DRAFT' },
  publishedAt: Date,
  views: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
chapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });
export default mongoose.model('Chapter', chapterSchema);
