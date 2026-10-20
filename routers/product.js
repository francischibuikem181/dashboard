const express = require('express');
const productRouter = express.Router();

productRouter.get ('/test-product-login', (req,res)=>{
    res.send('Hi from product routher');
})

module.exports = productRouter;