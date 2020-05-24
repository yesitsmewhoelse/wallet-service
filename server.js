var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var service = require("./routes/buy_service");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var router = express.Router();

router.post("/buy", service.buy);
router.get("/health", function(req, res) {
    res.send({service: "Healthy"});
});

app.use("/api", router);
app.listen(8080, ip);

module.exports = app;
