const createError = require('http-errors');
//const swaggerJsDoc = require('swagger-jsdoc');
//const swaggerUI = require('swagger-ui-express');

const v1Route = require('./version1');

module.exports = function (app) {
  // Health Check
  // app.get('/health-check', function (req, res) {
    // res.sendStatus(200);
  // })

  app.use('/api/v1',v1Route);
  /*
  app.use(function (req, res, next) {
    next(createError(404, 'No Route Found - ' + req.path));
  });*/
  
};

