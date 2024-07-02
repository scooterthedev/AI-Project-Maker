document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase client
    const supabaseUrl = 'https://lllitinjwarzhqnfxkur.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGl0aW5qd2FyemhxbmZ4a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3Nzk0MjUsImV4cCI6MjAzNTM1NTQyNX0.jXiEA7f-cpOBD_1N-UaVrtCDGE7ovglAzHvT_L1LAug';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data: userExists, error: checkUserError } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (checkUserError && checkUserError.code !== 'PGRST116') { // PGRST116 means no data found
                console.error('Error checking user existence:', checkUserError.message);
                alert('Error checking user existence');
                return;
            }

            if (userExists) {
                alert('User already exists. Please use a different email.');
            } else {
                // Sign-up
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) {
                    alert(signUpError.message);
                } else {
                    // Insert email into 'users' table
                    const { data: insertData, error: insertError } = await supabase
                        .from('users')
                        .insert([{ email }]);

                    if (insertError) {
                        console.error('Error inserting user into database:', insertError.message);
                        alert('Registration successful, but there was an error saving user data.');
                    } else {
                        alert('Registration successful!');
                        window.location.href = '/otp/index.html';
                    }
                }
            }
        } catch (error) {
            console.error('Error processing request:', error.message);
            alert('Error processing request');
        }
    });
});
