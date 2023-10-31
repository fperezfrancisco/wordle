/** set up game */
//search for a new word

let randomWord = {
  url: "https://random-word-api.p.rapidapi.com/L/",
  options: {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3802ae3cccmsh5d62e521d884914p1d4cafjsn253bdc5e8ed6",
      "X-RapidAPI-Host": "random-word-api.p.rapidapi.com",
    },
  },
  fetchWord: function (length) {
    /*
    try {
      const response = (await fetch(this.url + `${length}`, this.options)).json();
      const result = await response.text();
      console.log(result);
      //console.log(response.word);
    } catch (error) {
      console.error(error);
    }*/
    fetch(this.url + `${length}`, this.options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Data: ", data);
        return this.setGameWord(data.word);
      });
  },
  setGameWord: function (word) {
    gameWord = word;
    console.log(gameWord);
  },
};

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

/**  set up stats */
let playerStats = getLocalStorage("playerStats");

if (!playerStats) {
  //set up player stats
  resetStats();
}

console.log(playerStats);

const numGamesPlayed = document.getElementById("numGamesPlayed");
const numGamesWon = document.getElementById("numGamesWon");
const percentWonNumber = document.getElementById("percentWonNumber");
const currStreakNumber = document.getElementById("currStreakNumber");
const largestStreakNumber = document.getElementById("largestStreakNumber");

function setUpStats() {
  numGamesPlayed.textContent = playerStats.gamesPlayed;
  numGamesWon.textContent = playerStats.gamesWon;
  percentWonNumber.textContent = playerStats.percentWon;
  currStreakNumber.textContent = playerStats.currentStreak;
  largestStreakNumber.textContent = playerStats.longestStreak;
}

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  //handle reset
  exitMessage(4);
  let clientAnswer = confirm(
    "Are you sure you want to reset your stats? (cannot be undone.)"
  );
  if (clientAnswer) {
    resetStats();
    setUpStats();
  }
});

/**  set up stats */

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

const deleteMobileBtn = document.getElementById("deleteMobile");
deleteMobileBtn.addEventListener("click", deleteLetter);

document.getElementById("exitStart").addEventListener("click", exitBox);
document.getElementById("exitGuess").addEventListener("click", exitBox);
document.getElementById("exitGameOver").addEventListener("click", exitBox);
document.getElementById("exitStats").addEventListener("click", exitBox);

const p = document.getElementById("lossMessage");

const giveUpBtn = document.getElementById("giveUpBtn");
giveUpBtn.addEventListener("click", gameOver);

const statsBtn = document.getElementById("statsBtn");
const statsBox = document.getElementById("statsBox");
statsBtn.addEventListener("click", () => {
  statsBox.classList.remove("hidden");
  messageBox.classList.remove("hidden");
});

/*** FUNCTION TO BEGIN A NEW GAME */

function beginNewGame() {
  //set all global variables
  document.querySelectorAll(".btnKey").forEach((item) => {
    item.addEventListener("click", keyClick);
    item.classList.remove("used");
  });

  window.addEventListener("keydown", keyDown);

  setUpStats();

  p.textContent = "";

  currentRow = wordGrid.querySelector("#row1");
  currentCell = currentRow.querySelector(".letter1");
  prevCell = null;
  nextCell = currentRow.querySelector(".letter2");
  cellIndex = 1;
  rowIndex = 1;
  //select primary guessing word
  //gameWord = wordList[Math.floor(Math.random() * wordList.length)];
  randomWord.fetchWord(5);
  //gameWord = randomWord.fetchWord(5);
  //const gameWord = wordList[Math.floor(Math.random() * wordList.length)];
  console.log(gameWord);

  gameWon = false;
  setTimeout(function () {
    exitMessage(1);
  }, 3000);
}

function exitBox(event) {
  const currMessage = event.currentTarget.parentNode;
  if (currMessage.id === "startGame") {
    return exitMessage(1);
  } else if (currMessage.id === "wordNotFinished") {
    return exitMessage(2);
  } else if (currMessage.id === "gameOver") {
    return exitMessage(3);
  } else if (currMessage.id === "statsBox") {
    return exitMessage(4);
  }
}

function exitMessage(index) {
  if (index === 1) {
    startGameMessage.classList.add("hidden");
  } else if (index === 2) {
    incompleteGuess.classList.add("hidden");
  } else if (index === 3) {
    gameOverMessage.classList.add("hidden");
  } else {
    statsBox.classList.add("hidden");
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

function keyDown(event) {
  const key = event.key;
  console.log(key);
  if (key === "Enter") {
    rowCheck(gameWord);
  } else if (key === "Delete" || key === "Backspace") {
    return deleteLetter();
  } else if (key === "" || key === null || key.length > 1) {
    /**do nothing */
  } else {
    return addLetter(key);
  }
}

function rowCheck(currWord) {
  if (currWord.length !== 5) {
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
    playerStats.currentStreak = 0;
    //adjust stats
    gameResultMessage.textContent = "You Lost!";
    p.textContent = "The word was: " + gameWord;
    //gameOverMessage.appendChild(p);
  } else {
    //adjust stats
    playerStats.currentStreak += 1;
    playerStats.gamesWon += 1;
    if (playerStats.currentStreak > playerStats.longestStreak) {
      playerStats.longestStreak = playerStats.currentStreak;
    }
    //adjust stats
    gameResultMessage.textContent = "You Won!";
  }
  //adjust stats
  playerStats.gamesPlayed += 1;
  playerStats.percentWon = (
    playerStats.gamesWon / playerStats.gamesPlayed
  ).toFixed(2);

  console.log(playerStats);
  setLocalStorage(playerStats, "playerStats");

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
  playerStats = getLocalStorage("playerStats");
  //close out message
  exitMessage(3);
  //show beginning message
  startGameMessage.classList.remove("hidden");
  messageBox.classList.remove("hidden");
  //start new game
  return beginNewGame();
}

//save to local storage
function setLocalStorage(obj, key) {
  // Serialize the object using JSON.stringify()
  const serializedObj = JSON.stringify(obj);
  // Store the serialized object in localStorage
  localStorage.setItem(key, serializedObj);
}

//retrieve from local storage

function getLocalStorage(key) {
  // Retrieve the serialized object from localStorage
  const serializedObj = localStorage.getItem(key);
  // Deserialize the object using JSON.parse()
  const obj = JSON.parse(serializedObj);
  return obj;
}

function resetStats() {
  //set up player stats
  playerStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    percentWon: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
  setLocalStorage(playerStats, "playerStats");
}

//run initial set up function

beginNewGame();
