
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }
  next();
});

// ✅ Body parser
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

console.log('🚀 Starting server...');

// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompthub')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

  console.log("Mongo URI:", process.env.MONGODB_URI);

// ================= SCHEMAS =================
const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  imageUrl: String,
  likes: { type: Number, default: 0 },
  requestId: { type: String, required: true, unique: true }, // 🔥 important
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  likedPrompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }],
  createdAt: { type: Date, default: Date.now }
});

const Prompt = mongoose.model('Prompt', promptSchema);
const User = mongoose.model('User', userSchema);

// ================= ROUTES =================

// GET PROMPTS
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 CREATE PROMPT (FULL FIXED)
app.post('/api/prompts', async (req, res) => {
  try {
    const { title, prompt, imageUrl, requestId } = req.body;

    console.log('📤 Saving:', title);

    // ❌ requestId missing
    if (!requestId) {
      return res.status(400).json({ error: 'requestId is required' });
    }

    // 🔥 Check duplicate by requestId
    const existing = await Prompt.findOne({ requestId });
    if (existing) {
      console.log('⚠️ Duplicate blocked (requestId)');
      return res.status(200).json(existing);
    }

    // 🔥 Extra check (same content)
    const duplicate = await Prompt.findOne({ title, prompt, imageUrl });
    if (duplicate) {
      console.log('⚠️ Duplicate blocked (content)');
      return res.status(200).json(duplicate);
    }

    const newPrompt = new Prompt({
      title,
      prompt,
      imageUrl,
      requestId
    });

    await newPrompt.save();

    console.log('✅ Saved:', newPrompt._id);
    res.status(201).json(newPrompt);

  } catch (error) {

    // 🔥 Handle duplicate key error
    if (error.code === 11000) {
      console.log('⚠️ Duplicate key caught');

      const existing = await Prompt.findOne({
        requestId: req.body.requestId
      });

      return res.status(200).json(existing);
    }

    console.error('❌ Save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🔥 LIKE (NO DUPLICATE LIKE)
app.patch('/api/prompts/:id/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });

    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ❌ Already liked
    // if (user.likedPrompts.includes(req.params.id)) {
    //   return res.status(200).json({ message: 'Already liked' });
    // }
    
    if (user.likedPrompts.some(id => id.toString() === req.params.id)) {
  return res.status(200).json({ message: 'Already liked' });
}

    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    user.likedPrompts.push(req.params.id);
    await user.save();

    res.json(prompt);

  } catch (error) {
    console.error('❌ Like error:', error);
    res.status(400).json({ error: error.message });
  }
});

// FAVORITES
app.get('/api/users/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Auth required' });

    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const user = await User.findById(userId).populate('likedPrompts');
    if (!user) return res.status(401).json({ error: 'User not found' });

    res.json(user.likedPrompts);

  } catch (error) {
    console.error('Favorites error:', error);
    res.status(400).json({ error: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
      await user.save();
    }

    const token = Buffer.from(`${user._id}:${email}`).toString('base64');

    res.json({
      user: { id: user._id, email: user.email, name: user.name },
      token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AUTH CHECK
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    res.json(user);

  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));