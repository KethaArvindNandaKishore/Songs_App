"use client"

import { useState } from 'react';

export default function PodcastForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episodeNumber: '',
    releaseDate: '',
    duration: '',
    isExplicit: false,
    imageUrl: null,
    audioUrl: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a POST request here (you'd integrate with an API to send the form data)
    setTimeout(() => {
      alert('Podcast Episode Created');
      setIsSubmitting(false);
      setFormData({
        title: '',
        description: '',
        episodeNumber: '',
        releaseDate: '',
        duration: '',
        isExplicit: false,
        imageUrl: null,
        audioUrl: null,
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Create Podcast Episode</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium">Episode Number</label>
            <input
              type="number"
              name="episodeNumber"
              value={formData.episodeNumber}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium">Duration (seconds)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Explicit Content</label>
            <input
              type="checkbox"
              name="isExplicit"
              checked={formData.isExplicit}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium">Upload Cover Image</label>
          <input
            type="file"
            name="imageUrl"
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Upload Audio File</label>
          <input
            type="file"
            name="audioUrl"
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white rounded-lg ${
              isSubmitting
                ? 'bg-gray-400'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Create Podcast Episode'}
          </button>
        </div>
      </form>
    </div>
  );
}
