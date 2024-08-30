const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

// Define allowed origins
const allowedOrigins = [
  'https://stupendous-naiad-9b0879.netlify.app',
  /^https:\/\/.*\.netlify\.app$/,
  'http://localhost:3000'  // Allow localhost for development
];

// CORS options configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.some(allowedOrigin => 
      typeof allowedOrigin === 'string' ? allowedOrigin === origin : allowedOrigin.test(origin))) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(msg);
      return callback(null, false);  // Do not throw an error, just deny the request
    }
  },
  optionsSuccessStatus: 200,  // Some legacy browsers choke on 204
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Ensure allowed methods are specified
  allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
};

// Middleware to set headers manually for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');  // Replace with your frontend's origin or set dynamically
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');  // Added 'Authorization' if needed
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');  // Allow all necessary HTTP methods
  next();
});

// Use CORS middleware with specified options
app.use(cors(corsOptions));
app.use(express.json());  // Middleware to parse JSON bodies

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}, Origin: ${req.headers.origin}`);
  next();
});

// Global handling for OPTIONS requests to ensure they are handled correctly
app.options('*', cors(corsOptions)); 

const db = require("./models");

//handles requests to the "/activityone" path
const activityOneRouter = require('./routes/ActivityOne');
app.use("/activityone", activityOneRouter);

// Repeat for other routers...

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
