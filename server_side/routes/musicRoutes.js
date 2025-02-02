const express = require('express');
const musicRouter = express.Router();
const songController = require('../controllers/music/musicOperations');

// Create a new song
musicRouter.post('/', songController.createSong);

// Get all songs
musicRouter.get('/', songController.getAllSongs);

// Get a song by ID
musicRouter.get('/:id', songController.getSongById);

// Update a song by ID
musicRouter.put('/:id', songController.updateSongById);

// Delete a song by ID
musicRouter.delete('/:id', songController.deleteSongById);

module.exports = musicRouter;
