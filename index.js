const express = require("express");
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer();
const methodOverride = require("method-override");
const AWS = require("aws-sdk");

// override with POST having ?_method=PUT
app.use(methodOverride("_method"));

const { DocumentClient } = require("aws-sdk/clients/dynamodb");
const config = new AWS.Config({
  accessKeyId: "AKIAVHWOLXXLENQMVQSK",
  secretAccessKey: "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",
  region: "ap-southeast-1",
});
AWS.config = config;
const doc = new AWS.DynamoDB.DocumentClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting view engine to ejs
// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");
app.set("view engine", "ejs");
app.set("views", "./views");

//[GET] show hello (test)
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

//[GET] show table data
app.get("/", (req, res) => {
  // res.send('Hello World!')
  const params = {
    TableName: "tb_user",
  };
  doc.scan(params, (err, data) => {
    res.render("index", { title: "Home Page", data: data.Items });
  });
});

//[POST] create a new student
app.post("/", upload.none(), (req, res) => {
  const { first_name, last_name, email } = req.body;
  const params = {
    TableName: "tb_user",
    Item: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      // // Creating new unique id
      id: uuidv4(),
    },
  };
  // // Creating new unique id
  // const userId = uuidv4();

  doc.put(params, (err, data) => {
    if (err) {
      return res.send(err.message);
    }
    return res.redirect("/");
  });
});

// // Routes
// app.get("/", (req, res) => {
//   res.render("index", { title: "Home Page", data: data });
// });

//[GET] /student/add
//show form add
app.get("/student/add", (req, res) => {
  res.render("form_add", { title: "Add Page", layout: "./layouts/sidebar" });
});

//update

//[GET] /students/:id/edit
//show form update
app.get("/students/:id/edit", (req, res) => {
  //Get an item from a table using the DynamoDB document client.
  var params = {
    TableName: "tb_user",
    Key: { id: req.params["id"] },
  };
  doc.get(params, function (err, data) {
    if (err) {
      //console.log("Error", err);
      res.send(err);
    } else {
      // console.log("Success", data.Item);
      res.render("form_update", {
        title: "Update Page",
        data: data.Item,
        layout: "./layouts/sidebar",
      });
    }
  });
});

//[PUT] /students/:id
// update a student
app.put("/students/:id", (req, res) => {
  const { first_name, last_name, email, id } = req.body;
  //Put an item in a table using the DynamoDB document client.
  var params = {
    TableName: "tb_user",
    Item: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      id: id,
    },
  };

  doc.put(params, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/");
    }
  });
});

//[DELETE] /students/:id
// delete a student
app.delete("/students/:id", (req, res) => {
  //Delete an item in a table using the DynamoDB document client.
  var params = {
    Key: { id: req.params["id"] },
    TableName: "tb_user",
  };

  doc.delete(params, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
