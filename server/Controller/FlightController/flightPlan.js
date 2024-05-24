const axios = require('axios');

const AIRCRAFT_PLAN_APIURL = process.env.AIRCRAFT_PLAN_APIURL;
const AIRCRAFT_PLAN_KEY = process.env.AIRCRAFT_PLAN_KEY;
const NEAREST_AIRPORTS_API_URL = "https://data.api.xweather.com/places/airports/within/";
const NEAREST_AIRPORTS_CLIENT_ID = "I7cK1Y0hN5hfB7u48ax3U";
const NEAREST_AIRPORTS_CLIENT_SECRET = "YBlr7gHMmZllEvRsYxPt2jzLmwfx1dAs1QEDOD5D";

const findNearestAirports = async (latitude, longitude) => {
  try {
    const response = await axios.get(NEAREST_AIRPORTS_API_URL, {
      params: {
        p: `${latitude},${longitude}`,
        limit: 2,
        radius: '200km',
        filter: 'medairport',
        client_id: NEAREST_AIRPORTS_CLIENT_ID,
        client_secret: NEAREST_AIRPORTS_CLIENT_SECRET
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearest airports:", error);
    throw error;
  }
};



const fetchFlightPlan = async (fromICAO, toICAO) => {
  try {
    const response = await axios.get(`${AIRCRAFT_PLAN_APIURL}/search/plans`, {
      params: {
        fromICAO: fromICAO,
        toICAO: toICAO,
        limit: 2
      },
      headers: {
        'Authorization': `Basic ${AIRCRAFT_PLAN_KEY}`
      }
    });
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

// Function to fetch path for a specific flight plan
const fetchPathForFlightPlan = async (planId) => {
  try {
    const response = await axios.get(`${AIRCRAFT_PLAN_APIURL}/plan/${planId}`, {
      headers: {
        'Authorization': `Basic ${AIRCRAFT_PLAN_KEY}`
      }
    });
    return response.data.route;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchFlightPlan, fetchPathForFlightPlan , findNearestAirports};
