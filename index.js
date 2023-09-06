const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const { query } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ui8slz3.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const addContactCollection = client.db("Contact-app").collection("contacts");


    // add task
		app.post("/contacts", async (req, res) => {
			const addContact = req.body;
			// console.log(req.body);
			const result = await addContactCollection.insertOne(addContact);
			res.send(result);
		});

        

		// get alll contact
		app.get("/contacts", async (req, res) => {
			const query = {};
			const cursor = addContactCollection.find(query);
			const contact = await cursor.toArray();
			const result = contact.reverse();
			res.send(result);
			// console.log(result);
		});

        app.get("/contact/:id", async (req, res) => {
			const id = req.params.id;

			const result = await addContactCollection.findOne({ _id: new ObjectId(id) });
			res.send(result);
            // console.log(result);
		});

        //get specific contact edit
		app.get("/edit/:id", async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: new ObjectId(id),
			};
			const result = await addContactCollection.findOne(query);
			res.send(result);
		});

        // edit contact 
		app.put("/edit/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			const editFirstName = req.body.updateFirstName;
			const editLastName = req.body.updateLastName;
			// const {editFirstName,editLastName} = req.body
			
			const query = { _id: new ObjectId(id) };
			const option = { upsert: true };
			const updatedDoc = {
				$set: {
					firstName: editFirstName,
					lastName: editLastName,
				},
			};
			const result = await addContactCollection.updateOne(query, updatedDoc, option);
			res.send(result);
		});

        app.delete("/contact/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await addContactCollection.deleteOne(query);
			res.send(result);
		});
    
  } finally {
    
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("contact app is running");
});

app.listen(port, () => {
	console.log(`contact server is running on ${port}`);
});