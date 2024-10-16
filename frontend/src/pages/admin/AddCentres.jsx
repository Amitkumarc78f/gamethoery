import { useState } from 'react';
import { Link } from 'react-router-dom';

function AddCentres() {
  const [formData, setFormData] = useState({
    centreName: '',
    location: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      const response = await fetch('/api/admin/centres/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'header': `bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Centre Created Successfully');
        setFormData({
          centreName: '',
          location: ''
        });
      } else {
        setError(data.message || 'Failed to create centre.');
      }

      setLoading(false);
    } catch (err) {
      setError('An error occurred while creating the centre.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* Navigation Bar */}
      <nav className="w-full bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="space-x-4 text-lg font-bold">
            <Link to="/admin/showallbookings" className="hover:underline">Show All Bookings</Link>
          </div>
        </div>
      </nav>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Add New Centre</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Centre Name */}
          <div>
            <label className="block text-gray-700">Centre Name:</label>
            <input
              type="text"
              name="centreName"
              value={formData.centreName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Centre'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        {/* Success Message */}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}
      </div>
    </div>
  );
}

export default AddCentres;
