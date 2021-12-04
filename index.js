const { handlerToExpressRoute } = require("twilio-run");
const { basename, resolve } = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const Twilio = require('twilio');

const INDEX = resolve(__dirname, "./functions/index.js");
const TEST_DIR = resolve(__dirname, ".");
const TEST_ENV = process.env;
const DEFAULT_BODY_SIZE_LAMBDA = "6mb";

let config = {
  url: "https://TwilioServerlessMock.adamchasetaylor.repl.co",
  baseDir: TEST_DIR,
  env: TEST_ENV,
  logs: false,
};

const app = express();

app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.json({ limit: DEFAULT_BODY_SIZE_LAMBDA }));

app.get("/favicon.ico", (req, res) => {
  res.redirect(
    "https://www.twilio.com/marketing/bundles/marketing/img/favicons/favicon.ico"
  );
});

app.all("/:name", (req, res, next) => {
  try {
    const twilioFunction =
      require(`./functions/${req.params.name}/index.js`).handler;
    handlerToExpressRoute(twilioFunction, config)(req, res);
  } catch (error) {
    console.error(error);
    res.send("Handler Not Found!");
  }
});

app.listen(80, () => console.log("Server running on port 80"));
