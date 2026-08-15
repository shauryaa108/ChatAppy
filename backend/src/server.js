import express from 'express';
import dotenv from'dotenv'
import path from "path"
import { DB_CONN } from './lib/db.connection.js';
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()
const app = express();
const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);


// make ready for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist"))) // make frontend dist folder our static assests
    // everything otherthan our api routes which we will use (app.use("/api/routes/auth", authRouter)) should be served as the index.html file which is our react app
    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    })
}

app.listen(process.env.PORT,()=>{
    console.log("App is listening on port ", process.env.PORT);
    DB_CONN();
})