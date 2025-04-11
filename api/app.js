const notificationRoutes = require('./routes/notificationRoutes');
const scheduler = require('./utils/scheduler');

// ... other middleware ...

// Add notification routes
app.use('/api/notifications', notificationRoutes);

// Start the scheduler
scheduler; 