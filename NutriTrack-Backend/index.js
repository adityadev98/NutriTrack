//entry point for api
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import cors from 'cors';

import nutriRoutes from './routes/nutriRoutes.js';

dotenv.config();

console.log(process.env.MONGO_URI);
const PORT = process.env.PORT || 8001

const app = express();

app.use(express.json()); //express.json is an inbuilt middleware that helps to accept JSOn data in the req.body
app.use(cors());

app.use("/",nutriRoutes)

app.listen(PORT,()=>{
    connectDB();
    console.log("Server is up and running @ http://localhost:",PORT)
});

