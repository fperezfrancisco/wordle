/** set up game */

//important variables
const wordGrid = document.querySelector(".wordGrid");
let currentRow;
let currentCell;
let prevCell;
let nextCell;
let cellIndex;
let rowIndex;
var letterCorrect = 0;

const wordList = [
  "beast",
  "kayak",
  "river",
  "valor",
  "chair",
  "brain",
  "bread",
  "naive",
  "troll",
  "stool",
  "after",
  "exile",
  "quail",
  "tough",
  "rough",
  "dough",
  "zebra",
  "equal",
  "fight",
  "right",
  "tight",
  "water",
];

var gameWord;
const messageBox = document.querySelector(".messageBox");
const startGameMessage = document.getElementById("startGame");
const incompleteGuess = document.getElementById("wordNotFinished");
const gameOverMessage = document.getElementById("gameOver");
let gameWon;

//new game btn
const gameResultMessage = document.getElementById("gameResult");
const newGameBtn = document.getElementById("newGame");
newGameBtn.addEventListener("click", newGameSetUp);

const deleteBtn = document.getElementById("delete");
deleteBtn.addEventListener("click", deleteLetter);

document.getElementById("exitStart").addEventListener("click", exitBox);
document.getElementById("exitGuess").addEventListener("click", exitBox);
document.getElementById("exitGameOver").addEventListener("click", exitBox);

const p = document.getElementById("lossMessage");

function beginNewGame() {
  //set all global variables
  document.querySelectorAll(".btnKey").forEach((item) => {
    item.addEventListener("click", keyClick);
    item.classList.remove("used");
  });

  p.textContent = "";

  currentRow = wordGrid.querySelector("#row1");
  currentCell = currentRow.querySelector(".letter1");
  prevCell = null;
  nextCell = currentRow.querySelector(".letter2");
  cellIndex = 1;
  rowIndex = 1;
  //select primary guessing word
  gameWord = wordList[Math.floor(Math.random() * wordList.length)];
  //const gameWord = wordList[Math.floor(Math.random() * wordList.length)];
  console.log(gameWord);
  gameWon = false;
  setTimeout(function () {
    exitMessage(1);
  }, 5000);
}

function exitBox(event) {
  const currMessage = event.currentTarget.parentNode;
  if (currMessage.id === "startGame") {
    return exitMessage(1);
  } else if (currMessage.id === "wordNotFinished") {
    return exitMessage(2);
  } else if (currMessage.id === "gameOver") {
    return exitMessage(3);
  }
}

function exitMessage(index) {
  if (index === 1) {
    startGameMessage.classList.add("hidden");
  } else if (index === 2) {
    incompleteGuess.classList.add("hidden");
  } else {
    gameOverMessage.classList.add("hidden");
  }
  messageBox.classList.add("hidden");
}

function addLetter(letter) {
  //verify there is a cell to add
  if (currentCell === null) {
    /** error message row full */
  } else {
    //transition to new cell
    if (cellIndex <= 5) {
      currentCell.textContent = letter;
      currentCell.classList.add("active");
      prevCell = currentCell;
      currentCell = nextCell;
      if (cellIndex >= 4) {
        nextCell === null;
        cellIndex++;
        //handle the next cell
      } else {
        /* handle all other items */
        var nextCellIndex = cellIndex + 2;
        var nextCellClass = ".letter" + nextCellIndex;
        nextCell = currentRow.querySelector(nextCellClass);
        cellIndex++;
      }
    }
  }
}

function deleteLetter() {
  if (cellIndex > 1) {
    //shift backwards
    nextCell = currentCell;
    currentCell = prevCell;
    if (cellIndex === 2) {
      prevCell = null;
    } else {
      var prevCellIndex = cellIndex - 2;
      var preCellClass = ".letter" + prevCellIndex;
      prevCell = currentRow.querySelector(preCellClass);
    }
    cellIndex--;
    //delete
    currentCell.textContent = "";
    currentCell.classList.remove("active");
  }
}

function keyClick(event) {
  const key = event.currentTarget.textContent;
  console.log(key);
  //const key = currentBtn.textContent;
  if (key === "Enter") {
    rowCheck(gameWord);
  } else if (key === "Delete") {
    //return deleteLetter();
  } else if (key === "" || key === null || key.length > 1) {
    /**do nothing */
  } else {
    return addLetter(key);
  }
}

function rowCheck(currWord) {
  if (currWord.length != 5) {
    //incomplete guess warning
    console.log("chosen word is not long enough");
  } else if (cellIndex <= 5) {
    console.log("enter message box");
    incompleteGuess.classList.remove("hidden");
    messageBox.classList.remove("hidden");
  } else {
    letterCorrect = 0;
    for (let i = 0; i < currWord.length; i++) {
      letterCheck(i, currWord);
    }

    //set new row
    nextRowSet();
  }
}

function letterCheck(i, currWord) {
  setTimeout(function () {
    var cellClass = ".letter" + (i + 1);
    var currCell = currentRow.querySelector(cellClass);
    var correctLetter = currWord.charAt(i);
    //console.log(correctLetter);
    //console.log(currentCell.textContent);
    //check against first cell
    if (currCell.textContent === correctLetter) {
      currCell.classList.remove("active");
      currCell.classList.add("correct");
      letterCorrect++;
      if (letterCorrect === 5) {
        gameWon = true;
        return gameOver();
      }
    } else {
      currCell.classList.remove("active");
      if (currWord.includes(currCell.textContent)) {
        currCell.classList.add("wrongPlacement");
      } else {
        currCell.classList.add("wrong");
        document.getElementById(currCell.textContent).classList.add("used");
        document
          .getElementById(currCell.textContent)
          .removeEventListener("click", keyClick);
      }
    }
    //console.log(lCorrect);
  }, 250 * i);
}

function nextRowSet() {
  setTimeout(function () {
    rowIndex++;
    if (rowIndex > 6) {
      //game over
      return gameOver();
    }
    var rowId = "row" + rowIndex;
    currentRow = document.getElementById(rowId);
    currentCell = currentRow.querySelector(".letter1");
    prevCell = null;
    nextCell = currentRow.querySelector(".letter2");
    cellIndex = 1;
  }, 2000);
}

function gameOver() {
  if (!gameWon) {
    gameResultMessage.textContent = "You Lost!";
    p.textContent = "The word was: " + gameWord;
    //gameOverMessage.appendChild(p);
  } else {
    gameResultMessage.textContent = "You Won!";
  }

  const currMessage = gameResultMessage.parentNode;
  currMessage.classList.remove("hidden");
  currMessage.parentNode.classList.remove("hidden");
  return;
}

function newGameSetUp() {
  //reset game screen
  document.querySelectorAll(".letterCell").forEach((item) => {
    item.textContent = "";
    item.classList.remove("active");
    item.classList.remove("correct");
    item.classList.remove("wrong");
    item.classList.remove("wrongPlacement");
  });
  //close out message
  exitMessage(3);
  //show beginning message
  startGameMessage.classList.remove("hidden");
  messageBox.classList.remove("hidden");
  //start new game
  return beginNewGame();
}

//run initial set up function

beginNewGame();
