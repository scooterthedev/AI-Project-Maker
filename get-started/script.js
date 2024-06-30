import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lllitinjwarzhqnfxkur.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGl0aW5qd2FyemhxbmZ4a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3Nzk0MjUsImV4cCI6MjAzNTM1NTQyNX0.jXiEA7f-cpOBD_1N-UaVrtCDGE7ovglAzHvT_L1LAug';
const supabase = createClient(supabaseUrl, supabaseKey);
// Register form submission
const registerForm = document.getElementById('login-container');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    async function signUpNewUser(){
    try {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Registration successful!');
            // Optionally, redirect or update UI after successful registration
        }
    } catch (error) {
        console.error('Error registering user:', error.message);
        alert('Error registering user');
    }
    }
});