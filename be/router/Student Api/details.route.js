import express from 'express';
const router = express.Router();
import {addDetails, updateDetails} from '../../controllers/Student/details.controller.js';

router.post("/addDetails", addDetails);
router.put("/updateDetails", updateDetails);
export default router;