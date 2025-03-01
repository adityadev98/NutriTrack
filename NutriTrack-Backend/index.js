//entry point for api
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import cors from 'cors';
import {nutriRoutes, authRoutes, profileRoutes} from './routes/index.js';

dotenv.config();

console.log(process.env.MONGO_URI);
const PORT = process.env.PORT || 8001

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api",nutriRoutes)
app.use("/api/user",profileRoutes)

app.listen(PORT,()=>{
    connectDB();
    console.log("✅ Server is up and running @ http://localhost:",PORT)
});

