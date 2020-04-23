const fs = require("fs");
const path = require("path");
const log = console.log;

contactsPath = path.join(
  "./db/contacts.json"
);
console.log(contactsPath);

function listContacts() {
  const readContacts = fs.readFileSync(contactsPath, "utf8");
  console.log(readContacts);
}

function getContactById(contactId) {
  let rawdata = fs.readFileSync(contactsPath, "utf8");
  let contacts = JSON.parse(rawdata);
  console.log(contacts.find((contact) => contact.id === contactId));
}

function removeContact(contactId) {
  const rawdata = fs.readFileSync(contactsPath, "utf8");
  const contacts = JSON.parse(rawdata);
  const updatedData = contacts.filter((contact) => contact.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) throw err;
    console.log("Done writting");
  });
}

function addContact(name, email, phone) {
  let rawdata = fs.readFileSync(contactsPath, "utf8");
  let contacts = JSON.parse(rawdata);
  let id = contacts[contacts.length - 1].id + 1;

  contacts.push({ id, name, email, phone });

  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), (err) => {
    if (err) throw err;
    console.log("Done writting");
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
