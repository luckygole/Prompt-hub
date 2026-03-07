// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Add this after app.use(express.json());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));


// console.log('🚀 Starting server...');

// // MongoDB Connection - FIXED ✅
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompthub')
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.log('❌ MongoDB Error:', err.message));

// // Prompt Schema
// const promptSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   prompt: { type: String, required: true },
//   imageUrl: String,
//   likes: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// const Prompt = mongoose.model('Prompt', promptSchema);

// // Routes
// app.get('/api/prompts', async (req, res) => {
//   try {
//     const prompts = await Prompt.find().sort({ createdAt: -1 }).limit(20);
//     res.json(prompts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post('/api/prompts', async (req, res) => {
//   try {
//     const prompt = new Prompt(req.body);
//     await prompt.save();
//     res.status(201).json(prompt);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.patch('/api/prompts/:id/like', async (req, res) => {
//   try {
//     const prompt = await Prompt.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );
//     res.json(prompt);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));




const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ CRITICAL: body-parser LIMITS FIRST (before CORS)
app.use(express.json({ 
  limit: '100mb',
  strict: false 
}));
app.use(express.urlencoded({ 
  limit: '100mb', 
  extended: true 
}));

// ✅ CORS AFTER body-parser
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

console.log('🚀 Starting server...');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompthub')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

// Prompt Schema
const promptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  imageUrl: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Prompt = mongoose.model('Prompt', promptSchema);

// Routes
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 }).limit(20);
    res.json(prompts);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/prompts', async (req, res) => {
  try {
    console.log('📤 Payload size:', JSON.stringify(req.body).length / 1024 / 1024, 'MB');
    console.log('📤 Title:', req.body.title?.substring(0, 50));
    
    const prompt = new Prompt(req.body);
    await prompt.save();
    console.log('✅ SAVED:', prompt._id);
    res.status(201).json(prompt);
  } catch (error) {
    console.error('❌ POST error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/prompts/:id/like', async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ERROR HANDLER - LAST
app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large. Max 100MB.' });
  }
  console.error('🚨 Global error:', error);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
