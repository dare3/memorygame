document.addEventListener("DOMContentLoaded", function(){
    const gameContainer = document.getElementById("game");
    const startButton = document.getElementById("startButton");
    const restartButton = document.getElementById("restartButton");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
  
    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", restartGame);
  
    let firstCard = null;
    let secondCard = null;
    let cardsFlipped = 0;
    let noClicking = false;
    let score = 0;
    let lowestScore = localStorage.getItem('lowestScore') || Infinity;
    let timerInterval;
  
    function shuffle(array) {
      let counter = array.length;
      while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    }
  
    function createDivsForColors(colorArray) {
      for (let color of colorArray) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("card");
        newDiv.dataset.color = color;
        newDiv.addEventListener("click", handleCardClick);
        gameContainer.append(newDiv);
      }
    }
  
    function startGame() {
      startButton.style.display = "none";
      restartButton.style.display = "block";
      score = 0;
      scoreDisplay.textContent = score;
      cardsFlipped = 0;
      noClicking = false;
      firstCard = null;
      secondCard = null;
      let numColors = Math.floor(12 / 2); // Adjust the number of cards here
      let selectedColors = shuffle(generateColors(numColors));
      let cards = selectedColors.concat(selectedColors);
      createDivsForColors(shuffle(cards));
      startTimer();
    }
  
    function restartGame() {
      clearInterval(timerInterval);
      timerDisplay.textContent = "0";
      gameContainer.innerHTML = "";
      startGame();
    }
  
    function handleCardClick(event) {
      if (noClicking) return;
      let currentCard = event.target;
      currentCard.style.backgroundColor = currentCard.dataset.color;
  
      if (!firstCard || !secondCard) {
        currentCard.classList.add("flipped");
        firstCard = firstCard || currentCard;
        secondCard = currentCard === firstCard ? null : currentCard;
        score++;
        scoreDisplay.textContent = score;
      }
  
      if (firstCard && secondCard) {
        noClicking = true;
        let color1 = firstCard.dataset.color;
        let color2 = secondCard.dataset.color;
  
        if (color1 === color2) {
          cardsFlipped += 2;
          firstCard.removeEventListener("click", handleCardClick);
          secondCard.removeEventListener("click", handleCardClick);
          firstCard = null;
          secondCard = null;
          noClicking = false;
          if (cardsFlipped === 12) {
            endGame();
          }
        } else {
          setTimeout(function() {
            firstCard.style.backgroundColor = "";
            secondCard.style.backgroundColor = "";
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            secondCard = null;
            noClicking = false;
          }, 1000);
        }
      }
    }
  
    function endGame() {
      clearInterval(timerInterval);
      alert("Congratulations! You've completed the game with a score of " + score + " in " + timerDisplay.textContent + " seconds.");
      if (score < lowestScore) {
        lowestScore = score;
        localStorage.setItem('lowestScore', lowestScore);
      }
      restartGame();
    }
  
    function generateColors(numColors) {
      let colors = [];
      for (let i = 0; i < numColors; i++) {
        let color = "#" + Math.floor(Math.random()*16777215).toString(16); // Generate random hex color
        colors.push(color);
      }
      return colors;
    }
  
    function startTimer() {
      let seconds = 0;
      timerInterval = setInterval(function() {
        seconds++;
        timerDisplay.textContent = seconds;
      }, 1000);
    }
  });