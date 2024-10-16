import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AutocompleteSelect from '../AutoCompleteSelect';

function AddNewCourt() {
  const apiurl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    centre: '',
    sport: '',
    name: '',
    price: ''
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [center,setCenters] = useState([]);
  const [sport,setSport] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const fetchdata = async ()=>{
    try{
      const response = await fetch(apiurl + '/api/centres/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      if(!response.ok){

      }
      else{
        setCenters(data);
      }
    }
    catch(error){
      console.log("error fectching centers")
    }
  }
  useEffect(()=>{
    fetchdata();
  },[]);
  const fectchSportData = async ()=>{
    try{
      const response = await fetch(apiurl + `/api/centres/${formData.centre}/sports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      console.log(data);
      if(!response.ok){

      }
      else{
        setSport(data);
      }
    }
    catch(error){
      console.log("error fectching Sports")
    }
  }
  useEffect(()=>{
    fectchSportData();
  },[formData.centre])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    console.log(formData);
    // return;

    try {
      setLoading(true);
      const response = await fetch('/api/admin/courts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Court Created Successfully');
      } else {
        setError(data.message || 'Failed to create court. Ensure city + sport + court name is unique.');
      }

      setLoading(false);
    } catch (err) {
      setError('An error occurred while creating the court.');
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
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Court</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* City Dropdown */}
          <div>
            <AutocompleteSelect options={center} field={"centre"} setFormData={setFormData} formData={formData}/>
          </div>

          {/* Sport Dropdown */}
          <div>
            <AutocompleteSelect options={sport} field={"sport"} setFormData={setFormData} formData={formData}/>
          </div>

          {/* Court Name */}
          <div>
            <label className="block text-gray-700">Court Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full  text-gray-700   bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full text-gray-700   bg-white px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Court'}
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

export default AddNewCourt;
