var express = require("express");
import { Temperature } from "./models/Temperature.js";
import { Gas } from "./models/Gas.js";
import { Ultrasonic } from "./models/Ultrasonic.js";

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

export { router as ReadingRouter };
