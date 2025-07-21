const express = require('express');
const apicache = require('apicache');
const path = require('path');

const app = express();
const cache = apicache.middleware;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Cache homepage + result for 30 seconds
app.use(cache('30 seconds'));

// GET home page with form
app.get('/', (req, res) => {
  const html = `
    <html>
    <head>
      <title>Team Portal</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container py-5">
      <h1 class="mb-4">Welcome to the Team Portal</h1>
      <form method="POST" action="/submit">
        <div class="mb-3">
          <label for="name" class="form-label">Your Name:</label>
          <input type="text" class="form-control" name="name" id="name" required>
        </div>
        <button type="submit" class="btn btn-primary">Enter</button>
      </form>
    </body>
    </html>
  `;
  res.send(html);
});

// POST submission
app.post('/submit', (req, res) => {
  const name = req.body.name || 'Guest';
  const forwardedHost = req.get('X-Forwarded-Host') || 'ourteam.com';

  const html = `
    <html>
    <head>
      <title>Welcome ${name}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container py-5">
      <h2>Hello, ${name}!</h2>
      <p>This portal is brought to you by <strong>${forwardedHost}</strong>.</p>
      <a href="/" class="btn btn-secondary mt-3">Go Back</a>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(3000, () => {
  console.log('App running at http://localhost:3000');
});
