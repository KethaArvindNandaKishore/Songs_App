const mongoose = require('mongoose');

// Define the Song Schema
const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    album: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: [String], // Multiple genres for flexibility
      enum: ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Other'],
      default: ['Other'],
    },
    duration: {
      type: Number, // Duration in seconds, it's typically an integer
      min: 0, // Ensure duration is not negative
    },
    lyrics: {
      type: String,
      maxlength: 5000, // Limit to 5000 characters (can be adjusted based on the need)
    },
    isExplicit: {
      type: Boolean,
      default: false,
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
    timestamps: true, // This will automatically add createdAt and updatedAt fields
    versionKey: false, // Remove the version key (__v)
  }
);

// Create a unique index on title + artist to avoid duplicate songs
songSchema.index({ title: 1, artist: 1 }, { unique: true });

// Model creation
const SongData = mongoose.model('Song', songSchema);

module.exports = SongData;
