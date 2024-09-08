const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/youtalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Message Model
const MessageSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// Route to fetch messages with pagination
app.get('/messages', async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = 20; // Set the number of messages to load at once

  try {
    const messages = await Message.find().sort({ timestamp: -1 }).skip(skip).limit(limit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Route to save a new message
app.post('/messages', async (req, res) => {
  const messageContent = req.body.content.trim();

  if (messageContent) {
    try {
      const newMessage = new Message({ content: messageContent });
      await newMessage.save();
      res.json({ message: 'Message saved!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  } else {
    res.status(400).json({ error: 'Message cannot be empty' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
