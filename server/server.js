const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users.js");
const reportRoutes = require("./routes/reports.js");
const cors = require("cors");
const connectDB = require("./config/db.js");
const http = require("http");
const initializeSocket = require("./socketHandler.js");
const axios = require("axios");

dotenv.config();

const PORT = process.env.PORT;
connectDB();

const app = express();
const server = http.createServer(app);

app.get("/predict", async (req, res) => {
  try {
    data = {
      id: [1],
      cycle: [162],
      setting1: [0.471264],
      setting2: [0.833333],
      setting3: [0.0],
      s1: [0.0],
      s2: [0.584337],
      s3: [0.46174],
      s4: [0.695982],
      s5: [0.0],
      s6: [1.0],
      s7: [0.455717],
      s8: [0.378788],
      s9: [0.101947],
      s10: [0.0],
      s11: [0.559524],
      s12: [0.373134],
      s13: [0.470588],
      s14: [0.122975],
      s15: [0.679492],
      s16: [0.0],
      s17: [0.5],
      s18: [0.0],
      s19: [0.0],
      s20: [0.496124],
      s21: [0.358465],
    };
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/sensorPredict",
      data
    );

    res.json(flaskResponse.data);
  } catch (error) {
    console.error("Error making prediction:", error);
    res.status(500).send("Error making prediction.");
  }
});

app.get("/weatherPredict", async (req, res) => {
  try {
    data = {
      main_temp: 20.5,
      visibility: 10000,
      wind_speed: 5.5,
      pressure: 1012,
      humidity: 80,
    };
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/weatherPredict",
      data
    );

    res.json(flaskResponse.data);
  } catch (error) {
    console.error("Error making prediction:", error);
    res.status(500).send("Error making prediction.");
  }
});

app.use(express.json());
app.use(cors());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reports", reportRoutes);

initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
