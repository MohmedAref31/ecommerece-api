const path = require('path');

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require('cors')
const compression = require("compression");

dotenv.config();


const dbConnection = require("./config/dbConnection");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.options('*', cors())
app.use(compression())

const routes = require("./routes");



const { errorHandler } = require("./middlewares/errorHandler");
const { checkoutComplete } = require('./controllers/order.controller');

// db connection
dbConnection();

app.post('/webhook-checkout', express.raw({type:"application/json"}), checkoutComplete)

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"uploads")));
app.use(morgan("dev"));

// mount routes
app.use("/api", routes);


// error handler

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

// handel rejections errors out of express

process.on("unhandledRejection", (err) => {
  server.close(() => {
    console.log(`unhandled rejection ${err }\n ${err.stack}`);
    console.log("shutting down...");
    process.exit(1);
  });
});
