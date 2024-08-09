const grid = document.querySelector('.grid');
const numBlocks = 130; // Number of blocks to cover the page

for (let i = 0; i < numBlocks; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    grid.appendChild(block);
}  