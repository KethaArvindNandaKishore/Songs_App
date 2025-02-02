const path = require('path');
const multer = require('multer');
const PodcastData = require('../../models/podcastModel'); // Ensure you use the updated Podcast schema

// Multer configuration for image and audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'image' ? './uploads/images' : './uploads/audio';
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Add timestamp to avoid conflicts
    cb(null, fileName);
  }
});

// File filter to allow only specific formats
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept image file
    } else {
      cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }
  } else if (file.fieldname === 'audio') {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true); // Accept audio file
    } else {
      cb(new Error('Only audio files are allowed!'), false); // Reject non-audio files
    }
  }
};

// Initialize Multer with storage configuration and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit audio file size to 100MB
});

// Route to create a new podcast episode with file uploads
exports.createPodcastEpisode = [
  // Fields for uploading image and audio
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),

  async (req, res) => {
    try {
      // Extract podcast data from the request body
      const { title, description, episodeNumber, releaseDate, duration, isExplicit } = req.body;

      // Handle image and audio file uploads
      const imageUrl = req.files['image'] ? `/uploads/images/${req.files['image'][0].filename}` : undefined;
      const audioUrl = req.files['audio'] ? `/uploads/audio/${req.files['audio'][0].filename}` : undefined;

      // Create new podcast episode in the database
      const newPodcast = new PodcastData({
        title,
        description,
        episodeNumber,
        releaseDate,
        duration,
        isExplicit,
        imageUrl,
        audioUrl,
      });

      // Save the new podcast episode to the database
      await newPodcast.save();
      res.status(201).json(newPodcast); // Return the newly created episode
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error creating podcast episode' });
    }
  }
];

// Route to get all podcast episodes
exports.getAllPodcastEpisodes = async (req, res) => {
  try {
    const episodes = await PodcastData.find();
    res.status(200).json(episodes); // Return all podcast episodes
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching podcast episodes' });
  }
};

// Route to get a specific podcast episode by ID
exports.getPodcastEpisodeById = async (req, res) => {
  try {
    const episode = await PodcastData.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ error: 'Podcast episode not found' });
    }
    res.status(200).json(episode); // Return the found episode
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the podcast episode' });
  }
};

// Route to update a podcast episode by ID
exports.updatePodcastEpisodeById = async (req, res) => {
  try {
    const updatedEpisode = await PodcastData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEpisode) {
      return res.status(404).json({ error: 'Podcast episode not found' });
    }
    res.status(200).json(updatedEpisode); // Return the updated episode
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error updating podcast episode' });
  }
};

// Route to delete a podcast episode by ID
exports.deletePodcastEpisodeById = async (req, res) => {
  try {
    const deletedEpisode = await PodcastData.findByIdAndDelete(req.params.id);
    if (!deletedEpisode) {
      return res.status(404).json({ error: 'Podcast episode not found' });
    }
    res.status(200).json({ message: 'Podcast episode deleted successfully' }); // Return success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting podcast episode' });
  }
};
