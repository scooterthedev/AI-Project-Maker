// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1I5IopIO8XpuZAiiHsTR91TyFbT8RZds",
    authDomain: "ai-project-maker.firebaseapp.com",
    projectId: "ai-project-maker",
    storageBucket: "ai-project-maker.appspot.com",
    messagingSenderId: "680132197050",
    appId: "1:680132197050:web:2234c808b9caedaf516083"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to the auth service
const auth = firebase.auth();

// Handle social login
function handleAuth(provider) {
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('User signed in:', result.user);
        })
        .catch((error) => {
            console.error('Error during sign in:', error);
            showError(error.message);
        });
}

// Handle email/password login
document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;

    auth.setPersistence(persistence)
        .then(() => {
            return auth.signInWithEmailAndPassword(email, password);
        })
        .then((result) => {
            console.log('User signed in:', result.user);
        })
        .catch((error) => {
            console.error('Error during sign in:', error);
            showError(error.message);
        });
});

// Show error messages
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
}

// Social login button event listeners
document.getElementById('google-login').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    handleAuth(provider);
});

document.getElementById('github-login').addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider();
    handleAuth(provider);
});

document.getElementById('microsoft-login').addEventListener('click', () => {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    handleAuth(provider);
});
