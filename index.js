const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Route to handle LinkTool requests
app.get('/fetch-url', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the URL content
        const { data } = await axios.get(url);

        // Use Cheerio to extract metadata
        const $ = cheerio.load(data);
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');

        res.json({
            success: 1,
            meta: {
                title: title || '',
                description: description || '',
                image: {
                    url: image || ''
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: 0, error: 'Failed to fetch the URL' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
