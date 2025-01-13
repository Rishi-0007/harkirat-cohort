import express from 'express';

const app = express();

let counter = 0;

// Middleware to increase the counter
function reqIncrease(req, res, next) {
  counter++;
  next();
}

// Middleware to log request information
function reqInformation(req, res, next) {
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  next();
}

// Route Handlers
function sumHandler(req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Invalid parameters. Please provide valid numbers for "a" and "b".');
  }

  res.send(`Sum: ${a + b}`);
}

function multiplyHandler(req, res) {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send('Invalid parameters. Please provide valid numbers for "a" and "b".');
  }

  res.send(`Multiply: ${a * b}`);
}

function counterHandler(req, res) {
  res.send(`Counter: ${counter}`);
}

// Apply global middleware
app.use(reqIncrease);
app.use(reqInformation);

// Routes
app.get('/admin', counterHandler);
app.get('/sum', sumHandler);
app.get('/multiply', multiplyHandler);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
