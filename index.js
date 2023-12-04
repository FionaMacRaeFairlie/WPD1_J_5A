const express = require("express");
const app = express();
const path = require("path");
const public = path.join(__dirname, "public");
const nedb = require("gray-nedb");
const db = new nedb({ filename: "messages.db", autoload: true });
const mustache = require("mustache-express");

let counter = 0;

app.use(express.static(public));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // redirect CSS bootstrap
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist")); // redirect JS jQuery

app.use(express.urlencoded({ extended: false }));

app.engine("mustache", mustache());
app.set("view engine", "mustache");

app.get("/", function (req, res) {
  res.sendFile(path.join(public, "index.html"));
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(public, "about.html"));
});
app.get("/info", function (req, res) {
  res.sendFile(path.join(public, "information.html"));
});
// app.get("/contact", function (req, res) {
//   res.sendFile(path.join(public, "contact.html"));
// });

app.get("/contact", function (req, res) {
  res.render("contact", { counter: counter });
});

app.get("/messages", function (req, res) {
  db.find({}, function (err, doc) {
    if (err) {
      console.log("Error retrieving documents", err);
    } else
      res.render("entries", {
        entries: doc,
        counter: counter,
      });
  });
});


app.get("/deleteTest", function (req, res) {
  db.remove({"name":"test"}, function (err, doc) {
    if (err) {
      console.log("Error deleting test data ", err);
    } else
      console.log("data from user called test deleted ", err);
      res.send("Test data deleted")
  });
});


app.post("/contact", function (req, res) {
  db.insert(
    {
      name: req.body.author,
      subject: req.body.subject,
      message: req.body.contents,
    },
    function (err, newDoc) {
      if (err) {
        console.log("error", err);
      } else {
        console.log("document inserted", newDoc);
        counter++;
      }
    }
  );
  // res.send("Thank you for your message.");
  res.render("response", {
    user: req.body.author,
    counter: counter,
  });
});

app.use(function (req, res) {
  res.status(404);
  res.send("Oops! We didn't find what you are looking for.");
});

app.listen(3000, () => {
  console.log("Server started on port 3000. Ctrl^c to quit.");
});
