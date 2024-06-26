// Initialize Auth0 client
const auth0 = new Auth0Client({
    domain: 'dev-wbblu8s05n80xeug.us.auth0.com',
    client_id: 'NnsGLhYmjGus273M995L7JdI4qoT0OQr',
    redirect_uri: 'http://127.0.0.1:5500/callback', // Replace with your callback URL
  });
  
  // Function to handle login
  async function loginWithAuth0() {
    try {
      await auth0.loginWithPopup();
      // Redirect or perform actions after successful login
      window.location.href = '/'; // Redirect to home page
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Authentication failed. Please try again.');
    }
  }
  
  // Attach login function to your login button
  const loginButton = document.getElementById('login-button');
  loginButton.addEventListener('click', loginWithAuth0);
  
  // Handle social login buttons (Google, GitHub, etc.)
  document.getElementById('login-with-google').addEventListener('click', () => loginWithSocial('google'));
  document.getElementById('login-with-github').addEventListener('click', () => loginWithSocial('github'));
  document.getElementById('login-with-microsoft').addEventListener('click', () => loginWithSocial('microsoft'));
  
  async function loginWithSocial(provider) {
    try {
      await auth0.loginWithRedirect({
        redirect_uri: 'http://127.0.0.1:5500/callback', // Replace with your callback URL
        provider: provider,
      });
    } catch (error) {
      console.error('Social login failed:', error);
      alert('Social login failed. Please try again.');
    }
  }
  
  // Remember me feature (optional)
  const rememberMeCheckbox = document.getElementById('remember-me');
  rememberMeCheckbox.addEventListener('change', () => {
    if (rememberMeCheckbox.checked) {
      localStorage.setItem('remember-me', true);
    } else {
      localStorage.removeItem('remember-me');
    }
  });
  