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
        const reviewsCollection = database.collection('reviews');
        const usersCollection = database.collection('users');
        const brandsCollection = database.collection('brands');
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hitted', product)
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray();
            res.send(products);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query);
            res.json(product);
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.deleteOne(query);
            console.log('deleted product');
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

            res.send(carts);
        })

        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const cart = await cartsCollection.findOne(query);
            res.json(cart);
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartsCollection.deleteOne(query);
            console.log('hitted');
            res.json(result);
        })
        app.put('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCart = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    appoval: updatedCart.appoval = "Approved"
                }
            };
            console.log(req.body);
            const result = await cartsCollection.updateOne(filter, updateDoc, options);
            console.log('Inserting', id);
            res.json(result);

        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray();
            res.send(users);
        });
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query);
            res.json(user);
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: updatedUser.role = "Admin"
                }
            };
            console.log(req.body);
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log('getting id', id);
            res.json(result);

        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find({})
            const brands = await cursor.toArray();
            res.send(brands);
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
