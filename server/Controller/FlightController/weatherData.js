const axios = require('axios');

const getWeatherData = async (apiKey, latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);

    
      const weatherData = response.data;
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };
  module.exports = { getWeatherData};