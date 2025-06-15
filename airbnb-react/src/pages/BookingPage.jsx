// src/pages/BookingPage.jsx

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookingPage() {
  const [params] = useSearchParams();
  const listingId = params.get('listing_id');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    clientName: '',
    email: '',
    phoneMobile: '',
    postalAddress: '',
    homeAddress: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no listing_id
  useEffect(() => {
    if (!listingId) {
      navigate('/');
    }
  }, [listingId, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return setError('End date must be on or after start date.');
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError('Please enter a valid email address.');
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/bookings', {
        listing_id: listingId,
        ...form
      });
      navigate(`/confirm?booking_id=${data.booking_id}`);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || 'Booking failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Let's book a property</h1>

      {/* Booking Details Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label>
            Check-in Date
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
          <label>
            Check-out Date
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
        </form>
      </section>

      {/* Your Details Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label>
            Your Name
            <input
              type="text"
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
          <label>
            Mobile Phone
            <input
              type="text"
              name="phoneMobile"
              value={form.phoneMobile}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
          <label>
            Postal Address
            <input
              type="text"
              name="postalAddress"
              value={form.postalAddress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>
          <label>
            Residential Address
            <input
              type="text"
              name="homeAddress"
              value={form.homeAddress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </label>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>
      </section>
    </div>
  );
}
