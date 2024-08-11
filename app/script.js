document.addEventListener('DOMContentLoaded', async () => {
    const supabaseUrl = 'https://lllitinjwarzhqnfxkur.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGl0aW5qd2FyemhxbmZ4a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3Nzk0MjUsImV4cCI6MjAzNTM1NTQyNX0.jXiEA7f-cpOBD_1N-UaVrtCDGE7ovglAzHvT_L1LAug';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const tokenKey = 'sb-lllitinjwarzhqnfxkur-auth-token';
    const localStorageData = localStorage.getItem(tokenKey);

    if (localStorageData) {
        try {
            const { access_token, refresh_token } = JSON.parse(localStorageData);

            if (access_token && refresh_token) {
                setCookie('sb-access-token', access_token, 14); 
                setCookie('sb-refresh-token', refresh_token, 14);

                const { data: userData, error } = await supabase.auth.getUser(access_token);

                if (error) {
                    throw new Error('Failed to fetch session details: ' + error.message);
                }

                const cookieAccessToken = getCookie('sb-access-token');
                if (cookieAccessToken === access_token) {
                    document.getElementById('welcome-message').textContent = `Hi, ${userData.user.email}`;
                } else {
                    throw new Error('No user data found');
                }
            } else {
                throw new Error('No access token found');
            }

        } catch (error) {
            console.error('Error validating token:', error);
            document.getElementById('error-message').textContent = 'Your session is no longer valid. Redirecting to home page.';
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }
    } else {
        document.getElementById('error-message').textContent = 'No session found. Redirecting to home page.';
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }
});

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.getElementById('toggle-button').addEventListener('click', () => {
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.toggle('collapsed');
});