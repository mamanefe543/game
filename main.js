const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const startMenu = document.getElementById('startMenu');
const overlay = document.getElementById('overlay');
const finalScoreText = document.getElementById('finalScore');

const enesImg = new Image();
enesImg.src = 'assets/enes.png';
const treeImg = new Image();
treeImg.src = 'assets/tree.png';

const bgMusic = new Audio('assets/music.mp3');
bgMusic.loop = true;

let player = {x: 50, y: canvas.height/2 - 32, width: 64, height: 64, speed: 5};
let trees = [];
let spawnTimer = 0;
let score = 0;
let gameOver = false;
let keys = {};

// Dokunmatik kontroller için
let touchUp = false;
let touchDown = false;

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Mobil butonlar
document.getElementById('upBtn').addEventListener('touchstart', e => { touchUp = true; e.preventDefault(); });
document.getElementById('upBtn').addEventListener('touchend', e => { touchUp = false; e.preventDefault(); });
document.getElementById('downBtn').addEventListener('touchstart', e => { touchDown = true; e.preventDefault(); });
document.getElementById('downBtn').addEventListener('touchend', e => { touchDown = false; e.preventDefault(); });

function isColliding(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    ctx.drawImage(enesImg, player.x, player.y, player.width, player.height);

    for(let tree of trees){
        ctx.drawImage(treeImg, tree.x, tree.y, tree.width, tree.height);
    }

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Skor: " + score, 10, 30);
}

function playerDied() {
    gameOver = true;
    bgMusic.pause();
    finalScoreText.innerText = "Skorun: " + score;
    overlay.style.display = 'flex';
}

function update() {
    if(gameOver) return;

    // Klavye
    if(keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if(keys['ArrowDown'] && player.y + player.height < canvas.height) player.y += player.speed;

    // Dokunmatik
    if(touchUp && player.y > 0) player.y -= player.speed;
    if(touchDown && player.y + player.height < canvas.height) player.y += player.speed;

    spawnTimer++;
    if(spawnTimer > 90){
        const treeCount = 3;
        for(let i = 0; i < treeCount; i++){
            let segmentHeight = canvas.height / treeCount;
            let treeY = segmentHeight * i + Math.random() * (segmentHeight - 64);
            trees.push({x: canvas.width, y: treeY, width: 64, height: 64});
        }
        spawnTimer = 0;
    }

    for(let tree of trees){
        tree.x -= 5;
        if(isColliding(player, tree)){
            if(!gameOver) playerDied();
        }
    }

    score++;
    draw();
    if(!gameOver) requestAnimationFrame(update);
}

function startGame() {
    startMenu.style.display = 'none';
    overlay.style.display = 'none';
    canvas.style.display = 'block';

    player.y = canvas.height/2 - 32;
    trees = [];
    spawnTimer = 0;
    score = 0;
    gameOver = false;

    bgMusic.currentTime = 0;
    bgMusic.play();

    update();
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
