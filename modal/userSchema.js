const mongooose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const SECRET_KEY = "MYNAMEISPRIYASINGHANDFROMSATNAMADHYAPRADESH"; 

const userSchema = new mongooose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
if(!validator.isEmail(value)){
    throw new error("not valid email");
}
        }
    },
    password: {
        type: String,
        required: true,
        minlength:8
    },
    cpassword: {
        type: String,
        required: true,
        minlength:8
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});


// DATABASE = mongodb+srv//piyasngh:priyasingh@cluster0.abm00yc.mongodb.net/mernstacks?retryWrites=true&w=majority

// //====================HASHING THE PASSWORD before saving the  password=========================================
userSchema.pre('save', async function (next) {            
    if (this.isModified('password')) {
        
        this.password = await bcrypt.hash(this.password, 12);                
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});


//we are generating token

userSchema.methods.generateAuthToken = async function () {
    try {
        let tokenD = jwt.sign({ _id: this._id }, process.env.SECRET_KEY,{
expiresIn:"1d"
    });

        this.tokens = this.tokens.concat({ token: tokenD });
        await this.save();
        return tokenD;
    } catch (error) {
        console.log(error);
         res.status(422).json(error)
    }
}

const User = mongooose.model('USER', userSchema);



module.exports = User;

