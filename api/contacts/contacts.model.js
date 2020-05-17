// const { MongoClient, ObjectId } = require("mongodb");
import mongoose, { Schema, Types } from "mongoose";
const { ObjectId } = mongoose.Types;

const MONGO_DB_URL =
  "mongodb+srv://db_admin:0W0kaqvfLNYrjSI7@cluster0-xfoxb.mongodb.net/db-contacts?retryWrites=true&w=majority";
const MONGO_DB_NAME = "db-contacts";

const contactSchema = new Schema({ 
  email: String,
  passwordHash: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

contactSchema.statics.createContact = createContact;
contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.getById = getById;
contactSchema.statics.updateContactById = updateContactById;
contactSchema.statics.deleteContact = deleteContact;
contactSchema.statics.findUserByEmail = findUserByEmail;
contactSchema.statics.findContactByToken = findContactByToken;

async function createContact(userParams) {
  return this.create(userParams);
}

async function getAllContacts() {
  return this.find();
}

async function getById(id) {
  if (!ObjectId.isValid(id)) {
    return "User not found";
  }

  return this.findById(id);
}

async function findUserByEmail(email){
  return this.findOne({email});
}

async function updateContactById(id, userParams) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findByIdAndUpdate(id, { $set: userParams }, { new: true });
}


async function findContactByToken (token) {
    return this.findOne({token})
}

async function deleteContact(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return this.findByIdAndDelete(id);
}

export const contactModel = mongoose.model("User", contactSchema);

// class ContactsModel {
//   constructor() {
//     // this.contacts = null;

//   }
//   //create Contact
//   //find all contacts
//   //find contact by id
//   //update contact by id
//   //remove contact by id

//   async createContact(contactParams) {
//     await this.getContactCollection();
//    const insertResult = await this.contacts.insertOne(contactParams);

//    return this.contacts.findOne({_id: new ObjectId(insertResult.insertedId)});
//   }

//   async getAllContacts() {
//     await this.getContactCollection();
//     return this.contacts.find().toArray();
//   }

//   async getById(id) {
//     await this.getContactCollection();
//     if (!ObjectId.isValid(id)) {
//       return null;
//     }
//      return this.contacts.findOne({ _id: new ObjectId(id) });
//   }

//   async updateContactById(id, userParams) {
//     await this.getContactCollection();

//     if (!ObjectId.isValid(id)) {
//       return null;
//     }
//     return this.contacts.findOneAndUpdate(
//       {
//         _id: new ObjectId(id),
//       },
//       { $set: userParams },
//       { new: true }
//     );
//   }

//   async deleteContact(id) {
//     await this.getContactCollection();
//     if (!ObjectId.isValid(id)) {
//       return null;
//     }

//     return this.contacts.deleteOne({ _id: new ObjectId(id) });
//   }

//   async getContactCollection() {
//     if (this.contacts) {
//       return;
//     }
//     const client = await MongoClient.connect(MONGO_DB_URL);
//     const db = client.db(MONGO_DB_NAME);

//     this.contacts = await db.createCollection("contacts");

//   }
// }

// export const contactModel = new ContactsModel();
