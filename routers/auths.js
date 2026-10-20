const express = require('express');
const { loginUser, signupUser, authClass, loginFirst, getLoginFirst} = require('../controllers/auth/login');
const authRouter = express.Router();
const { forLoginSess, ForDash} = require('../middlewares/logger')
// const {loginUser,  signupUser , authClass} = require('../controllers/auth/login')
const {forSignupFirst} = require('../controllers/auth/signupPost')
const  usersignup  = require("../schemas/userSchemas");
const validateRequest = require("../middlewares/validate");


authRouter.get ('/auth-login', (req,res)=>{
    res.send('Hi from auth routher');
})
//  authRouter.get('/login-user', (req, res)=>{
//     res.render('login')
//  })
 authRouter.get('/sign-user', (req, res)=>{
    res.render('signup')

 })

authRouter.get('/login-user', getLoginFirst.login)
 authRouter.post('/post-signup', validateRequest(usersignup), forSignupFirst.signupPost)
authRouter.post('/login-post', loginFirst.login)
authRouter.get('/test-loginUser', loginUser) 
authRouter.get('/test-signupUser',  signupUser)
authRouter.get('/test-forgotpwd', authClass.forgotpwd)
module.exports = authRouter;

