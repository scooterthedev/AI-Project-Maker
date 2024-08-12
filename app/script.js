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

    document.getElementById('profile-photo-input').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const accessToken = getCookie('sb-access-token');
            if (!accessToken) {
                console.error('Access token is missing.');
                return;
            }

            try {
                const fileName = file.name;

                const uploadUrl = `https://lllitinjwarzhqnfxkur.supabase.co/storage/v1/object/avatars/private/${fileName}`;
                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData
                });

                if (!uploadResponse.ok) {
                    console.error(`Error uploading file: ${uploadResponse.status} ${uploadResponse.statusText}`);
                    const responseText = await uploadResponse.text();
                    console.error('Response:', responseText);
                    throw new Error(`Error uploading file: ${uploadResponse.statusText}`);
                }

                const updateUrl = `${supabaseUrl}/rest/v1/users?email=eq.${getUserEmailFromToken(accessToken)}`;

                const updateResponse = await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'apikey': supabaseKey,
                    },
                    body: JSON.stringify({
                        profile_name: fileName
                    })
                });

                if (!updateResponse.ok) {
                    throw new Error('Error updating profile name in database: ' + updateResponse.statusText);
                }

                const signedUrl = `https://lllitinjwarzhqnfxkur.supabase.co/storage/v1/object/authenticated/avatars/private/${fileName}`;

                const imageResponse = await fetch(signedUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!imageResponse.ok) {
                    throw new Error('Failed to fetch image: ' + imageResponse.statusText);
                }

                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                document.getElementById('profile-photo-logo').src = imageUrl;
            } catch (error) {
                console.error('Error handling profile photo:', error);
            }
        }
    });

    document.addEventListener('click', (event) => {
        const profileMenu = document.getElementById('profile-menu');
        const profileButton = document.getElementById('profile-button');

        if (!profileMenu.contains(event.target) && !profileButton.contains(event.target)) {
            profileMenu.style.display = 'none';
        }
    });

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

                const userEmail = userData.user.email;

                const { data: userProfile, error: profileError } = await supabase
                    .from('users')
                    .select('is_first_time')
                    .eq('email', userEmail)
                    .single();

                if (profileError) {
                    throw new Error('Failed to fetch user profile: ' + profileError.message);
                }

                const isFirstTime = userProfile && userProfile.is_first_time;

                if (isFirstTime) {
                    setCookie('is_first_time', 'true', 14);
                    const { error: updateError } = await supabase
                        .from('users')
                        .update({ is_first_time: false })
                        .eq('email', userEmail);
                    if (updateError) {
                        throw new Error('Failed to update is_first_time: ' + updateError.message);
                    }
                    if (updateError) {
                        throw new Error('Failed to update is_first_time: ' + updateError.message);
                    }
                } else {
                    setCookie('is_first_time', 'false', 14);
                }

                if (isFirstTime) {
                    document.getElementById('overlay').classList.add('show');
                }

                const cookieAccessToken = getCookie('sb-access-token');
                if (cookieAccessToken === access_token) {
                    document.getElementById('welcome-message').textContent = `Hi, ${userEmail}`;

                    const { data: userProfile, error: profileError } = await supabase
                        .from('users')
                        .select('profile_name')
                        .eq('email', userEmail)
                        .single();

                    if (profileError) {
                        throw new Error('Failed to fetch user profile: ' + profileError.message);
                    }

                    if (userProfile && userProfile.profile_name) {
                        const signedUrl = `https://lllitinjwarzhqnfxkur.supabase.co/storage/v1/object/authenticated/avatars/private/${userProfile.profile_name}`;

                        const imageResponse = await fetch(signedUrl, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        });

                        if (imageResponse.ok) {
                            const imageBlob = await imageResponse.blob();
                            const imageUrl = URL.createObjectURL(imageBlob);
                            document.getElementById('profile-photo-logo').src = imageUrl;
                        } else {
                            console.error('Failed to fetch profile image:', imageResponse.statusText);
                        }
                    }
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

function getUserEmailFromToken(accessToken) {
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).email;
}