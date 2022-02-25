const MAX_ENEMY = 8;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
      record = document.querySelector('.record'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.game-area'),
      car = document.createElement('div'),
      btns = document.querySelectorAll('.btn'),
      treeSideLeft = document.querySelector('.tree-side-left'),
      treeSideRight = document.querySelector('.tree-side-right');

const music = new Audio('./src/audio.mp3');
  music.volume = 0.5;

car.classList.add('car');
score.classList.add('hide');
record.classList.add('hide');

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

let startSpeed = 0;

const changeLevel = (lvl) => {

  switch (lvl) {
    case '1':
      setting.traffic = 4;
      setting.speed = 3;
      car.style.background = 'transparent url("./src/img/playerEasy.png") center / contain no-repeat';
      break;
    case '2':
      setting.traffic = 3;
      setting.speed = 5;
      car.style.background = 'transparent url("./src/img/playerMid.png") center / contain no-repeat';
      break;
    case '3':
      setting.traffic = 3;
      setting.speed = 7;
      car.style.background = 'transparent url("./src/img/playerHard.png") center / contain no-repeat';
      break;
  }

  startSpeed = setting.speed;
};

const getQuantityElements = heightElement => (gameArea.offsetHeight / heightElement) + 1;
const getRandomEnemy = max => Math.floor(Math.random() * max) + 1;

const startGame = event => {
  const target = event.target;

  if(!target.classList.contains('btn')) return;

  music.play();

  const levelGame = target.dataset.levelGame;

  changeLevel(levelGame);
  
  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;

  start.classList.add('hide');

  gameArea.innerHTML = '';
  treeSideLeft.innerHTML = '';
  treeSideRight.innerHTML = '';

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.y = i * HEIGHT_ELEM;
    line.style.top = line.y + 'px';
    gameArea.append(line);

    
    const createTree = () => {
      const tree = document.createElement('div');
      tree.classList.add('tree');
      tree.style.left = Math.random() * (treeSideLeft.offsetWidth - 50) + 'px';
      tree.style.right = Math.random() * (treeSideRight.offsetWidth - 50) + 'px';
      tree.y = i * HEIGHT_ELEM;
      tree.style.top = tree.y + 'px';
    
      return tree;
    }

    treeSideLeft.append( createTree() );
    treeSideRight.append( createTree() );
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background += `transparent url('./src/img/enemy${getRandomEnemy(MAX_ENEMY)}.png') center / contain no-repeat`;
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  car.style.left = (gameArea.offsetWidth - car.offsetWidth)/2 + 'px';
  car.style.top = 'auto';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

const playGame = () => {

  if(setting.start) {
    score.classList.remove('hide');
    record.classList.remove('hide');
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    record.innerHTML = 'RECORD:<br>' + localStorage.getItem('record');

    setting.speed = startSpeed + Math.floor(setting.score / 5000);
    moveRoad();
    moveEnemy();

    if(keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if(keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } else {
    music.pause();
  }

}

const startRun = event => {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

const stopRun = event => {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

const moveRoad = () => {
  let lines = document.querySelectorAll('.line');
  let trees = document.querySelectorAll('.tree');
  
  const moveItem = item => {
    item.y += setting.speed;
    item.style.top = item.y + 'px';

    if(item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM;
    }

  };

  lines.forEach( line => moveItem(line) );
  trees.forEach( tree => moveItem(tree) );
}

const moveEnemy = () => {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach( item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if(carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
        setting.start = false;
        start.classList.remove('hide');
        setting.record = setting.score;

        if (localStorage.getItem('record') === null) {
          localStorage.record = setting.score;
        } else if (localStorage.getItem('record') < setting.score) {
          localStorage.record = setting.score;
        }
        record.innerHTML =
          'RECORD:<br>' + localStorage.getItem('record');
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -150 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }

  });
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
