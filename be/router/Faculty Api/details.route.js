import express from 'express';
const router = express.Router();
import addDetails from '../../controllers/Faculty/details.controller.js';

router.post("/addDetails", addDetails);
export default router;