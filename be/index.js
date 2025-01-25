import express from 'express';
import mongoose from 'mongoose';
import router from "./router/router.js"
import cors from 'cors';


const app = express();
const API_PORT = 4444; 



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/', router);


mongoose.connect("mongodb+srv://satvik24gupta:root@cluster0.g70ub.mongodb.net/")
    .then(() => {
        app.listen(API_PORT, () => {
            console.log(`Backend -> http://localhost:${API_PORT}`);
        });
    })
    .catch(err => {
        console.error('Error while connecting to DB:', err);
    });

