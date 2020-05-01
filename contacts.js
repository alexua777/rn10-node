const fs = require("fs");
import { createControllerProxy } from "./api/helpers/controllerProxy";
const contactsPath = "./db/contacts.json";

function listContacts() {
  const readContacts = fs.readFileSync(contactsPath, "utf8");
  // console.log(readContacts);
  return readContacts;
}

function getContactById(contactId) {
  let rawdata = fs.readFileSync(contactsPath, "utf8");
  let contacts = JSON.parse(rawdata);
  const foundContact = contacts.find((contact) => contact.id === contactId);

  if (!foundContact) {
    return "User not found";
  }
  return foundContact;
}

function removeContact(contactId) {
  const rawdata = fs.readFileSync(contactsPath, "utf8");
  const contacts = JSON.parse(rawdata);
  const foundContact = contacts.find((contact) => contact.id === contactId);

  if (!foundContact) {
    return "User not found";
  }
  const updatedData = contacts.filter((contact) => contact.id !== contactId);

  fs.writeFile(contactsPath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) throw err;
    console.log("Done writting");
  });

  return "message: contact deleted";
}

function addContact({ name, email, phone }) {
  let rawdata = fs.readFileSync(contactsPath, "utf8");
  let contacts = JSON.parse(rawdata);
  let id = contacts[contacts.length - 1].id + 1;

  contacts.push({ id, name, email, phone });

  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
    if (err) throw err;
    console.log("Done writting");
  });
}

function updateContact(contactId, { name, email, phone }) {
  let rawdata = fs.readFileSync(contactsPath, "utf8");
  let contacts = JSON.parse(rawdata);
  const foundContact = contacts.find((contact) => contact.id === contactId);

  if (!foundContact) {
    return "User not found";
  }

  const foundContactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  const updatedContact = {
    ...foundContact,
    name,
    email,
    phone,
  };

  contacts[foundContactIndex] = updatedContact;

  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
    if (err) throw err;
  });

  return contacts[foundContactIndex];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
