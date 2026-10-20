const express = require('express');
const adminRouter = express.Router();

adminRouter.get ('/test-admin-login', (req,res)=>{
    res.send('Hi from admin routher');
})

module.exports = adminRouter;