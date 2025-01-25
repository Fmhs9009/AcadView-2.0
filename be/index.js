import express from 'express';
import mongoose from 'mongoose';
import router from "./router/router.js"
import cors from 'cors';
// import facultyCredential from './models/facultyCredential.js';
// import adminDetails from './models/Admin/details.models.js';
import AdmindetailsRoute from './router/Admin Api/details.route.js';
import FacultydetailsRoute from './router/Faculty Api/details.route.js';
import StudentDetailsRoute from './router/Student Api/details.route.js'

const app = express();
const API_PORT = 4444; 



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use('/', router);

app.use("/api/admin/details",AdmindetailsRoute );

app.use("/api/faculty/details",FacultydetailsRoute );

app.use("/api/student/details", StudentDetailsRoute);

mongoose.connect("mongodb+srv://satvik24gupta:root@cluster0.g70ub.mongodb.net/")
    .then(() => {
        app.listen(API_PORT, () => {
            console.log(`Backend -> http://localhost:${API_PORT}`);
        });
    })
    .catch(err => {
        console.error('Error while connecting to DB:', err);
    });

