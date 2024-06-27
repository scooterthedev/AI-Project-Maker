const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const auth0Domain = 'https://dev-wbblu8s05n80xeug.us.auth0.com';
const clientId = process.env.AUTH0_CLIENT_ID; // Stored in .env file
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

app.post('/api/authenticate', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const response = await fetch(`${auth0Domain}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                grant_type: password,
                username: email,
                password: password,
                client_id: clientId,
                client_secret: clientSecret,
                audience: `${auth0Domain}/api/v2/`
            })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Invalid email or password.' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
