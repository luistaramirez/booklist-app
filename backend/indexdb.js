const express = require('express');
const mysql   = require('mysql');
const redis   = require('redis');
const cors    = require('cors')

const app  = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

// Redis setup
let redisClient;
(async () => {
    redisClient = redis.createClient({
        host: 'localhost',
        port: 6379,
    });
    await redisClient.connect();
})();


// MySQL setup
const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'booklist',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL databases');
});


// API routes
app.get('/', async (req, res) => {
    // Check Redis cache first
    try {
        const cachedData = await redisClient.get('books');
        if (cachedData) {
            return res.send({
                success: true,
                message: 'Books retrieved from cache successfully.',
                data   : JSON.parse(cachedData),
            });
        }

        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM books', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        redisClient.setEx('books', 3600, JSON.stringify(results));

        return res.send({
            success: true,
            message: 'Books retrieved from database successfully.',
            data   : results,
        });

    } catch (error) {
        throw error;
    }
});

app.get('/books', async (req, res) => {
    // Check Redis cache first
    try {
        const cachedData = await redisClient.get('books');
        if (cachedData) {
            return res.send({
                success: true,
                message: 'Books retrieved from cache successfully.',
                data   : JSON.parse(cachedData),
            });
        }

        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM books', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        redisClient.setEx('books', 3600, JSON.stringify(results));

        return res.send({
            success: true,
            message: 'Books retrieved from database successfully.',
            data   : results,
        });

    } catch (error) {
        throw error;
    }
});

app.post('/books', (req, res) => {
    const {title} = req.body;

    db.query('INSERT INTO books (title) VALUES (?)', [title], (err) => {
        if (err) throw err;

        // Clear Redis cache for books
        redisClient.del('books');
        return res.send('Book added successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);

    // redis connect
    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });
    redisClient.on('connect', () => {
        console.log('Redis connected');
    });
});