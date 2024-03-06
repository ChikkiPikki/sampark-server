var express = require("express");
var Server = require("socket.io").Server;
var bodyParser = require("body-parser");
var http = require("http");
var cors = require("cors");
var mongoose = require("mongoose");

var Gas = mongoose.Schema({
  value: Number,
  time: Date,
});

Gas = mongoose.model("Gas", Gas);

var Ultrasonic = mongoose.Schema({
  value: Number,
  time: Date,
});

Ultrasonic = mongoose.model("Ultrasonic", Ultrasonic);

var Temperature = mongoose.Schema({
  value: Number,
  time: Date,
});

Temperature = mongoose.model("Temperature", Temperature);

mongoose.connect(process.env.DB);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.set("view engine", "ejs");
app.use("/static", express.static("public"));

const router = express.Router();

router.get("/api/readings/temperature", async (req, res) => {
  var temperature = Number(req.query.value);

  try {
    var reading = await Temperature.create({
      value: temperature,
      time: new Date(),
    });
    console.log(reading);
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    console.log("Couldn't log temperature sensor reading");
    res.end();
  }
});

router.get("/api/readings/gas", async (req, res) => {
  var gas = Number(req.query.value);

  try {
    var reading = await Gas.create({
      value: gas,
      time: new Date(),
    });
    console.log(reading);
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    console.log("Couldn't log gas sensor reading");
    res.end();
  }
});

router.get("/api/readings/ultrasonic", async (req, res) => {
  var distance = req.query.value;
  try {
    var reading = await Ultrasonic.create({
      value: distance,
      time: new Date(),
    });
    console.log(reading);
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    console.log("Couldn't log ultrasonic sensor reading");
    res.end();
  }
});

app.use(router);

const server = http.createServer(app);

const IO = new Server(server, { cors: { origin: "*" } });

IO.on("connection", (socket) => {
  socket.on("get-temperature", async (data) => {
    var readings = await Temperature.find({}).sort({ time: -1 }).limit(data);
    socket.emit("temperature", readings.reverse());
  });
  socket.on("get-gas", async (data) => {
    var readings = await Gas.find({}).sort({ time: -1 }).limit(data);
    socket.emit("gas", readings.reverse());
  });
  socket.on("get-distance", async (data) => {
    var readings = await Ultrasonic.find({}).sort({ time: -1 }).limit(data);
    socket.emit("distance", readings.reverse());
  });
  socket.on("status", async (data) => {
    var readings = await Temperature.find({}).sort({ time: -1 }).limit(data);
    readings = readings + (await Gas.find({}).sort({ time: -1 }).limit(data));
    readings =
      readings + (await Ultrasonic.find({}).sort({ time: -1 }).limit(data));

    socket.emit("out", readings);
  });
});

app.get("/", (req, res) => {
  res.render("home.ejs", {
    data: {
      lables: ["temperature"],
      datasets: [
        {
          label: "Temperature",
          borderColor: "black",
          backgroundColor: "blue",
        },
      ],
    },
  });
});

app.get("/status", (req, res) => {});

server.listen(process.env.port || 8080, () => {
  console.log("listening");
});
