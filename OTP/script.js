document.getElementById('otpForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Collecting the OTP from the inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    let otp = '';
    otpInputs.forEach(input => {
        otp += input.value;
    });

    // Example
    if (otp === '123456') { // Example OTP
        alert('OTP verified successfully!');
        // Redirect to the desired page after successful OTP verification
        window.location.href = 'success.html';
    } else {
        alert('Invalid OTP. Please try again.');
    }
});
