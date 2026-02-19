import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import { GameStation } from "./utils/constants.js";
import SoundEffects from "./classes/SoundEffects.js";


const soundEffects = new SoundEffects();

const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over');
const scoreUi = document.querySelector('.score-ui');
const scoreElement = scoreUi.querySelector('.score > span');
const levelElement = scoreUi.querySelector('.level > span');
const highElement = scoreUi.querySelector('.high > span');
const buttonPlay = document.querySelector('.button-play');
const buttonRestart = document.querySelector('.button-restart');

gameOverScreen.remove();
   

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
}

let currentState = GameStation.START;

const gameData = {
    score: 0,
    level: 1,
    high: 0

}

const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
}




setup();
window.addEventListener('resize', setup);

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);
const playerProjectiles = [];
const invadersProjectiles = [];
const particles = [];
const obstacles = [];


const initObstacles = () => {
    const x = canvas.width / 2 -50;
    const y = canvas.height - 190;
    const offset = canvas.width * 0.15;
    const color = "crimson";

    const obstacle1 = new Obstacle ({x: x - offset,y}, 100, 20, color);
    const obstacle2 = new Obstacle ({x : x + offset,y}, 100, 20, color);


    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
};

    initObstacles()

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};

const incrementScore = (value) => {
    gameData.score += value
    if (gameData.score > gameData.high){
        gameData.high = gameData.score;
    }
}

const drawObstacles = () => {
    obstacles.forEach(obstacle => obstacle.draw(ctx)) 
}
//Desenha os tiros, atualiza e limpa os projéteis que sairem da tela//
const handleProjectiles = () => {
    playerProjectiles.forEach((p, index) => {
        p.draw(ctx);
        p.update();
        if (p.position.y <= 0) {
            playerProjectiles.splice(index, 1);
        }
    });
    invadersProjectiles.forEach((p, index) => {
        p.draw(ctx);
        p.update();
        // Remove se passar do fim da tela (baixo)
        if (p.position.y >= canvas.height) {
            invadersProjectiles.splice(index, 1);
        }
    });
}



const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.forEach((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                soundEffects.playHitSound();


                incrementScore(10)
                
               
                createExplosion(invader, "#941cff")
                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
};

const checkShootPlayer = () => {
    invadersProjectiles.forEach((projectile,i) => {
        
        if (player.hit(projectile)){
            soundEffects.playExplosionSound();
            invadersProjectiles.splice(i,1);
            gameOver();
            
        };
    });
};

const checkShootObstacles = () => {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile,i) => {
            if (obstacle.hit(projectile)){
            playerProjectiles.splice(i,1);
            }
        });
        invadersProjectiles.some((projectile,i) => {
            if (obstacle.hit(projectile)){
            invadersProjectiles.splice(i,1);

    }
        });

    });
};      
            

const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();

        grid.rows = Math.round(Math.random()*7 + 1);
        grid.cols = Math.round(Math.random()*7 + 1);
        grid.restart();

        gameData.level += 1;

    }
};

    

const gameOver = () => {
    createExplosion({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y + player.height / 2
            },

            width:0,
            height:0
            }, "red");

            createExplosion({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + player.height / 2
                },
                width: 0,
                height: 0
            }, "#4D9BE6");

            createExplosion({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + player.height / 2
                },
                width: 0,
                height: 0
            }, "crimson");

        currentState = GameStation.GAME_OVER;
        document.body.append(gameOverScreen)
    
}




//Desenha as partículas, atualiza e limpa as partículas do jogador e dos Invaders
const drawParticles = () => {
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.draw(ctx);
            particle.update();
        }
    });
};

const createExplosion = (invader, color) => {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle({
            position: {
                x: invader.position.x + invader.width / 2,
                y: invader.position.y + invader.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            radius: Math.random() * 3,
            color: color ||"#941cff"
        }));
    }
};



const gameLoop = () => {
    
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameStation.PLAYING) {
        showGameData()
        spawnGrid();
        drawParticles();
        handleProjectiles();
        grid.draw(ctx);
        grid.update(player.alive);
        drawObstacles();

        
        checkShootInvaders();
        checkShootPlayer();
        checkShootObstacles();


        // --- DESENHO DO JOGADOR ---
        ctx.save();
        const centerX = player.position.x + player.width / 2;
        const centerY = player.position.y + player.height / 2;
        ctx.translate(centerX, centerY);

        // Tiro
        if (keys.shoot.pressed && keys.shoot.released) {
            soundEffects.playShootSound();
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }

        // Movimento e Rotação
        if (keys.left && player.position.x > 0) {
            player.moveleft();
            ctx.rotate(-0.15);
        }
        if (keys.right && player.position.x < canvas.width - player.width) {
            player.moveright();
            ctx.rotate(0.15);
        }

        player.draw(ctx);
        ctx.restore();

    }

    if (currentState == GameStation.GAME_OVER){
        checkShootObstacles();

        drawParticles();
        handleProjectiles();
        drawObstacles();
        grid.draw(ctx);
        grid.update(player.alive);
        player.alive = false;
     
    }

    // 3. CONTINUIDADE
    requestAnimationFrame(gameLoop);
};

// Inimigos atiram a cada 1 segundo
setInterval(() => {
    if (grid && grid.invaders.length > 0) {
        const randomInvader = grid.getRamdomInvader();
        if (randomInvader) {
            randomInvader.shoot(invadersProjectiles);
        }
    }
}, 1000);

addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === "a") keys.left = true;
    if (e.key.toLowerCase() === "d") keys.right = true;
    if (e.code === "Space") keys.shoot.pressed = true;
});

addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === "a") keys.left = false;
    if (e.key.toLowerCase() === "d") keys.right = false;
    if (e.code === "Space") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

buttonPlay.addEventListener('click', () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameStation.PLAYING;
}, 1000);

    
buttonRestart.addEventListener('click', () => {
    currentState = GameStation.PLAYING
    player.alive = true
    player.position.x = canvas.width / 2 - player.width / 2;
    grid.invaders = [];
    grid.invadersVelocity = 1
    invadersProjectiles.length = 0

    spawnGrid();

    gameData.score = 0;
    gameData.level = 1;


    gameOverScreen.remove();

    
});

 
// Inicia o jogo
gameLoop();