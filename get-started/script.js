document.addEventListener('DOMContentLoaded', async () => {
    const supabaseUrl = 'https://lllitinjwarzhqnfxkur.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGl0aW5qd2FyemhxbmZ4a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3Nzk0MjUsImV4cCI6MjAzNTM1NTQyNX0.jXiEA7f-cpOBD_1N-UaVrtCDGE7ovglAzHvT_L1LAug';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const loadingBox = document.getElementById('loading-box');
    const registerForm = document.getElementById('register-form');
    const messageContainer = document.getElementById('message-container');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessages();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading box
        loadingBox.style.display = 'block';

        try {
            const { data: userExists, error: checkUserError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (checkUserError && checkUserError.code !== 'PGRST116') { // PGRST116 means no data found
                console.error('Error checking user existence:', checkUserError.message);
                showError('Error checking user existence');
                return;
            }

            if (userExists) {
                showError('User already exists. Please use a different email.');
            } else {
                // Sign-up
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) {
                    showError(signUpError.message);
                } else {
                    // Insert email into 'users' table
                    const { data: insertData, error: insertError } = await supabase
                        .from('users')
                        .insert([{ email }]);

                    if (insertError) {
                        console.error('Error inserting user into database:', insertError.message);
                        showError('Registration successful, but there was an error saving user data.');
                    } else {
                        // Show notification popup
                        notification.classList.add('show');
                        setTimeout(() => {
                            notification.classList.remove('show');
                        }, 5000);
                        showMessage('Email sent! Check your email.');
                    }
                }
            }
        } catch (error) {
            console.error('Error processing request:', error.message);
        } finally {
            // Hide loading box
            loadingBox.style.display = 'none';
        }
    });
    function showMessage(message) {
        createMessage(message, 'message');
    }

    function showError(message) {
        createMessage(message, 'error-message');
    }

    function createMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = className;
        messageDiv.innerText = message;
        messageContainer.appendChild(messageDiv);
    }

    function clearMessages() {
        messageContainer.innerHTML = '';
    }
})
