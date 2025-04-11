require("dotenv").config();

const express = require("express");
const cors = require("cors")
const app = express();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const requestHandler = require('./utils/requestHandler');
const paymentRoute = require("./routes/paymentRoutes")
const imageUploadRoute = require("./routes/imageUploadRoute")
const userRoute = require("./routes/userRoutes")
const notificationRoutes = require('./routes/notificationRoutes');

const port = process.env.SERVER_PORT || 3000
const SchedulerService = require('./services/SchedulerService');
app.use(cors())
app.use(express.json());

app.use(express.static('public'));


// here we add router

app.use("/api", requestHandler(null, authRoutes));
app.use("/api/images", requestHandler(null, imageUploadRoute));
app.use("/api/payment", requestHandler(null, paymentRoute));
app.use("/api/role", requestHandler(null, userRoute));
app.use('/api/notifications', notificationRoutes);



app.get("/", function (req, res) {
    res.send("welcome www.lendenpay.com family!");
});

// app.use(ErrorHandler)

app.use(errorHandler);

// Start the schedulers
SchedulerService.checkExpiredSubscriptions.start();
SchedulerService.sendRenewalReminders.start();

app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;