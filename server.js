const express = require("express");
const fs = require("fs");
const app = express();
const config = require("./config.json");
const port = 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  fs.readFile("db.json", function(err, data) {
    var json = JSON.parse(data);
    var id = req.query.id;
    function db(x) {
      return x.id == id;
    }
    var last = json.find(db);
    last = last ? { id: last.id, url: last.url } : { id: "", url: "" };
    res.render(__dirname + "/pages/index", {
      siteName: config.siteName,
      siteURL: config.siteURL,
      logoURL: config.logoURL,
      id: last.id
    });
  });
});
app.get("/go", function(req, res) {
  fs.readFile("db.json", function(err, data) {
    var json = JSON.parse(data);

    var id = req.query.id;
    function db(x) {
      return x.id == id;
    }
    var last = json.find(db);
    if (last) {
      res.render(__dirname + "/pages/go", {
        siteName: config.siteName,
        siteURL: config.siteURL,
        logoURL: config.logoURL,
        id: last.id,
        url: last.url
      });
    } else {
      res.render(__dirname + "/pages/error", {
        siteName: config.siteName,
        siteURL: config.siteURL,
        logoURL: config.logoURL
      });
    }
  });
});
app.get("/new", function(req, res) {
  var id = req.query.id;
  var url = req.query.url;

  fs.readFile("db.json", function(err, data) {
    var json = JSON.parse(data);
    json.push({ id: id, url: url });

    fs.writeFile("db.json", JSON.stringify(json), err => console.log(`ID: ${id} ~ URL: ${url}`));
    res.redirect("/?id=" + id);
  });
});
app.get("/stats", function(req, res) {
  fs.readFile("db.json", function(err, data) {
    var json = JSON.parse(data);

    res.render(__dirname + "/pages/stats", {
      siteName: config.siteName,
      siteURL: config.siteURL,
      logoURL: config.logoURL,
      urlCount: json.length
    });
  });
});

app.listen(port, () => console.log("Server is online :) Port:" + port));
