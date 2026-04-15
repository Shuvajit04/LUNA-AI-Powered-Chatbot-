import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';

const app = express()
dotenv.config()

const port =process.env.PORT || 3000
const isVercel = process.env.VERCEL === "1";

// middleware
app.use(express.json());
app.use(cors())

// Database connection helper for local + serverless runtimes
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
};

// Defining Routes
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    // Keep API available even if DB is down.
    next();
  }
});

app.use("/bot/v1/", chatbotRoutes)

if (!isVercel) {
  app.listen(port, () => {
    console.log(`Server is Running on Port ${port}`)
  })
}

export default app;
