const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const HttpError = require("../models/errorModel");
const User = require("../models/userModel");

// Register a New User
// POST: api/users/register

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({ email: newEmail });

        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        if (password.trim().length < 6) {
            return next(new HttpError("Password should be at least 6 characters.", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email: newEmail, password: hashedPass });

        res.status(201).json(`New User ${newUser.email} registered.` );
    } catch (error) {
        return next(new HttpError("User registration failed.", 500)); 
    }
}





//Login a New User
// post: api/users/login
// Unprotected
const loginUser = async (req,res,next) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({email:newEmail})

        if(!user){
            return next(new HttpError("Invalid credentials.", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentials", 422));
        }

        const {_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: "1d"})

        res.status(200).json({token, id, name})

    } catch (error) {
        return next(new HttpError("Login failed. please check your credentials.", 422)); 
    }
}




//User Profile
// post: api/users/:id
// Protected
const getUser = async (req,res,next) =>{
    res.json("User Profile")
}


//Change USer Avatar
// post: api/users/change-avatar
// Protected
const changeAvatar = async (req,res,next) =>{
    res.json("Change USer Avatar")
}



//Change USer Details from profile
// post: api/users/edit-user
// Protected
const editUser = async (req,res,next) =>{
    res.json("Edit USer details")
}





//Get Authors
// post: api/users/authors
// UnProtected
const getAuthors = async (req,res,next) =>{
    res.json("Get all Authors")
}



module.exports = {registerUser, loginUser, getUser, getAuthors, editUser, changeAvatar};