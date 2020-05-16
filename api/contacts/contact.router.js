import {Router} from "express";
import {contactController} from "./contact.controller";


const router = Router();

//1 CREATE contact
//2. READ all contacts
//3. READ contact by id
//4. UPDATE exiting contact
//5. DELETE existing contact

router.post('/',contactController.validateNewContact, contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:contactId', contactController.getById);
router.put('/:contactId', contactController.validateUpdatedContact, contactController.updateContactById);
router.delete('/:contactId',contactController.deleteContact);
// router.get('/', (req,res,next) => {
//     res.send("users end point");
// });

export const contactRouter = router;