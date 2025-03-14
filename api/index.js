require("dotenv").config();

const express = require("express");
const cors = require("cors")
const app = express();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const requestHandler = require('./utils/requestHandler');
const paymentReoute = require("./routes/paymentRoutes")


const port = process.env.SERVER_PORT || 3000
const SchedulerService = require('./services/SchedulerService');
app.use(cors())
app.use(express.json());

app.use(express.static('public'));


// here we add router

app.use("/api", requestHandler(null, authRoutes));
app.use("/api/payment", requestHandler(null, paymentReoute));


app.get("/", function (req, res) {
    res.send("welcome pos solution family!");
});

// app.use(ErrorHandler)

app.use(errorHandler);

// Start the schedulers
SchedulerService.checkExpiredSubscriptions.start();
SchedulerService.sendRenewalReminders.start();

app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;