const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


(async () => {
    const fetch = (await import('node-fetch')).default;

    const app = express();
    const port = 3000;
    
     // Enable CORS for all routes
     app.use(cors());

    app.use(bodyParser.json());

    app.post('/api/check-user', async (req, res) => {
        const { email } = req.body;

        // Replace with your Auth0 Management API endpoint and token
        const url = 'https://dev-wbblu8s05n80xeug.us.auth0.com/api/v2/users-by-email';
        const token = '667bfed7052fac135fea03c8';

        try {
            const response = await fetch(`${url}?email=${encodeURIComponent(email)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('User not found.');
            }

            const data = await response.json();
            const userExists = data.length > 0;

            res.json({ userExists });
        } catch (error) {
            console.error('Check user failed:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/api/authenticate', async (req, res) => {
        const { email, password } = req.body;

        const url = 'https://dev-wbblu8s05n80xeug.us.auth0.com/oauth/token';
        const clientId = 'NnsGLhYmjGus273M995L7JdI4qoT0OQr';
        const clientSecret = 'n9MQ1aF8Y5N275z2VOIOWWgBrNH6xW3a9XgXknAyj8CSfolClFiZg5oEpIdhBJ1W';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'password',
                    username: email,
                    password,
                    client_id: clientId,
                    client_secret: clientSecret,
                    audience
                })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password.');
            }

            const data = await response.json();
            res.json({ access_token: data.access_token });
        } catch (error) {
            console.error('Authentication failed:', error);
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})();
