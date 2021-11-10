const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vy5ro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('Classy_watch_store');
        const productsCollection = database.collection('products');
        const cartsCollection = database.collection('carts');
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hitted', product)
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray();
            console.log('products working')
            res.send(products);

        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query);
            res.json(product);
        })
        app.post('/carts', async (req, res) => {
            const cart = req.body;
            console.log(cart);
            const result = await cartsCollection.insertOne(cart);
            res.json(result);
        });
        app.get('/carts', async (req, res) => {
            const cursor = cartsCollection.find({})
            const carts = await cursor.toArray();
            console.log('products working')
            res.send(carts);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('hellow from the other side');
})
app.get('/help', (req, res) => {
    res.send('hellow from help');
})
app.listen(port, () => {
    console.log('from port');
})
