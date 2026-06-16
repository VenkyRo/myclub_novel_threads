import { Router } from 'express';
import {
  listNovels,
  novelDetails,
  chapterDetails,
  approvedComments,
} from '../controllers/publicController.js';
import { protect } from '../middleware/auth.js';

const r = Router();

// Public: anyone can see novel list on home page
r.get('/novels', listNovels);

// Protected: login required to open novel details and read chapters
r.get('/novels/:slug', protect, novelDetails);
r.get('/chapters/:chapterId', protect, chapterDetails);

// Public: approved comments can be visible
r.get('/chapters/:chapterId/comments', approvedComments);

export default r;