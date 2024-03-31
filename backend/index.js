const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// JSON data for books
const books = [
    { id: 1, title: "Book 1", author: "Author 1" },
    { id: 2, title: "Book 2", author: "Author 2" },
    { id: 3, title: "Book 3", author: "Author 3" }
];


// API routes
// Root route to show all books
app.get('/', async (req, res) => {
    try {
        // Check Redis cache first
            return res.send({
                success: true,
                message: 'Books retrieved from cache successfully.',
                data: books,
            });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// API routes
app.get('/books', async (req, res) => {
    try {
        return res.send({
            success: true,
            message: 'Books retrieved successfully.',
            data: books,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/books', (req, res) => {
    const { title, author } = req.body;

    // Generate new book ID
    const id = books.length > 0 ? books[books.length - 1].id + 1 : 1;

    // Create new book object
    const newBook = { id, title, author };

    // Add new book to the array
    books.push(newBook);

    return res.send('Book added successfully.');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});