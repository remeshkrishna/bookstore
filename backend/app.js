const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error', err));

// Create table
client.query(`CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL
);`);

// Add a book
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  client.query('INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *', [title, author], (err, result) => {
    if (err) {
      return res.status(500).send(err.stack);
    }
    res.status(201).json(result.rows[0]);
  });
});

// Get all books
app.get('/books', (req, res) => {
  client.query('SELECT * FROM books', (err, result) => {
    if (err) {
      return res.status(500).send(err.stack);
    }
    res.json(result.rows);
  });
});

app.delete('/books/:title', async (req, res) => {
    const bookId = req.params.title;
    try {
        const result = await client.query('DELETE FROM books WHERE title = $1', [bookId]);
        if (result.rowCount > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
