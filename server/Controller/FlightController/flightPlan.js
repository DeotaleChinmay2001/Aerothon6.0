const axios = require('axios');

const VITE_AIRCRAFT_PLAN_APIURL = process.env.VITE_AIRCRAFT_PLAN_APIURL;
const VITE_AIRCRAFT_PLAN_KEY = process.env.VITE_AIRCRAFT_PLAN_KEY;
console.log("env", VITE_AIRCRAFT_PLAN_APIURL, VITE_AIRCRAFT_PLAN_KEY);
const fetchFlightPlan = async (fromICAO, toICAO) => {
  try {
    const response = await axios.get(`${VITE_AIRCRAFT_PLAN_APIURL}/search/plans`, {
      params: {
        fromICAO: fromICAO,
        toICAO: toICAO,
        limit: 2
      },
      headers: {
        'Authorization': `Basic ${VITE_AIRCRAFT_PLAN_KEY}`
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
    const response = await axios.get(`${VITE_AIRCRAFT_PLAN_APIURL}/plan/${planId}`, {
      headers: {
        'Authorization': `Basic ${VITE_AIRCRAFT_PLAN_KEY}`
      }
    });
    return response.data.route;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchFlightPlan, fetchPathForFlightPlan };
