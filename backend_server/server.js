// server/server.js

const express = require('express');
const cors = require('cors');
// Import ObjectId alongside MongoClient
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3001;

// Allow all origins during development
app.use(cors());
// Parse JSON request bodies
app.use(express.json());


// including the sample_airbnb database and any options
const uri = 'mongodb+srv://s3981318:furqaan786@cluster0.co0zsdz.mongodb.net/sample_airbnb?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function start() {
  try {
    // 1) Connect to MongoDB Atlas
    await client.connect();
    console.log('✅ MongoDB connected');

    // Get collections
    const listingsCol = client.db('sample_airbnb').collection('listingsAndReviews');
    const bookingsCol = client.db('sample_airbnb').collection('bookings');

    // 2) GET /api/listings → filter by market, type, bedrooms
    app.get('/api/listings', async (req, res) => {
      try {
        const location     = (req.query.location     || '').trim();
        const propertyType = (req.query.propertyType || '').trim();
        const bedroomsRaw  = (req.query.bedrooms     || '').trim();

        console.log('🔎 Received filters:', { location, propertyType, bedrooms: bedroomsRaw });

        // Build case-insensitive regex for address.market
        const query = {
          'address.market': { $regex: `^${location}$`, $options: 'i' }
        };
        if (propertyType) query.room_type = propertyType;
        if (bedroomsRaw) {
          const bd = parseInt(bedroomsRaw, 10);
          if (!isNaN(bd)) query.bedrooms = bd;
        }

        console.log('📐 Mongo query object:', JSON.stringify(query));

        // Fetch documents, projecting _id (for key) and needed fields
        const docs = await listingsCol
          .find(query, {
            projection: {
              _id: 1,
              name: 1,
              summary: 1,
              price: 1,
              'review_scores.review_scores_rating': 1
            }
          })
          .limit(20)
          .toArray();

        console.log(`🔁 Found docs: ${docs.length}`);

        // Map to response shape, converting Decimal128 to strings
        const results = docs.map(d => ({
          listing_id: d._id.toString(),
          name:       d.name,
          summary:    d.summary,
          price:      d.price.toString(),
          rating:     d.review_scores?.review_scores_rating?.toString() ?? 'N/A'
        }));

        return res.json(results);
      } catch (err) {
        console.error('❌ Error in GET /api/listings:', err);
        return res.status(500).json({ error: 'Server error' });
      }
    });

    // 3) POST /api/bookings → create a new booking (referenced)
    app.post('/api/bookings', async (req, res) => {
      try {
        const {
          listing_id,
          startDate,
          endDate,
          clientName,
          email,
          phoneDay,
          phoneMobile,
          postalAddress,
          homeAddress
        } = req.body;

        // Validate required fields
        if (!listing_id || !startDate || !endDate || !clientName || !email) {
          return res.status(400).json({ error: 'Missing required booking fields' });
        }

        // Build booking document
        const booking = {
          listing_id,
          startDate:   new Date(startDate),
          endDate:     new Date(endDate),
          clientName,
          email,
          phoneDay:    phoneDay || '',
          phoneMobile: phoneMobile || '',
          postalAddress,
          homeAddress,
          createdAt:   new Date()
        };

        // Insert into bookings collection
        const result = await bookingsCol.insertOne(booking);

        // Return the new booking’s ID
        return res.status(201).json({ booking_id: result.insertedId.toString() });
      } catch (err) {
        console.error('❌ Error in POST /api/bookings:', err);
        return res.status(500).json({ error: 'Server error' });
      }
    });

    // 4) GET /api/bookings/:id → fetch a single booking by _id
    app.get('/api/bookings/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const booking = await bookingsCol.findOne({ _id: new ObjectId(id) });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        return res.json(booking);
      } catch (err) {
        console.error('❌ Error in GET /api/bookings/:id:', err);
        return res.status(500).json({ error: 'Server error' });
      }
    });

    // 5) Start the server
    app.listen(PORT, () => {
      console.log(`API 👉 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
