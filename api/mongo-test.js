const MongoDB = require("mongodb");
const { MongoClient } = MongoDB;

const MONGO_DB_URL =
  "mongodb+srv://db_admin:0W0kaqvfLNYrjSI7@cluster0-xfoxb.mongodb.net/db-contacts?retryWrites=true&w=majority";
const MONGO_DB_NAME = "db-contacts";


async function getContactCollection() {
    const client = await MongoClient.connect(MONGO_DB_URL);
    const db = client.db(MONGO_DB_NAME);

   const contacts = await db.createCollection("contacts");
    await contacts.insertOne({
      name: "Alex 2",
      email: "ab2dfgdfg@.com",
      phone: "2123423423",
    });

    const result = await contacts.find();
    console.log(result);
  }

  getContactCollection();