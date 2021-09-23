/* Dependencies */
// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/* Initialization */

// Port
const port = 3000;

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Start up an instance of app
const app = express();

/*******************************************************************/
/* Middleware */

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));
/*******************************************************************/
/* Callback Functions */

// Callback to debug
const serverMessage = () =>
  console.log(`Server is up and running on http://localhost:${port}/`);
// Callback function to complete GET '/all'
const getProjectData = (req, res) => res.json({ cod: '200', ...projectData });
// Callback function to handle post request
const updateProjectData = (req, res) => {
  const data = req?.body;
  if (!data?.feelings?.trim()) {
    res.status(500);
    res.json({
      cod: '500',
      message: 'Feelings is missing',
    });
  } else {
    projectData = { ...data };
    res.status(200);
    res.json({ cod: '200' });
  }
};

/******************************************************************/
/* App Routes - Initialize all route with a callback function */

// GET Route
app.get('/all', getProjectData);
// POST Route
app.post('/saveData', updateProjectData);
/***************************************************************/

// Spin up the server
app.listen(port, serverMessage);
