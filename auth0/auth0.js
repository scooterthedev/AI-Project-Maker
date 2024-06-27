// Initialize Auth0 client
const auth0 = new Auth0Client({
    domain: 'dev-wbblu8s05n80xeug.us.auth0.com',
    client_id: 'NnsGLhYmjGus273M995L7JdI4qoT0OQr',
    redirect_uri: window.location.origin
});
async function authenticateWithEmailPassword(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Invalid email or password.');
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // Use the accessToken as needed, e.g., for API requests
        console.log('Access Token:', accessToken);

        // Optionally, redirect to another page on successful login
        window.location.href = '/dashboard';
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