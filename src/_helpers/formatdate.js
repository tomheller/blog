'use strict';
const moment = require('moment');

module.exports = (date, format) => {
  let desiredformat = 'YYYY MM DD';
  if (typeof format === 'string') {
    desiredformat = format;
  }
  let momentDate = moment(date);
  return momentDate.format(desiredformat);
};
