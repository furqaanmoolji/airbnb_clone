import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ConfirmPage() {
  const [params] = useSearchParams();
  const bookingId = params.get('booking_id');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return setError('No booking specified');
    axios.get(`/api/bookings/${bookingId}`)
      .then(res => setBooking(res.data))
      .catch(() => setError('Could not load booking details'));
  }, [bookingId]);

  if (error) return <p className="error">{error}</p>;
  if (!booking) return <p>Loading…</p>;

  return (
    <div className="confirm-page">
      <h1>Booking Confirmed!</h1>
      <p><strong>Listing #:</strong> {booking.listing_id}</p>
      <p><strong>Name:</strong> {booking.clientName}</p>
      <p><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      {/* add other fields as desired */}
      <Link to="/">← Back to Home</Link>
    </div>
  );
}
