import express from "express";
import path from "path";
import mongoose from "mongoose";
import router from "./router/router.js"
import cors from "cors"
const app=express();
const port=4444

// app.use(express.static(path.join(path.resolve(),'/public')));
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.use("/",router)


mongoose.connect( 'mongodb://localhost:27017/Acadview' )
    .then(()=>{
        app.listen(port,()=>(console.log("Server started at http://localhost:4444")))
    })
    .catch((error) => console.error("MongoDB connection error:", error));