
async function createAuth0Client() {
  const response = await fetch('/auth0/auth_config.json');
  const config = await response.json();
  return await auth0.createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
  });
}

const auth0Client = await createAuth0Client();

window.addEventListener('load', async () => {
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    showProfile();
  } else {
    showLoginButton();
  }
});

function showLoginButton() {
  document.getElementById('loginBtn').style.display = 'block';
}

function showProfile() {
  document.getElementById('profile').style.display = 'block';
  auth0Client.getUser().then(user => {
    document.getElementById('profile-name').innerText = user.name;
    document.getElementById('profile-email').innerText = user.email;
  });
}

async function login() {
  await auth0Client.loginWithRedirect({
    redirect_uri: window.location.origin
  });
}

async function logout() {
  await auth0Client.logout({
    returnTo: window.location.origin
  });
}
