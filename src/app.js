const express = require("express");
const app = express();
const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./counts/counts.router");

app.use(express.json());

app.use("/counts", countsRouter)

app.use("/flips", flipsRouter);

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler 
app.use((err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).json({ error: message })
});

module.exports = app;
