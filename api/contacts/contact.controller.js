
import { contactModel } from "./contacts.model";
import Joi from "joi";


class ContactController {
   async createContact(req, res, next) {
    try {
      const newContact =  await contactModel.createContact(req.body);
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
    if (!Object.keys(req.body).length) {
      return res.status(400).json(`MissingFields:missing fields`);
    }
    next();
  }

  async getAllContacts(req, res, next) {
    
    const contactList = await contactModel.getAllContacts();
    res.status(200).json(contactList);
  }

  async getById(req, res, next) {
    try {
      const { contactId } = req.params;
      const foundContact = await contactModel.getById(contactId);

      // if (!foundContact) {
      //   return "User not found";
      // }
      return res.status(200).json(foundContact);
    } catch (err) {
      next(err);
    }
  }

  async updateContactById(req, res, next) {
    try {
      const { contactId } = req.params;
      const foundContact = contactModel.getById(contactId);

      if (!foundContact) {
        return "User not found";
      }
      console.log(foundContact);
      
      const updatedContact = await contactModel.updateContactById(
        contactId,
        req.body
      );
      return res.status(200).json(updatedContact.value);
    } catch (err) {
      next(err);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const { contactId } = req.params;
      const foundContact = contactModel.getById(contactId);

      if (!foundContact) {
        return "User not found";
      }
           
      const removedContact = await contactModel.deleteContact(contactId);
      return res.status(200).json(removedContact);
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
