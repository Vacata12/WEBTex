import app from "./serverApp";
import connectDB from "./db/connection";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB()
  .then(() => {
    console.log("Database connected successfully");

    // Start the server only after the database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });