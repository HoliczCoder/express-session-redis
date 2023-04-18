var express = require("express");
var Redis = require("ioredis");
var session = require("express-session");
var RedisStore = require("connect-redis").default;
var clientRedis = new Redis()
var app = express();
var cookieParser = require("cookie-parser");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(
  session({
    secret: "HoliczCoder",
    saveUninitialized: false,
    resave: false,
    store: new RedisStore({
      client: clientRedis,
      prefix: "myapp",
      host: "localhost",
      port: 6379,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  if (req.session.key) {
    // res.redirect("/admin");
    res.json({
      data: req.session,
    });
    return;
  } else {
    res.end("ban chua dang nhap vao");
  }
});

app.post("/login", (req, res) => {
  req.session.key = req.body.email;
  res.end("done");
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("App Started on PORT 3000");
});
