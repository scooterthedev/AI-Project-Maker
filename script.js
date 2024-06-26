const grid = document.querySelector('.grid');
const numBlocks = 130; // Number of blocks to cover the page, adjust as needed

// Create blocks dynamically
for (let i = 0; i < numBlocks; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    grid.appendChild(block);
}
