const express=require('express');
const router=express.Router();
const bcrypt= require('bcrypt');
const user=require('../model/user');
const jwt=require('jsonwebtoken');

router.post("/register", async(req,res)=>{
    const {name,email,password,address}=req.body;
    try {
        const existingUser= await user.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'user already exists'});
        };
        const salt= await bcrypt.genSalt(10);
        const hashpassword= await bcrypt.hash(password,salt);
        const newUser= new user({
            name,
            email,
            password:hashpassword,
            address
        });
        const savedUser= await newUser.save();
        res.status(200).json(savedUser);
        console.log(savedUser);
        
    } catch (error) {
        console.log("error during registeration");
        res.status(500).json({message:'Server error'});
        
    }
    
});
router.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    try {
       const checkuser=await user.findOne({email});
       if(!checkuser){
        return res.status(400).json({message:'user not found'});
       }
       const isMatch = await bcrypt.compare(password, checkuser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        };
        const token = jwt.sign({ id: checkuser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with token
        res.status(200).json({ token, checkuser: { id: checkuser._id, name: checkuser.name, email: checkuser.email, address: checkuser.address } });
        console.log("User logged in:", checkuser);
        
    } catch (error) {
        console.log("error during registeration");
        res.status(500).json({message:'Server error'});
        
    }
    
});
module.exports=router;