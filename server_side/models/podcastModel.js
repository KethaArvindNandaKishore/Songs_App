const mongoose = require('mongoose');

// Define the Podcast Episode Schema
const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000, // Adjust based on expected description length
    },
    episodeNumber: {
      type: Number, // Episode number (e.g., 1, 2, 3, etc.)
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // Duration in seconds
      min: 0,
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String, // URL for podcast cover image
    },
    audioUrl: {
      type: String, // URL for podcast audio file
      required: true, // Ensure audio URL is provided
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false, // Remove the version key (__v)
  }
);

// Create a unique index on title + episodeNumber to avoid duplicate episodes
podcastSchema.index({ title: 1, episodeNumber: 1 }, { unique: true });

// Model creation
const PodcastData = mongoose.model('Podcast', podcastSchema);

module.exports = PodcastData;
