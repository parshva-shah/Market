const express = require("express");
const app = express();
const port = 3001;
const client_model = require("./client_model");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 100000,
  })
);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/getClientData", (req, res) => {
  client_model
    .getClientData(req.query.clientCode)
    .then((response) => {
      if (!req.query.clientCode) {
        res
          .status(200)
          .send({ result: "Please enter Client Code", status: "failed" });
      } else {
        res.status(200).send({ result: response?.rows, status: "success" });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/fileUpload", (req, res) => {
  console.log("asa", req.body);
  client_model.fileUpload(req).then((res) => {
    console.log(res);
  });
});

app.post("/saveCsvPerDay", (req, res) => {
  client_model
    .saveCsvPerDay(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.delete("/merchants/:id", (req, res) => {
  client_model
    .deleteMerchant(req.params.id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
