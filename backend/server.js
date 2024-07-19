const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Sample movie data
const movies = [
    { id: 1, date: '05/23/2024', title: 'Ant Man', description: 'A mind-bending thriller.', image: 'https://cdn.marvel.com/content/1x/antmanandthewaspquantumania_lob_crd_03.jpg' },
    { id: 2, date: '07/06/2023', title: 'Thor', description: 'A journey through space and time.', image: 'https://cdn.marvel.com/content/1x/thorloveandthunder_lob_crd_04.jpg' },
    { id: 3, date: '07/06/2023', title: 'Doctor Strange', description: 'A journey through space and time.', image: 'https://cdn.marvel.com/content/1x/doctorstrangeinthemultiverseofmadness_lob_crd_02_3.jpg' },
    { id: 4, date: '07/06/2023', title: 'Captain Marvel', description: 'A journey through space and time.', image: 'https://cdn.marvel.com/content/1x/captainmarvel_lob_crd_06.jpg' },
    { id: 5, date: '07/06/2023', title: 'Doctor Strange', description: 'A journey through space and time.', image: 'https://cdn.marvel.com/content/1x/doctorstrange_lob_crd_01_6.jpg' },
    { id: 6, date: '07/06/2023', title: 'Guardian of The Galaxy', description: 'A journey through space and time.', image: 'https://cdn.marvel.com/content/1x/guardiansofthegalaxy_lob_crd_03.jpg' },
    // Add more movies as needed
];

// Get movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
