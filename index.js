const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require("cors")
require("dotenv").config();

const app = express()
const port = process.env.Port || 5000

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('server running')
})
// tourServices

// uFxclFixPMrj7qyy

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rx3na.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database')
        const database = client.db('tourNetwork');
        const servicesCollection = database.collection('places');

        // get api ------------start-----------------

        app.get('/places', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //-----------------end---------------------//
        // post api
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log("hit the post", place)
            const result = await servicesCollection.insertOne(place);
            res.json(result)
            console.log(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);




app.listen(port, () => {
    console.log('Example app listening at http://localhost:', port)
})