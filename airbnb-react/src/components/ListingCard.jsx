import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <div className="listing-card">
      <h3>
        <Link to={`/bookings?listing_id=${listing.listing_id}`}>
          {listing.name}
        </Link>
      </h3>
      <p>{listing.summary}</p>
      <p>Price: ${listing.price} | Rating: {listing.rating}</p>
    </div>
  );
}
