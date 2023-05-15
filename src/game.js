const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.getElementById('up')
const btnLeft = document.getElementById('left')
const btnRight = document.getElementById('right')
const btnDown = document.getElementById('down')
const live = document.getElementById('lives')
const time = document.getElementById('time')
const record = document.getElementById('record')
const pResult = document.getElementById('result')

// VARIABLES GLOBALES
let canvaSize;
let elementsSize;
let enemyPositions = []

let level = 0
let lives = 3

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined
}

const giftPosition = {
  x: undefined,
  y: undefined
}

const showLive = () => {
	const heartsArray = Array(lives).fill(emojis['LIVE'])
	live.innerHTML = ""
	heartsArray.forEach(heart => live.append(heart))
}

const levelFail = () => {
	lives--;

	if(lives <= 0) level = 0
	if(lives === 0){
		lives = 3
		timeStart = undefined
	}

	playerPosition.x = undefined
	playerPosition.y = undefined
	startGame()
}

const showTime = () => {
	time.innerHTML = Date.now() - timeStart;
}

const showRecord = () => record.innerHTML = localStorage.getItem('record_time')

const gameWin = () => {
	clearInterval(timeInterval)

  const recordTime = localStorage.getItem('record_time')
  const playerTime = Date.now() - timeStart;

  if(recordTime) {
    if(recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime)
    } else {
      console.log('jajaj que estupido')
    }
  } else {
    localStorage.setItem('record_time', playerTime)
  }

  console.log({recordTime,playerTime})
}

const nextLevel = () => {
  level++
  startGame()
}

const playerPositionMove = () => {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3)
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3)
  const giftCollision = giftCollisionX && giftCollisionY

  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3)
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
    return enemyCollisionX && enemyCollisionY
  })

  if(giftCollision) nextLevel()
  if(enemyCollision) levelFail()

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y)
}

const setCanvasSize = () => {
  if (window.innerHeight > window.innerWidth) {
    canvaSize = window.innerWidth * 0.7;
  } else {
    canvaSize = window.innerHeight * 0.7;
  }

  canvaSize = Number(canvaSize.toFixed(0));

  canvas.setAttribute('width', canvaSize);
  canvas.setAttribute('height', canvaSize);

  elementsSize = canvaSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
};

const startGame = () => {
	game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord()
  }

  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  showLive();

  enemyPositions = [];
  game.clearRect(0,0,canvaSize, canvaSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });

  playerPositionMove()
};

const keyboardGame = () => {
  const moveUp = () => {
    if((playerPosition.y - elementsSize) < elementsSize) alert('pa onde te vas mi loko')
    else {
      playerPosition.y -= elementsSize
      startGame()
    }
  }

  const moveLeft = () => {
    if((playerPosition.x - elementsSize) < elementsSize) alert('arranca pa tras')
    else{
      playerPosition.x -= elementsSize
      startGame()
    }
  }

  const moveRight = () => {
    if((playerPosition.x + elementsSize) > canvaSize) alert('menor para bolas chamo')
    else {
      playerPosition.x += elementsSize
      startGame()
    }
  }

  const moveDown = () => {
    if((playerPosition.y + elementsSize) > canvaSize) alert('tu tiendes down de pana')
    else{
      playerPosition.y += elementsSize
      startGame()
    }
  }

  btnUp.addEventListener('click', ()=> moveUp())
  btnLeft.addEventListener('click', ()=> moveLeft())
  btnRight.addEventListener('click', ()=> moveRight())
  btnDown.addEventListener('click', ()=> moveDown())

  window.addEventListener('keydown', (event)=> {
    if(event.key === 'w') moveUp()
    else if (event.key === 'a') moveLeft()
    else if (event.key === 's') moveDown()
    else if (event.key === 'd') moveRight()

    if(event.key === 'ArrowUp') moveUp()
    else if (event.key === 'ArrowLeft') moveLeft()
    else if (event.key === 'ArrowDown') moveDown()
    else if (event.key === 'ArrowRight') moveRight()
  })
}

keyboardGame()

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
