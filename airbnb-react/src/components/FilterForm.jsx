import { useState } from 'react';

export default function FilterForm({ onSearch }) {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSearch({
      location: location.trim(),
      propertyType: propertyType.trim(),
      bedrooms: bedrooms.trim(),
    });
  };
  

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        required
      />
      <select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
        <option value="">Any Type</option>
        <option>Apartment</option>
        <option>House</option>
      </select>
      <select value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
        <option value="">Any Bedrooms</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
