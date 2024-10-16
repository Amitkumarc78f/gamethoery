import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";

function ShowAllBookings() {
  const apiurl = import.meta.env.VITE_API_BASE_URL;
  const [bookings, setBookings] = useState([]); // All bookings
  const [filteredBookings, setFilteredBookings] = useState([]); // Filtered bookings to display
  const [filters, setFilters] = useState({
    city: "",
    court: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState(null); // Error handling state
  const [loading, setLoading] = useState(true); // Loading state to show when fetching data
  const [deleting, setDeleting] = useState(false); // Delete action state

  const [formData, setFormData] = useState({
    city: "",
    sport: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Form Data:", formData);
    const apiurl = import.meta.env.VITE_API_BASE_URL; // Display form data in the console

    try {
      const response = await fetch(
        `/api/admin/bookings?centre=${formData["city"]}&sport=${formData["sport"]}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If using token-based auth
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        console.log("Bookings fetched successfully:", data);
        // Handle your data here (e.g., set state)
      } else {
        console.error("Failed to fetch bookings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Fetch bookings from the API on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(apiurl + "/api/admin/bookings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log(data);
        // return;
        setBookings(data);
        setFilteredBookings(data); // Initially set the filtered list to all bookings
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings.");
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Apply filters to bookings when filters or bookings change
  useEffect(() => {
    let filtered = bookings;

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(
        (booking) => booking.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Filter by court
    if (filters.court) {
      filtered = filtered.filter(
        (booking) => booking.sport.toLowerCase() === filters.court.toLowerCase()
      );
    }

    // Filter by date
    if (filters.date) {
      filtered = filtered.filter((booking) => booking.bd === filters.date);
    }

    // Filter by time
    if (filters.time) {
      filtered = filtered.filter((booking) => booking.bt === filters.time);
    }

    setFilteredBookings(filtered);
  }, [filters, bookings]);
  

  // Delete booking handler
  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      const response = await fetch(apiurl + `/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        // Remove the deleted booking from the state
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking["_id"] !== id)
        );
        setFilteredBookings((prevFiltered) =>
          prevFiltered.filter((booking) => booking["_id"] !== id)
        );
        setError(null); // Clear any error message
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete booking");
      }
    } catch (err) {
      setError("An error occurred while trying to delete the booking");
    } finally {
      setDeleting(false);
    }
  };
  const formatedDate = (bookingDate) => {
    const date = new Date(bookingDate);

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date in 'YYYY-MM-DD' format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  if (loading) {
    return <p className="text-center text-lg">Loading bookings...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-7xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Bookings</h2>

        {/* Booking Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.length === 0 ? (
            <p>No bookings found for the selected filters.</p>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking["_id"]}
                className="bg-black shadow-md rounded-lg p-4"
              >
                <h3 className="text-xl font-bold mb-2">{booking.court_name}</h3>
                <p>
                  <strong>City:</strong> {booking.centre}
                </p>
                <p>
                  <strong>Date:</strong> {formatedDate(booking.date)}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {booking.startTime + "-" + booking.endTime}
                </p>
                <p>
                  <strong>Price:</strong> ${booking.price}
                </p>
                <p>
                  <strong>Sport:</strong> {booking.sport}
                </p>
                <p>
                  <strong>Booking ID:</strong> {booking["_id"]}
                </p>
                <button
                  onClick={() => handleDelete(booking["_id"])}
                  disabled={deleting}
                  className={`mt-4 w-full ${
                    deleting ? "bg-gray-400" : "bg-red-500"
                  } text-white py-2 rounded-lg hover:bg-red-600 transition-colors`}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Error Handling */}
        {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      </div>
    </div>
  );
}

export default ShowAllBookings;
