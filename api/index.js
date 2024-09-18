const express= require('express');
const cors=require('cors');
require('dotenv').config();
const mongoose= require('mongoose');

const app= express();
app.use(cors());
const port=8080;
const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("connected to Database");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

connect();
app.use(express.json());

const authRoutes= require('./routes/auth');
const blogRoutes= require('./routes/blog');
app.use('/',authRoutes);
app.use('/',blogRoutes);

app.get('/',(req,res)=>{
    res.send("hello world");
    
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});