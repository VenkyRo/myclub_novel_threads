import mongoose from 'mongoose';
const novelSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  shortSummary: { type: String, required: true, maxlength: 1500 },
  description: { type: String, default: '' },
  coverImageUrl: { type: String, default: '' },
  coverImagePublicId: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  novelStatus: { type: String, enum: ['ONGOING','COMPLETED'], default: 'ONGOING' },
  publishStatus: { type: String, enum: ['DRAFT','PUBLISHED'], default: 'DRAFT' },
  totalViews: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Novel', novelSchema);
