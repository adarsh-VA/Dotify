require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route');
const playlistRouter = require('./routes/playlist.route');
const artistRouter = require('./routes/artist.route');
const songRouter = require('./routes/song.route');

const app = express();
const PORT = process.env.PORT || 8001;

const corsOptions = {
  origin: 'https://dotify-va.vercel.app', // Your frontend URL
  credentials: true, // Enable credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect('mongodb+srv://VA:08112000@dotify.ntcsyop.mongodb.net/?retryWrites=true&w=majority&appName=Dotify');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.get('/', (req, res) => {
  res.send('Hello dotify application running successfully!!');
});
app.use('/api/users', userRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/artists', artistRouter);
app.use('/api/songs', songRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
