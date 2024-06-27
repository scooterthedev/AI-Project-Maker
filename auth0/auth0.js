// auth0.js

let auth0Client = null;

async function initAuth0() {
    try {
        const response = await fetch('/auth0/auth_config.json');
        const config = await response.json();

        auth0Client = await createAuth0Client({
            domain: config.domain,
            client_id: config.clientId,
            redirect_uri: window.location.origin
        });
    } catch (err) {
        console.error('Failed to initialize Auth0:', err);
        throw err;
    }
}

async function loginWithRedirect() {
    try {
        await auth0Client.loginWithRedirect();
    } catch (err) {
        console.error('Login failed:', err);
        throw err;
    }
}

async function handleRedirectCallback() {
    try {
        await auth0Client.handleRedirectCallback();
        const isAuthenticated = await auth0Client.isAuthenticated();
        if (isAuthenticated) {
            window.location.assign('/');
        }
    } catch (err) {
        console.error('Failed to handle redirect callback:', err);
        throw err;
    }
}

async function logout() {
    try {
        await auth0Client.logout({
            returnTo: window.location.origin
        });
    } catch (err) {
        console.error('Logout failed:', err);
        throw err;
    }
}

async function getUser() {
    try {
        return await auth0Client.getUser();
    } catch (err) {
        console.error('Failed to get user:', err);
        throw err;
    }
}

// Initialize Auth0 client on load
window.addEventListener('load', async () => {
    await initAuth0();
});
