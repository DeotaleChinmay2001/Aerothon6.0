const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users.js");
const productRoutes = require("./routes/product.js");
const cors = require("cors");
const connectDB = require("./config/db.js");
const http = require('http');
const initializeSocket = require('./socketHandler.js');
const { sensData, csvData } = require("./genSensData.js");
const Record = require("./models/sensor.model.js")
const csvParser = require('csv-parser');

dotenv.config();

const PORT = process.env.PORT;
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

initializeSocket(server);
server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});

