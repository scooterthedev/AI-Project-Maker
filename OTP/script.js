document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase client
    const supabaseUrl = 'https://lllitinjwarzhqnfxkur.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGl0aW5qd2FyemhxbmZ4a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3Nzk0MjUsImV4cCI6MjAzNTM1NTQyNX0.jXiEA7f-cpOBD_1N-UaVrtCDGE7ovglAzHvT_L1LAug';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const otpForm = document.getElementById('otpForm');

    otpForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collecting the OTP from the inputs
        const otpInputs = document.querySelectorAll('.otp-input');
        let otp = '';
        otpInputs.forEach(input => {
            otp += input.value;
        });

        const email = sessionStorage.getItem('otpEmail');

        const { error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'magiclink' // Adjust type as necessary
        });

        if (verifyError) {
            console.error('Error verifying OTP:', verifyError.message);
            alert('Invalid OTP. Please try again.');
        } else {
            alert('OTP verified successfully!');
            window.location.href = '/success.html';
        }
    });
});
