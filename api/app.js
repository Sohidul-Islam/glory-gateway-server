const notificationRoutes = require('./routes/notificationRoutes');
const scheduler = require('./utils/scheduler');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ... other middleware ...

// Add notification routes
app.use('/api/notifications', notificationRoutes);

// Add dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Start the scheduler
scheduler; 