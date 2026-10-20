const express = require("express");
const indexRouter = express.Router();
const authRouter = require("./auths");
const adminRouter = require("./admin");
const productRouter = require("./product");

indexRouter.use(authRouter);
indexRouter.use("/products", productRouter);
indexRouter.use("/admin", adminRouter);
module.exports = indexRouter