// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard';

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  // List of popular markets for initial random display
  const popularMarkets = ['Barcelona', 'Porto', 'New York', 'Istanbul','Sydney'];

  // On mount, fetch a random market's listings
  useEffect(() => {
    const randomLocation = popularMarkets[Math.floor(Math.random() * popularMarkets.length)];
    fetchListings({ location: randomLocation, propertyType: '', bedrooms: '' });
  }, []);

  // Generic fetch function
  const fetchListings = async ({ location, propertyType, bedrooms }) => {
    setError('');
    try {
      const response = await axios.get('/api/listings', {
        params: {
          location: location.trim(),
          propertyType: propertyType.trim(),
          bedrooms: bedrooms.trim(),
        },
      });
      const data = response.data;
      if (Array.isArray(data)) {
        setListings(data);
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      console.error(err);
      setListings([]);
      setError('Unable to load listings.');
    }
  };

  return (
    <div className="bg-vim-background min-h-screen text-vim-foreground">
      {/* Header */}
      <header className="bg-vim-background shadow-md">
        <div className="container mx-auto flex justify-center items-center py-4 px-6">
          <h1 className="text-3xl font-extrabold">Airbnb Clone</h1>
        </div>
      </header>

      {/* Search Bar */}
      <section className="container mx-auto px-6 mt-8">
        <div className="flex justify-center">
          <form
            onSubmit={e => { e.preventDefault(); fetchListings(formValues); }}
            className="bg-vim-background-alt shadow-lg rounded-full p-4 flex flex-wrap items-center gap-4 max-w-4xl"
          >
            {/* Inputs update local formValues state */}
            {/* Replace these with controlled inputs if preferred */}
            <input
              type="text"
              placeholder="Where are you going?"
              className="flex-1 min-w-[200px] px-4 py-2 rounded-full border border-vim-border bg-vim-input focus:outline-none focus:ring-2 focus:ring-vim-accent"
              onChange={e => fetchListings({ location: e.target.value, propertyType: '', bedrooms: '' })}
            />
            <select
              className="px-4 py-2 rounded-full border border-vim-border bg-vim-input focus:outline-none focus:ring-2 focus:ring-vim-accent"
              onChange={e => fetchListings({ location: '', propertyType: e.target.value, bedrooms: '' })}
            >
              <option value="">Any type</option>
              <option value="Entire home/apt">Entire home/apt</option>
              <option value="Private room">Private room</option>
              <option value="Shared room">Shared room</option>
            </select>
            <select
              className="px-4 py-2 rounded-full border border-vim-border bg-vim-input focus:outline-none focus:ring-2 focus:ring-vim-accent"
              onChange={e => fetchListings({ location: '', propertyType: '', bedrooms: e.target.value })}
            >
              <option value="">Bedrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                className="bg-vim-accent text-vim-background px-6 py-2 rounded-full shadow hover:opacity-90 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Listings */}
      <main className="container mx-auto px-6 py-8">
        {error ? (
          <p className="text-vim-accent mb-4 text-center">{error}</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map(listing => (
              <ListingCard key={listing.listing_id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-vim-comment">No properties found.</p>
        )}
      </main>
    </div>
  );
}
