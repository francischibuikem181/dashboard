const joi = require("joi");
const usersignup = joi.object({
    name: joi.string().min(3).max(20).required().label("First Name"),
    // lastName: joi.string().min(3).max(20).required().label("last Name"),
    email: joi.string().email().required().label("Email"),
    password: joi.string().min(8).required().label("password")
})

module.exports = usersignup
