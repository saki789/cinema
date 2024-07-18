const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Sample movie data
const movies = [
    { id: 1, title: 'Inception', description: 'A mind-bending thriller.' },
    { id: 2, title: 'Interstellar', description: 'A journey through space and time.' },
    // Add more movies as needed
];

// Get movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
