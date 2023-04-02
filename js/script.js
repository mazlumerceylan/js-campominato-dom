const main = document.querySelector('.game-wrapper');
const playBtn = document.querySelector('#play');
const levelSelect = document.querySelector('#level');

const gridLevels = [100, 81, 49];
const NUM_BOMBS = 16;
let bombs = [];
let points = 0;


playBtn.addEventListener('click', play);


function play(){
  console.log('PLAY');
  
  reset();

  const cellNumbers = gridLevels[levelSelect.value];

  generatePlayGround(cellNumbers);

  bombs = generateBombs(cellNumbers);

  console.log(bombs);
}

function generateBombs(cellNumbers){
    const bombs = [];
    while(bombs.length < NUM_BOMBS){
      const bomb = getRandomNumber(1, cellNumbers);
      if(!bombs.includes(bomb)) bombs.push(bomb);
    }

    return bombs;
}


function generatePlayGround(cellNumbers){
    const grid = document.createElement('div');
    grid.className = 'grid';
    
    for (let i = 1; i <= cellNumbers; i++) {
      const cell = createCell(cellNumbers, i);
      grid.append(cell);
    }

    main.append(grid);

}

function createCell(cellNumbers, id){
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.classList.add('square' + cellNumbers);
  cell._cellId = id;
  cell.addEventListener('click', hadleClickCell)
  return cell;
}

function hadleClickCell(){
  if(bombs.includes(this._cellId)){
    endGame(false);
  }else{

    const numBombs = getNearlyBombs(this._cellId);

    this.innerHTML = `<span>${numBombs}</span>`;
    points++;
    this.removeEventListener('click',hadleClickCell);
    const cells = document.getElementsByClassName('cell');
    if(points === cells.length - NUM_BOMBS){
      endGame(true);
    }
  }
  this.classList.add('clicked');
}

function getNearlyBombs(idCell){
  const nearlyCell = getNearlyCells(idCell);
  let numBombs = 0;
  for (let i = 0; i < nearlyCell.length; i++) {
    if(bombs.includes(nearlyCell[i])) numBombs++;
  }
  return numBombs;
}

function getNearlyCells(idCell){
  const cellPerRow = Math.sqrt(document.getElementsByClassName('cell').length)
  let nearlyCell = [];

  if(idCell % cellPerRow === 1){
    nearlyCell = [
      idCell + 1,
      idCell - cellPerRow,
      idCell - cellPerRow + 1,
      idCell + cellPerRow,
      idCell + cellPerRow + 1,
    ]
  } else if(idCell % cellPerRow === 0){
    nearlyCell = [
      idCell - 1,
      idCell - cellPerRow,
      idCell - cellPerRow - 1,
      idCell + cellPerRow,
      idCell + cellPerRow - 1,
    ]
  }else{
    nearlyCell = [
      idCell + 1,
      idCell - 1,
      idCell - cellPerRow,
      idCell - cellPerRow - 1,
      idCell - cellPerRow + 1,
      idCell + cellPerRow,
      idCell + cellPerRow - 1,
      idCell + cellPerRow + 1,
    ]
  }

  return nearlyCell;

}

function endGame(isWin){
  showBombs();
  const endGame = document.createElement('div');
  endGame.className = 'end-game';
  main.append(endGame);
  console.log('FINE');

  const cells = document.getElementsByClassName('cell');
  let endMessageStr = '';
  if(isWin){
    endMessageStr = `HAI VINTO!! Ha fatto ${points} punti su ${cells.length - NUM_BOMBS}`;
  }else{
    endMessageStr = `HAI PERSO! Ha fatto SOLO ${points} punti su ${cells.length - NUM_BOMBS}`;
  }
  document.querySelector('.endMessage').innerHTML = endMessageStr;
}

function showBombs(){
  const cells = document.getElementsByClassName('cell');
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if(bombs.includes(cell._cellId)){
      console.log('sono una bomba',cell._cellId);
      cell.classList.add('bomb');
    }
  }

}

function reset(){
  console.log('RESET');
  main.innerHTML = '';
  points = 0;
  bombs = [];
  document.querySelector('.endMessage').innerHTML = '';
}

function getRandomNumber(min, max){
  let error = false;
  let errorMsg;
  if(isNaN(min) || isNaN(max)){
    error = true;
    errorMsg = 'min e max devono essere numeri';
  }
  if(min >= max){
    error = true;
    errorMsg = 'min deve essere inferiore a max';
  }
  if(error){
    console.error(errorMsg);
    return;
  }
  
  return Math.floor(Math.random() * (max - min + 1 ) + min)
}