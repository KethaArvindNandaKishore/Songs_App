const path = require('path');
const multer = require('multer');
const SongData = require('../../models/musicModel');

// Multer configuration for image and audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'image' ? './uploads/image' : './uploads/audio';
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// File filter to allow only specific formats
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'audio') {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for audio
});

// Create a song with file uploads
exports.createSong = [
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),

  async (req, res) => {
    try {
      const { title, artist, album, releaseDate, genre, duration, lyrics, isExplicit } = req.body;

      // Generate URLs for image and audio
      const imageUrl = req.files['image'] ? `/uploads/images/${req.files['image'][0].filename}` : undefined;
      const audioUrl = req.files['audio'] ? `/uploads/audio/${req.files['audio'][0].filename}` : undefined;

      const newSong = new SongData({
        title,
        artist,
        album,
        releaseDate,
        genre: genre ? genre.split(',') : [],
        duration,
        lyrics,
        isExplicit,
        imageUrl,
        audioUrl,
      });

      await newSong.save();
      res.status(201).json(newSong); // Return created song
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error creating song' });
    }
  }
];

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await SongData.find();
    res.status(200).json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching songs' });
  }
};

// Get a song by ID
exports.getSongById = async (req, res) => {
  try {
    const song = await SongData.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the song' });
  }
};

// Update a song by ID
exports.updateSongById = async (req, res) => {
  try {
    const updatedSong = await SongData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(200).json(updatedSong);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error updating song' });
  }
};

// Delete a song by ID
exports.deleteSongById = async (req, res) => {
  try {
    const deletedSong = await SongData.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting song' });
  }
};
