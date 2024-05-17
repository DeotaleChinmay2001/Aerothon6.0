const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users.js");
const productRoutes = require("./routes/product.js");
const cors = require( "cors");
const connectDB = require("./config/db.js");
dotenv.config();

const PORT = process.env.PORT;
connectDB();

const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/hii", (req,res)=>{
    res.json({"data":"hii there"})
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));