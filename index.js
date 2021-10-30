const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require("cors")
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
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

        const PlacesCollection = client.db("tourNetwork").collection("places");

        const touristCollection = client.db("tourNetwork").collection("tourist");

        const database = client.db('tourNetwork');
        const servicesCollection = database.collection('places');

        // get api ------------start-----------------

        app.get('/places', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //-----------------end---------------------//

        // get single service---------------------
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting service', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })


        // post api
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log("hit the post", place)
            const result = await servicesCollection.insertOne(place);
            res.json(result)
            console.log(result);
        });

        // add places  ----------------------->

        app.post("/addPlaces", async (req, res) => {
            console.log(req.body);
            const result = await PlacesCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
        });

        // get search places ------------------->

        app.get("/searchPlaces", async (req, res) => {
            const searchResult = await PlacesCollection.find({
                title: { $regex: req.query.search },
            }).toArray();
            console.log(searchResult);
            res.send(searchResult);
        });

        // get all places ----------------------->

        app.get("/places", async (req, res) => {
            const result = await PlacesCollection.find({}).toArray();
            res.send(result);
        });

        // add tourist ------------------------>

        app.post("/addTourist", async (req, res) => {
            console.log(req.body)
            const result = await touristCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
        });

        // get all tourist ------------------------->

        app.get("/allTourists", async (req, res) => {
            const result = await touristCollection.find({}).toArray();
            res.send(result);
        });

        // delete places collectio---------------

        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete', id)

            const query = {
                _id: ObjectId(id)
            }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
            console.log(result)
        })
        //---------------------------------//

        // delete tourist collection --------------->

        app.delete('/allTourist/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete', id)

            const query = {
                _id: ObjectId(id)
            }
            const result = await touristCollection.deleteOne(query)
            res.json(result)
            console.log(result)
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