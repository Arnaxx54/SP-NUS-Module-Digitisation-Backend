const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

// const allowedOrigins = [
//   'https://stupendous-naiad-9b0879.netlify.app',
//   /\.netlify\.app$/ // Allow any subdomain of netlify.app
// ];

const allowedOrigins = [
  'https://stupendous-naiad-9b0879.netlify.app',
  /^https:\/\/.*\.netlify\.app$/,
  'http://localhost:3000'  // Allow localhost for development
];


const corsOptions = {
  origin: function (origin, callback) {
    //allow requests with no origin 
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowedOrigin => 
      typeof allowedOrigin === 'string' ? allowedOrigin === origin : allowedOrigin.test(origin))) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(msg);
      return callback(new Error(msg), false);
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const db = require("./models");

//handles requests to the "/activityone" path
const activityOneRouter = require('./routes/ActivityOne');
app.use("/activityone", activityOneRouter);

//handles requests to the "/activitytwo" path
const activityTwoRouter = require('./routes/ActivityTwo');
app.use("/activitytwo", activityTwoRouter);

//handles requests to the "/activitythree" path
const activityThreeRouter = require('./routes/ActivityThree');
app.use("/activitythree", activityThreeRouter);

//handles requests to the "/activityfour" path
const activityFourRouter = require('./routes/ActivityFour');
app.use("/activityfour", activityFourRouter);

//handles requests to the "/activityfive" path
const activityFiveRouter = require('./routes/ActivityFive');
app.use("/activityfive", activityFiveRouter);

//handles requests to the "/activitysix" path
const activitySixRouter = require('./routes/ActivitySix');
app.use("/activitysix", activitySixRouter);

//handles requests to the "/userauth" path
const usersRouter = require('./routes/Users');
app.use("/userauth", usersRouter);

//handles requests to the "/home" path
const homeRouter = require('./routes/Home');
app.use("/home", homeRouter);

//handles requests to the "/studentlog" path
const studentLogsRouter = require('./routes/StudentLog');
app.use("/studentlog", studentLogsRouter);

//handles requests to the "/summary" path
const summaryRouter = require('./routes/Summary');
app.use("/summary", summaryRouter);

//handles requests to the "/instructorlog" path
const instructorLogsRouter = require('./routes/InstructorLog');
app.use("/instructorlog", instructorLogsRouter);

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
