var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fs = require("fs");
const formidable = require("formidable");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post("/post", function (req, res, next) {
  //console.log(req.body.user.email);
  //var json = JSON.stringify(req.body);
  //fs.writeFile('urls.json', json, 'utf8');

  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      res.send("!ok");
      return;
    }
    console.log(JSON.parse(fields.okurls)[0]);
    let jsoUrls = JSON.parse(fields.okurls).join("\n");
    let urlData = `Aluno: ${fields.nid}\n\n${jsoUrls}\n\n`;
    fs.appendFile("./urls.json", urlData, (err) => {
      if (err) {
        //throw err;
        res.send("!ok");
      } else res.send("ok");
    });
  });
  setTimeout(() => {
    res.send("!ok");
  }, 30000);
  //res.send("ok");
});

/*app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());*/
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
