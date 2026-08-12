import express from 'express';
import dotenv from'dotenv'
import path from "path"

dotenv.config()

const app = express();

const __dirname = path.resolve();

// make readt for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist"))) // make frontend static assests
    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    })
}

app.listen(process.env.PORT,()=>{
    console.log("App is listening")
})