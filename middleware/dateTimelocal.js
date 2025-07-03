const moment = require('moment');

// Middleware to convert all dates to local time in the response
const convertDatesToLocalTime = (req, res, next) => {
  const formatDates = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(formatDates);
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Date) {
          obj[key] = moment(obj[key]).format('YYYY-MM-DD HH:mm:ss'); // Change format as needed
        } else if (typeof obj[key] === 'object') {
          formatDates(obj[key]);
        }
      });
    }
    return obj;
  };

  const originalJson = res.json;
  res.json = function (data) {
    formatDates(data); // Apply date conversion before sending the response
    originalJson.call(this, data);
  };

  next();
};

module.exports = convertDatesToLocalTime;
