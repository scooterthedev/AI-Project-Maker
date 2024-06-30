async function checkUserExists(email) {
    try {
        const response = await fetch('http://localhost:3000/api/check-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('User not found.');
        }

        const data = await response.json();
        return data.userExists;
    } catch (error) {
        console.error('Check user failed:', error);
        return false;
    }
}

async function authenticateWithEmailPassword(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
        window.location.href = '/'; // Replace with your desired redirect URL
    } catch (error) {
        console.error('Login failed:', error);
        document.getElementById('error-message').textContent = 'Invalid email or password.';
    }
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userExists = await checkUserExists(email);

    if (userExists) {
        await authenticateWithEmailPassword(email, password);
    } else {
        document.getElementById('error-message').textContent = 'User not found.';
    }
});
