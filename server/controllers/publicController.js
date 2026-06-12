import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import Comment from '../models/Comment.js';

export async function listNovels(req, res, next) {
  try {
    const { search='', category='', sort='latest', page=1, limit=12 } = req.query;
    const query = { publishStatus:'PUBLISHED' };
    if (search) query.$or = ['title','author','shortSummary','tags'].map(k => ({ [k]: { $regex:search, $options:'i' } }));
    if (category) query.category = category;
    const sortMap = { latest:{updatedAt:-1}, viewed:{totalViews:-1}, alphabetical:{title:1} };
    const novels = await Novel.find(query).sort(sortMap[sort] || sortMap.latest).skip((page-1)*limit).limit(Number(limit));
    const total = await Novel.countDocuments(query);
    res.json({ success:true, novels, total, page:Number(page), pages:Math.ceil(total/limit) });
  } catch (err) { next(err); }
}
export async function novelDetails(req,res,next){
  try{
    const novel=await Novel.findOne({slug:req.params.slug,publishStatus:'PUBLISHED'});
    if(!novel) return res.status(404).json({success:false,message:'Novel not found'});
    const chapters=await Chapter.find({novelId:novel._id,publishStatus:'PUBLISHED'}).sort({chapterNumber:1}).select('-content');
    res.json({success:true,novel,chapters});
  }catch(err){next(err)}
}
export async function chapterDetails(req,res,next){
  try{
    const chapter=await Chapter.findOne({_id:req.params.chapterId,publishStatus:'PUBLISHED'}).populate('novelId','title slug publishStatus');
    if(!chapter || chapter.novelId.publishStatus!=='PUBLISHED') return res.status(404).json({success:false,message:'Chapter not found'});
    await Chapter.updateOne({_id:chapter._id},{$inc:{views:1}});
    await Novel.updateOne({_id:chapter.novelId._id},{$inc:{totalViews:1}});
    const published=await Chapter.find({novelId:chapter.novelId._id,publishStatus:'PUBLISHED'}).sort({chapterNumber:1}).select('_id chapterNumber title');
    const index=published.findIndex(c=>String(c._id)===String(chapter._id));
    res.json({success:true,chapter,previous:index>0?published[index-1]:null,next:index<published.length-1?published[index+1]:null});
  }catch(err){next(err)}
}
export async function approvedComments(req,res,next){
 try{const comments=await Comment.find({chapterId:req.params.chapterId,status:'APPROVED'}).populate('userId','name').sort({createdAt:-1});res.json({success:true,comments})}catch(err){next(err)}
}
