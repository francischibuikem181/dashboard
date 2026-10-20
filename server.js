require("dotenv").config();
const path = require("path");
const express = require("express");
const multer = require("multer");
const PORT = 3000;

//pool
const pool = require("./config/database");
// for css styling
// middlewares
const { loginfo } = require("./middlewares/logger");

const server = express();

const fs = require("fs");
if (!fs.existsSync("upload")) fs.mkdirSync("upload");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    const uniquesuffixforfiles = Date.now();
    const originalFileName = file.originalname.split(".")[0];
    cb(
      null,
      `${uniquesuffixforfiles}_${originalFileName}${path.extname(file.originalname)}`,
    );
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const testFileExtension = allowed.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mime = allowed.test(file.mimetype);
    if (testFileExtension && mime) {
      cb(null, true);
    } else {
      cb(new Error("only image are allowed"));
    }
  },
});

// api
server.use(express.json());
// ssr
server.use(express.urlencoded({ extended: false }));

const bcrypt = require("bcrypt");

//session
const session = require("express-session");
//session configuration
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIROMENT === "development" ? false : true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // expires in one hour
    },
  }),
);
server.use(express.static("public"));

const indexRouter = require("./routers/index");
server.use(indexRouter);

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

server.get("/", (req, res) => {
  console.log(req);
  res.render("index", { name: "john" });
});
server.get("/about", (req, res) => {
  res.send("about page");
});

server.get("/site", (req, res) => {
  const names = ["john", "emma", "samuel", "walker"];
  const user = "admin";
  res.render("index", {
    names,
    user,
  });
});

server.post(
  "/upload-profile-photo",
  uploader.single("myProfilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.send("no file uploaded");
      }

      const imgName = req.file.filename;
      const loggedInUserId = req.session.user.id;
      // console.log(loggedInUserId)
      // return console.log(req.session.user.id)

      const existing = await pool.query(
        `SELECT* FROM profiles WHERE userid = $1`,
        [loggedInUserId],
      );
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE profiles SET profileimage = $1 WHERE userid = $2`,
          [imgName, loggedInUserId],
        );
      } else {
        await pool.query(
          `INSERT INTO profiles (userid, profileimage) values ($1, $2)`,
          [loggedInUserId, imgName],
        );
      }

      req.session.user.profilePhoto = imgName;
      console.log(req.session.user);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      const errMsg = error.message || error.messages;
      return res.json({
        status: errMsg,
      });
    }
  },
);

server.get("/data", (req, res) => {
  const grid = [
    { date: "02-07-26", type: "deposite", amount: "$200", status: "approved" },
    { date: "withdrawal", amount: "$8000", status: "declined" },
  ];
  res.render("test2", {
    grid,
  });
});

// yyfythfht

server.post("/api", (req, res) => {
  const { name, email, age } = req.body;
  console.log(name, email, age);
  res.status(200).json({
    message: "success",
  });
});
//fetch record
server.get("/fetch-record", async (req, res) => {
  const [results] = await pool.execute(
    `select * FROM records WHERE id = ?`,
    [1],
  );
  return res.status(200).json({
    records: results,
  });
});
// select

server.post("/store", async (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) {
    return res.status(400).json({
      message: "incomplete data",
    });
  }
  const [result] = await pool.execute(
    `INSERT INTO records (name, email, age ) VALUES(?,?,?)`,
    [name, email, age],
  );
  res.status(200).json({
    message: "sent",
    result: result,
  });
});

// UPDATE alway use where
server.post("/upadate-user", async (req, res) => {
  const { name, age } = req.body;
  const [result] = await pool.execute(
    `UPDATE records SET name = ?, age = ? WHERE id = ?`,
    [name, age, 1],
  );
  res.status(200).json({
    message: "done",
    result: result,
  });
});

//DELETE
server.delete("/delete-user", async (req, res) => {
  const [result] = await pool.execute(`DELETE FROM records WHERE id = ?`, [1]);
  res.status(200).json({
    result: result,
  });
});

//
server.get("/login", (req, res) => {
  res.render("form");
});

server.post("/submit-form", async (req, res) => {
  const { email, password } = req.body;
  res.send({
    email,
    password,
  });
});

// SESSION
server.get("/set-session", (req, res) => {
  req.session.user = {
    id: 1,
    name: "john",
  };

  req.session.ebuka = 123;

  res.send("session created");
});

server.get("/get-session", (req, res) => {
  const user = req.session.user;
  const ebuka = req.session.ebuka;
  res.send({
    user,
    ebuka,
  });
});
// hash
server.get("/hash-password", async (req, res) => {
  const password = "1234";
  const hash = await bcrypt.hash(password);
  res.send(hash);
});

server.get("verify-password", async (req, res) => {
  const hashed = req.query.hash;
  const result = await bcrypt.compare("1234", hashed);
  res.send(result);
});
const { ForDash } = require("./middlewares/logger");

server.get("/dashboard", (req, res) => {
  const user = req.session.user
  res.render("dashboard", {user});
});

server.get("/test", (req, res) => {
  res.render("test");
});

const usersignup = require("./schemas/userSchemas");
const validateRequest = require("./middlewares/validate");

server.post("/test-post", validateRequest(usersignup), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existings = await pool.query(
      `SELECT * FROM testusers WHERE email = $1`,
      [email],
    );
    if (existings.rows.length > 0) {
      return res.status(400).json({
        error: "account already exists",
      });
    }
    await pool.query(
      `INSERT INTO testusers (firstname, lastname, email, password) VALUES ($1,$2,$3,$4)`,
      [firstName, lastName, email, password],
    );
    return res.status(200).send("welcome");
    return res.send("dooddddddd");
  } catch (error) {
    console.log(error.message);
  }
});

server.get("/Req-params/:id/:name", (req, res) => {
  const { id, name } = req.params;
  return res.json({
    id,
    name,
  });
});

server.get("/query-test", (req, res) => {
  const data = req.query;
  return res.json({
    data,
  });
});

server.listen(process.env.PORT, () => {
  console.log(`my google secret ${process.env.GOOGLE_SECRET}`);
});
