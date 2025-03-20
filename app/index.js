const express = require("express");
const middleware = require("./middleware");
const route = require("./route");
const routes = require("../routes");
const { notFoundHandler, errorHandler } = require("./error");
const app = express();

// * middlewares
app.use(middleware);

// * routes
app.use(route);
app.use(routes);

// * error handler
app.use[(notFoundHandler, errorHandler)];

module.exports = app;
