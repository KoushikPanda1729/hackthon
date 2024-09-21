import connectDB from "./db/db.connect.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error occured after DB connection : ", error);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log("App is running at port : ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error : ", error);
    process.exit(1);
  });
