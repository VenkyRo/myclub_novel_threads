import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message:'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ success:false, message:'Password must be at least 6 characters' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success:false, message:'Email is already registered' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ success:true, token: signToken(user), user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ success:false, message:'Invalid email or password' });
    if (user.isBanned) return res.status(403).json({ success:false, message:`Your account has been banned. Reason: ${user.banReason || 'Not specified'}` });
    res.json({ success:true, token:signToken(user), user:{ id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (err) { next(err); }
}

export async function me(req, res) { res.json({ success:true, user:req.user }); }
