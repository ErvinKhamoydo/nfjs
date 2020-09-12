const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.game-area');
const soundMovingCar = document.querySelector('.sound-moving-car');
const soundTurnCar = document.querySelector('.sound-turn-car');

    soundMovingCar.volume= 0.1;
    soundTurnCar.volume= 0.2;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

const car = document.createElement('div');
car.classList.add('car');

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement;
}

function startGame() {
    start.classList.add('hide');

    gameArea.innerHTML = '';

    car.style.left = '50%';
    car.style.top = 'auto';
    car.style.bottom = '3%';
    car.style.transform = 'translateX(-50%)';

    setting.start = true;
    setting.score = 0;

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');

        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = "transparent url('../image/enemy.png') center / cover no-repeat";
        gameArea.appendChild(enemy);
    }

    gameArea.appendChild(car);

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;

    soundMovingCar.play();

    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        moveRoad();
        moveEnemy();

        setting.score++;
        score.textContent = setting.score;

        if (keys.ArrowLeft && setting.x > 25) {
            setting.x -= setting.speed;
            soundTurnCar.play();
        }

        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth / 2)) {
            setting.x += setting.speed;
            soundTurnCar.play();
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight - 1)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');

    lines.forEach((lineItem) => {
        lineItem.y += setting.speed;
        lineItem.style.top = lineItem.y + 'px';

        if (lineItem.y >= document.documentElement.clientHeight) {
            lineItem.y = -100;
        }
    });
}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');

    enemies.forEach((itemEnemy) => {
        itemEnemy.y += setting.speed / 2;
        itemEnemy.style.top = itemEnemy.y + 'px';

        if (itemEnemy.y >= document.documentElement.clientHeight) {
            itemEnemy.y = -100 * setting.traffic;
            itemEnemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }

        let carRect = car.getBoundingClientRect();
        let enemyRect = itemEnemy.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = start.offsetHeight + 'px';
            soundMovingCar.pause();
        }
    });
}

function startRun(event) {
    event.preventDefault();

    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();

    keys[event.key] = false;

    soundTurnCar.pause();
}

start.addEventListener('click', () => {
    soundMovingCar.play();
    startGame();
});
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);