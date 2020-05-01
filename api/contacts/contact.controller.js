const {
  listContacts,
  getContactById,
  removeContact,
  updateContact,
  addContact,
} = require("../../contacts");
import Joi from "joi";
import { createControllerProxy } from "../helpers/controllerProxy";

class ContactController {
  createContact(req, res, next) {
    try {
      const newContact = {
        ...req.body,
      };
      addContact(newContact);

      return res.status(201).json(newContact);
    } catch (err) {
      next(next);
    }
  }

  validateNewContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validateResult = Joi.validate(req.body, contactRules);
    if (validateResult.error) {
      return res
        .status(400)
        .json(`MissingFields:${validateResult.error.details[0].message}`);
    }
    next();
  }

  validateUpdatedContact(req, res, next) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).json(`MissingFields:missing fields`);
    }
    next();
  }

  getAllContacts(req, res, next) {
    const contactList = JSON.parse(listContacts());
    res.status(200).json(contactList);
  }

  getById(req, res, next) {
    try {
      const { contactId } = req.params;
      const foundContact = getContactById(Number(contactId));

      return res.status(200).json(foundContact);
    } catch (err) {
      next(err);
    }
  }

  updateContactById(req, res, next) {
    try {
      const { contactId } = req.params;
      const updatedContact = updateContact(Number(contactId), req.body);
      return res.status(200).json(updatedContact);
    } catch (err) {
      next(err);
    }
  }

  deleteContact(req, res, next) {
    try {
        const { contactId } = req.params;
     const  removedContact = removeContact(Number(contactId));
        return res.status(200).json(removedContact);

    } catch (err) {
      next(err);
    }
  }
}

export const contactController = createControllerProxy(new ContactController());
