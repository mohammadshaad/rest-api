const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 6000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Product = mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/items", (req, res) => {
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
