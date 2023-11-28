const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.8wqrrau.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const techBisyCollection = client.db("BisyDb").collection("techBisy");
        const addClassCollection = client.db("BisyDb").collection("addclass");
        const usersCollection = client.db("BisyDb").collection("users");

        // tech page 
        app.post('/tech', async (req, res) => {
            const techitem = req.body;
            const result = await techBisyCollection.insertOne(techitem);
            res.send(result)
        })
        app.get('/tech' ,async(req, res) => {
            const result = await techBisyCollection.find().toArray()
            res.send(result)
          })

        // add class
        app.post('/addclass', async (req, res) => {
            const addclass = req.body;
            const result = await addClassCollection.insertOne(addclass);
            res.send(result)
        })

        app.get('/addclass' ,async(req, res) => {
            const result = await addClassCollection.find().toArray()
            res.send(result)
          })
          app.delete('/addclass/:id',async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addClassCollection.deleteOne(query)
            res.send(result)
      
          })
          app.get('/addclass/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await addClassCollection.findOne(filter)
            res.send(result)
      
          })

        //  users
        app.post('/users', async (req, res) => {
            const users = req.body;
            // email uniqe
            const query ={email: users.email}
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({message : 'user already existing',insertedId: null})
                
            }
            const result = await usersCollection.insertOne(users);
            res.send(result)
        })

        app.get('/users' ,async(req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
          })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})