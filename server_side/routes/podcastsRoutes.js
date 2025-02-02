const express = require('express');
const podcastsRoutes = express.Router();
const { createPodcastEpisode, getAllPodcastEpisodes, getPodcastEpisodeById, updatePodcastEpisodeById, deletePodcastEpisodeById } = require('../controllers/podcasts/poadcastsOperations'); // Import the necessary controller functions

// Route to get all podcast episodes
podcastsRoutes.get('/podcasts', getAllPodcastEpisodes);

// Route to get a specific podcast episode by ID
podcastsRoutes.get('/podcasts/:id', getPodcastEpisodeById);

// Route to create a new podcast episode (with image and audio upload)
podcastsRoutes.post('/podcasts', createPodcastEpisode);

// Route to update a podcast episode by ID
podcastsRoutes.put('/podcasts/:id', updatePodcastEpisodeById);

// Route to delete a podcast episode by ID
podcastsRoutes.delete('/podcasts/:id', deletePodcastEpisodeById);

// Optional: Add a default route to handle general requests
podcastsRoutes.get('/', (req, res) => {
  res.send('Welcome to the podcasts API!');
});

module.exports = podcastsRoutes;
