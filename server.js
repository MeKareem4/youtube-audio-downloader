const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/convert', (req, res) => {
    const url = req.body.url;
    if (!ytdl.validateURL(url)) {
        return res.status(400).send('Invalid YouTube URL');
    }

    const stream = ytdl(url, { filter: format => format.container === 'mp4' });

    res.setHeader('Content-Disposition', 'attachment; filename=converted.mp3');

    ffmpeg(stream)
        .toFormat('mp3')
        .on('end', () => {
            console.log('Conversion finished');
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Conversion failed');
        })
        .pipe(res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});