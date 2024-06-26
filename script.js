const grid = document.querySelector('.grid');
const numBlocks = 130; // Number of blocks to cover the page, adjust as needed

// Create blocks dynamically
for (let i = 0; i < numBlocks; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    grid.appendChild(block);
}
document.addEventListener("DOMContentLoaded", async () => {
    const auth0Client = await createAuth0Client();
  
    const isAuthenticated = await auth0Client.isAuthenticated();
  
    if (isAuthenticated) {
      document.getElementById("loginBtn").style.display = "none";
      document.getElementById("profile").style.display = "block";
  
      const user = await auth0Client.getUser();
      document.getElementById("profile-name").innerText = user.name;
      document.getElementById("profile-email").innerText = user.email;
    } else {
      document.getElementById("loginBtn").style.display = "block";
      document.getElementById("profile").style.display = "none";
    }
  });
  