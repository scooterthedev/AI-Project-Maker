document.addEventListener('DOMContentLoaded', async () => {
    const supabaseUrl = 'https://lllitinjwarzhqnfxkur.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGl0aW5qd2FyemhxbmZ4a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3Nzk0MjUsImV4cCI6MjAzNTM1NTQyNX0.jXiEA7f-cpOBD_1N-UaVrtCDGE7ovglAzHvT_L1LAug';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    if (!supabase || !supabase.storage) {
        console.error('Supabase client or storage is not initialized correctly.');
        return;
    }

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

document.getElementById('toggle-button').addEventListener('click', () => {
    const sideBar = document.getElementById('side-bar');
    sideBar.classList.toggle('collapsed');
});

document.getElementById('profile-button').addEventListener('click', () => {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('settings-link').addEventListener('click', (event) => {
    event.preventDefault(); 
    document.getElementById('profile-photo-input').click();
});

document.getElementById('profile-photo-input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const accessToken = getCookie('sb-access-token');
        if (!accessToken) {
            console.error('Access token is missing.');
            return;
        }

        try {
            const uploadUrl = `https://lllitinjwarzhqnfxkur.supabase.co/storage/v1/object/avatars/private/${file.name}`;
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            });

            const responseText = await response.text();
            if (!response.ok) {
                console.error(`Error uploading file: ${response.status} ${response.statusText}`);
                console.error('Response:', responseText);
                throw new Error(`Error uploading file: ${response.statusText}`);
            }

            const data = JSON.parse(responseText);
            console.log('File uploaded successfully:', data);
        } catch (error) {
            console.error('Error uploading profile photo:', error);
        }
    }
});

document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        deleteCookie('sb-access-token');
        deleteCookie('sb-refresh-token');

        window.location.href = '/';
    } catch (error) {
        console.error('Error during logout:', error);
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

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}