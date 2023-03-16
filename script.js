// Module game board
const gameBoard = (() => {
  const gameGrid = document.querySelector('.game-grid');
  const gameBoardArr = [];

  const createGrid = () => {
    gameGrid.classList.add('showed');
    for (let i = 0; i < 9; i += 1) {
      const cell = document.createElement('div');
      cell.textContent = '';
      cell.classList.add(`cell`);
      gameGrid.appendChild(cell);
    }
  };

  const showGameBoard = () => {
    for (let i = 0; i < gameBoardArr.length; i += 1) {
      const addedSymbol = gameBoardArr[i];
      const cellNodes = document.querySelectorAll('.cell');
      cellNodes[i].textContent = addedSymbol;
    }
  };

  const takeTurn = (playerParam, arrIndex) => {
    gameBoardArr[arrIndex] = playerParam.symbol;
  };

  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const checkWinner = (playerOneParam, playerTwoParam) => {
    const combs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const xIndexes = [];
    const oIndexes = [];
    const xElement = playerOneParam.symbol;
    const oElement = playerTwoParam.symbol;

    for (let i = 0; i < gameBoardArr.length; i += 1) {
      const element = gameBoardArr[i];
      if (element === xElement) {
        xIndexes.push(i);
      } else if (element === oElement) {
        oIndexes.push(i);
      }
    }

    for (let i = 0; i < combs.length; i += 1) {
      const combo = combs[i];
      if (checker(xIndexes, combo)) {
        return 'playerOneWins';
      }
      if (checker(oIndexes, combo)) {
        return 'playerTwoWins';
      }
      if (gameBoardArr.length === 9 && !gameBoardArr.includes(undefined)) {
        return 'draw';
      }
    }
    return false;
  };

  return { createGrid, showGameBoard, takeTurn, checkWinner };
})();

// Factory function for player creation
const playerFactory = (name, symbol) => ({ name, symbol });

// Module for display controller
const displayController = (() => {
  const playerTurnHeadline = document.querySelector('.player-turn');
  const winnerElement = document.querySelector('.show-winner');
  let playerOne;
  let playerTwo;
  let turn = 'playerOne';

  const startGame = () => {
    gameBoard.createGrid();
    gameBoard.showGameBoard();
    playerOne = playerFactory('Rosty', 'X');
    playerTwo = playerFactory('Adi', 'O');
  };

  const changeTurnHeadline = (playerParam, headlineElement) => {
    const headlineEl = headlineElement;
    headlineEl.textContent = `${playerParam.name}'s turn!`;
  };

  const showWinner = (playerParam) => {
    winnerElement.textContent = `${playerParam.name} wins!`;
    playerTurnHeadline.textContent = 'Congrats! You did it!';
    winnerElement.classList.add('active');
  };

  const showDraw = () => {
    winnerElement.textContent = 'Nobody wins';
    playerTurnHeadline.textContent = 'Draw! Play again';
    winnerElement.classList.add('active');
  };

  const playRound = () => {
    const cellNodes = document.querySelectorAll('.cell');
    playerTurnHeadline.textContent = `${playerOne.name}'s turn!`;

    for (let i = 0; i < cellNodes.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      const listener = () => {
        if (turn === 'playerOne') {
          gameBoard.takeTurn(playerOne, i);
          changeTurnHeadline(playerTwo, playerTurnHeadline);
          turn = 'playerTwo';
          gameBoard.showGameBoard();
        } else {
          gameBoard.takeTurn(playerTwo, i);
          changeTurnHeadline(playerOne, playerTurnHeadline);
          turn = 'playerOne';
          gameBoard.showGameBoard();
        }
        switch (gameBoard.checkWinner(playerOne, playerTwo)) {
          case 'playerOneWins':
            showWinner(playerOne);
            break;
          case 'playerTwoWins':
            showWinner(playerTwo);
            break;
          case 'draw':
            showDraw();
            break;
          default:
            break;
        }
        cellNodes[i].removeEventListener('click', listener);
      };
      cellNodes[i].addEventListener('click', listener);
    }
  };

  return { startGame, playRound };
})();

// displayController.startGame();
// displayController.playRound();
