require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger'); 

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`GameHub API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect DB', err);
  process.exit(1);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));