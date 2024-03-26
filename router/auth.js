const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { body } = require('express-validator');

require('../db/conn');
const User = require("../modal/userSchema");

// ========================use async=================

router.post('/register', async (req, res) => {

    const { name, email,password, cpassword } = req.body;

    if (!name || !email|| !password || !cpassword) {                     //to validate forms
        return res.status(422).json({ error: "plz filled the field properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });       //schema email:this email

        if (userExist) {
            return res.status(422).json({ error: "email already exist" });
        } else if (password != cpassword) {                           //agr verify nhi ya hua to 
            return res.status(422).json({ error: "email are not msatched" });
        } else {
            const finalUser = new User({ name, email,password,cpassword });
       
            // ======here hashing pasword==========
       const storeData = await finalUser.save();
       console.log(storeData);
            res.status(201).json({status:201,storeData});

        }
    
    }
    catch (error) {
        res.status(422).json(error);
        console.log(error,"catch block error");
    }

});

// Home page route.
router.get("/", function (req, res) {
    res.send("Wiki home page");
  });

//++++++++++++++++++++++++++++++++++++++++++++ ====================login route======================+++++++++++++++++++++++++++++++++++++
router.post('/login',  [
    body('email').isEmail(),
    body('password','Incorrect password').isLength({min:5})
],
async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "plz filled the data" });
    }

    try {
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
         
            const isMatch = await bcrypt.compare(password, userLogin.password);        

            if (!isMatch) {                                              
                res.status(422).json({ error: "invalid credential pass" });
            } else {

               //=================token generate==================

         const token = await userLogin.generateAuthToken();      

            //  ====================cookie generate==================
              res.cookie('usercookie', token, {                                        
                maxAge: new Date(Date.now()+9000000),                          
                 httpOnly: true
             });

              const result = {                     ///response to frontend
                userLogin,
                token
              }
                 res.status(201).json({status:201,result });
            }

        } 
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;

