// Module game board
const gameBoard = (() => {
  const gameGrid = document.querySelector('.game-grid');
  let gameBoardArr = [];

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
    }
    if (gameBoardArr.length === 9 && !gameBoardArr.includes(undefined)) {
      return 'draw';
    }

    return false;
  };

  const resetGrid = () => {
    gameBoardArr = [];
    gameGrid.innerHTML = '';
    createGrid();
    showGameBoard();
  };

  return { createGrid, showGameBoard, takeTurn, checkWinner, resetGrid };
})();

// Factory function for player creation
const playerFactory = (name, symbol) => ({ name, symbol });

// Module for display controller
const displayController = (() => {
  const playerTurnHeadline = document.querySelector('.player-turn');
  const winnerElement = document.querySelector('.show-winner');

  const buttonsContainer = document.querySelector('.button-container');
  const humanOneButton = document.querySelector('.human1');
  const humanTwoButton = document.querySelector('.human2');
  const startGameButton = document.querySelector('.start-game');

  const resetButton = document.querySelector('.reset-button');

  let playerOne;
  let playerTwo;
  let turn = 'playerOne';

  // eslint-disable-next-line consistent-return
  const createPlayers = () => {
    resetButton.style.display = 'none';
    winnerElement.style.display = 'none';
    playerTurnHeadline.textContent = 'Choose players';
    humanOneButton.addEventListener('click', () => {
      humanOneButton.classList.add('pressed');
      playerOne = playerFactory('Player 1', 'X');
    });
    humanTwoButton.addEventListener('click', () => {
      humanTwoButton.classList.add('pressed');
      playerTwo = playerFactory('Player 2', 'O');
    });
    if ((playerOne, playerTwo)) {
      return true;
    }
  };

  const startGame = () => {
    gameBoard.createGrid();
    gameBoard.showGameBoard();
  };

  const changeTurnHeadline = (playerParam, headlineElement) => {
    const headlineEl = headlineElement;
    headlineEl.textContent = `${playerParam.name}'s turn!`;
  };

  const showWinner = (playerParam) => {
    winnerElement.style.display = 'grid';
    winnerElement.textContent = `${playerParam.name} wins!`;
    playerTurnHeadline.textContent = 'Congrats! You did it!';
    resetButton.style.display = 'block';
  };

  const showDraw = () => {
    winnerElement.style.display = 'grid';
    winnerElement.textContent = 'Nobody wins';
    playerTurnHeadline.textContent = 'Draw! Play again';
    resetButton.style.display = 'block';
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

  startGameButton.addEventListener('click', () => {
    if (createPlayers()) {
      buttonsContainer.style.display = 'none';
      startGame();
      playRound();
    }
  });

  resetButton.addEventListener('click', () => {
    gameBoard.resetGrid();
    winnerElement.style.display = 'none';
    turn = 'playerOne';
    playRound();
    resetButton.style.display = 'none';
  });

  return { createPlayers };
})();
displayController.createPlayers();
