"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all podcasts from the API using Axios
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_BACKEND_URL}/podcasts`);
        setPodcasts(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch podcasts');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Podcast Episodes</h1>

      {/* Display error message if there's an issue */}
      {error && (
        <div className="text-red-600 text-center mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Show loading spinner if data is still being fetched */}
      {loading ? (
        <div className="text-center text-gray-600">
          <p>Loading podcasts...</p>
        </div>
      ) : podcasts.length > 0 ? (
        <ul className="space-y-6">
          {podcasts.map((podcast) => (
            <li key={podcast._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex flex-col items-start space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">{podcast.title}</h2>
                <p className="text-gray-600">{podcast.description}</p>
                {podcast.imageUrl && (
                  <img
                    src={`http://localhost:4000${podcast.imageUrl}`}
                    alt={podcast.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <audio controls className="w-full mt-4">
                  <source
                    src={`http://localhost:4000${podcast.audioUrl}`}
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No podcasts available.</p>
      )}
    </div>
  );
};

export default Podcasts;
