const path = require('path');

const express = require('express');

const dotenv = require('dotenv');

const fileupload = require('express-fileupload');

//const logger = require('./middleware/logger');
const colors = require('colors');

const morgan = require('morgan');

const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

//Body Parser
app.use(express.json());

//Mount logger middleware
//app.use(logger);

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`App Server running in ${process.env.NODE_ENV} listening on port ${PORT}!`.yellow.bold);
});

//Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	//Close server and exit process
	server.close(() => process.exit(1));
});
