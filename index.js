const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
var cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// !Middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is Running!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmtuj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const productsDatabase = client.db("simple_agenda").collection("products");

    // !GET All Products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsDatabase.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    // !ADD Product (POST)
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsDatabase.insertOne(newProduct);
      res.send(result);
    });
    // !DELETE Product
    app.delete("/product/:productId", async (req, res) => {
      const id = req.params.productId;
      const query = { _id: ObjectId(id) };
      const result = await productsDatabase.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
