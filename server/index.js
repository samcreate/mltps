// load .env using dotenv first
import {} from "./env";

// include other main deps
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import pkg from "../package.json";
import APP_ROOT from "app-root-path";
import Multipassify from "multipassify";

// instantiate express
const app = express();
const PRODUCTION = process.env.NODE_ENV === "production";

const mulitpass_sec = process.env.MLTPSSECTOK;

const multipassify = new Multipassify(mulitpass_sec);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

// static serving from /dist/client
app.use(express.static(APP_ROOT + "/dist/client"));

// example API entry
app.get("/test", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("ip", req.headers);
  var customerData = {
    email: "samuel.aaron.mcguire@gmail.com",
    remote_ip: ip,
    return_to: "https://biossance-test.myshopify.com?fart=22"
  };
  console.log(customerData);
  var token = multipassify.encode(customerData);
  var url = multipassify.generateUrl(
    customerData,
    "biossance-test.myshopify.com"
  );
  return res.redirect(url);
});

// json import support
app.get("/package.json", (req, res) => res.json(pkg));

const serverPort = process.env.PORT || 3000;
app.listen(serverPort);
console.log(
  `Express server @ http://localhost:${serverPort} (${
    PRODUCTION ? "production" : "development"
  })\n`
);
