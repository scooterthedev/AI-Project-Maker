// Initialize Auth0 client
const auth0 = new Auth0Client({
    domain: 'dev-wbblu8s05n80xeug.us.auth0.com',
    client_id: 'NnsGLhYmjGus273M995L7JdI4qoT0OQr',
    redirect_uri: window.location.origin
});
async function authenticateWithEmailPassword(email, password) {
    try {
        const response = await fetch('https://dev-wbblu8s05n80xeug.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'password',
                username: email,
                password: password,
                client_id: 'NnsGLhYmjGus273M995L7JdI4qoT0OQr',
                client_secret: 'n9MQ1aF8Y5N275z2VOIOWWgBrNH6xW3a9XgXknAyj8CSfolClFiZg5oEpIdhBJ1W',
                audience: 'https://dev-wbblu8s05n80xeug.us.auth0.com/api/v2/'
            })
        });

        if (!response.ok) {
            throw new Error('Invalid email or password.');
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // Use the accessToken as needed, e.g., for API requests
        console.log('Access Token:', accessToken);

        // Optionally, redirect to another page on successful login
        window.location.href = '/dashboard'; // Replace with your desired redirect URL
    } catch (error) {
        console.error('Login failed:', error);
        document.getElementById('error-message').textContent = 'Invalid email or password.';
    }
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await authenticateWithEmailPassword(email, password);
});