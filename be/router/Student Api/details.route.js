import express from 'express';
const router = express.Router();
import addDetails from '../../controllers/Student/details.controller.js';

router.post("/addDetails", addDetails);
export default router;