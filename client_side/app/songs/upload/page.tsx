"use client";
import { useState } from 'react';
import axios from 'axios';

export default function UploadSong() {
  const genres = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'Other'];
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genreIndex, setGenreIndex] = useState(0); // To track the selected genre index
  const [duration, setDuration] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'image') {
      setImageFile(files[0]);
    } else if (name === 'audio') {
      setAudioFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('releaseDate', releaseDate);
    formData.append('genre', genres[genreIndex]); // Send the genre string
    formData.append('duration', duration);
    formData.append('lyrics', lyrics);
    formData.append('isExplicit', isExplicit);
    formData.append('image', imageFile);
    formData.append('audio', audioFile);

    try {
      const response = await axios.post('http://localhost:4000/music', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`Song uploaded successfully: ${response.data.title}`);
    } catch (error) {
      setMessage('An error occurred while uploading the song.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Upload a Song</h1>

      {message && (
        <p
          className={`text-center p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Artist</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Album</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Release Date</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Genre Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Genre</label>
          <select
            value={genreIndex}
            onChange={(e) => setGenreIndex(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {genres.map((genre, index) => (
              <option key={index} value={index}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Explicit</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isExplicit}
              onChange={() => setIsExplicit((prev) => !prev)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Mark as explicit</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lyrics</label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Image (Cover Art)</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-2 block w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Audio File</label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleFileChange}
              required
              className="mt-2 block w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          >
            {loading ? 'Uploading...' : 'Upload Song'}
          </button>
        </div>
      </form>
    </div>
  );
}
