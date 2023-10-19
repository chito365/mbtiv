const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path'); // Required to serve static files

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from a 'public' directory

const pool = mysql.createPool({
  host: 'premium149.web-hosting.com',
  user: 'betahfsz_mb',
  password: 'AFANDESIR',
  database: 'betahfsz_mb',
  connectionLimit: 10,
});

app.get('/voting-results/:post_id', async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const [results] = await pool.query(
      `SELECT vote, COUNT(*) as count FROM wp_married_db_votes_marital WHERE post_id = ? GROUP BY vote ORDER BY count DESC`,
      [post_id]
    );

    if (results.length === 0) {
      res.send('No results found.');
    } else {
      const total_votes = results.reduce((total, result) => total + result.count, 0);

      let htmlResponse = `<link rel="stylesheet" type="text/css" href="/styles.css">`; // Include the CSS file
      htmlResponse += `<div class='breakdown-header'>Breakdown of ${total_votes} votes</div>`;

      results.forEach((result, key) => {
        const mbti = result.vote;
        const count = result.count;
        const percentage = Math.round((count / total_votes) * 100);
        const bg_color = key === 0 ? '#C7F1CF' : '#ECFAEF';

        if (count > 0) {
          htmlResponse += "<div class='mbti-item'>";
          htmlResponse += "<div class='progress-container'>";
          htmlResponse += "<div class='progress-bar'>";
          htmlResponse += `<div class='progress-fill' style='width: ${percentage}%; background-color: ${bg_color};'></div>`;
          htmlResponse += `<div class 'progress-text'>${percentage}%</div>`;
          htmlResponse += `<div class='votes'>${count} ${mbti}</div>`;
          htmlResponse += "</div>";
          htmlResponse += "</div>";
          htmlResponse += "</div>";
        }
      });

      res.send(htmlResponse);
    }
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).send('Error querying the database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
