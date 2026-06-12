import { Router } from 'express';import { listNovels,novelDetails,chapterDetails,approvedComments } from '../controllers/publicController.js';
const r=Router();r.get('/novels',listNovels);r.get('/novels/:slug',novelDetails);r.get('/chapters/:chapterId',chapterDetails);r.get('/chapters/:chapterId/comments',approvedComments);export default r;
