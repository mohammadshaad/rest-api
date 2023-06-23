const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Port number
const PORT = process.env.PORT || 6000;

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// Create a schema
const productSchema = new mongoose.Schema({
  name: String,
  image: Array,
  projectName: String,
  price: Number
});

// Create a model
const Product = mongoose.model("Product", productSchema);

// Create a document
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all items
app.get("/api/items", (req, res) => {
  Product.find({})
    .exec()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});


app.post("/items", (req, res) => {
  try {
    const itemName = req.body.name;
    const itemPrice = req.body.price;
    const item = new Product({
      name: itemName,
      price: itemPrice,
    });
    console.log("Item: ", item);
    item.save().then(() => {
      console.log("New item created");
      res.send("New item created");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
