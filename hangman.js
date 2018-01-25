let inquirer = require("inquirer");
let fs = require("fs");

let arrayofWords = ["SAILOR", "MOON", "CALDO", "PIKACHU", "GOKU",
    "SELENA", "CHINGADA", "OBSCURA", "VALLEY", "SPIRIT",
    "MARZIPAN", "FREEZER", "TARJETA", "JUEGOS"];

let Letter = function (peanut) {
    this.character = peanut;
    this.show = false;
    this.letterRender = function () {
       return !(this.show) ? "   _   " : this.character;
    };
};

let Word = function (newWord) {
    this.word = newWord;
    this.letterObjs = []; 
    this.found = false;

    this.getLetters = function () {
        for (let i = 0; i < this.word.length; i++) {
            this.letterObjs.push(new Letter(this.word[i]));
        }
    };

    this.foundTheWord = function () {
      this.found = this.letterObjs.every(function (letterObj) {
            return letterObj.show;
        });

        return this.found;
    }
    /**
     * returns whether the guessed letter was found or not
     */
    this.checkLetters = function (guessedLetter) {
        let outcome = 0;
        this.letterObjs.map(function (letterObj) {
            if (letterObj.character == guessedLetter) {
                letterObj.show = true;
                outcome++;
            }
        });
        return outcome;
    }
    /**
     * return the rendered view
     */
    this.renderOutcome = function () {
        let outcome = "";
        this.letterObjs.map(function (letterObj) {
            outcome += letterObj.letterRender();
        });
        return outcome;
    }
}

function hangmanGame(answers) {
    console.log("hangman game start");

};


let startGame = function (results) {
    let guessesRemaining = 10;

    console.log("\n\nWelcome to Hangman! Words are either in English and Spanish. \n\n");
    let wordList = arrayofWords;
    let lettersGuessed = [];
    let currentWord = null;

    let initGame = function () {
        if (guessesRemaining === 10) {
            console.log("\n\nGuess the letters in the blanks below!\n\n");
            let randomNumber = Math.floor(Math.random() * wordList.length);
            currentWord = new Word(wordList[randomNumber]);
            currentWord.getLetters();
            console.log(currentWord.renderOutcome() + "\n\n");
            promptUser();
        } else {
            guessesRemaining = 10;
            initGame();

        }
    };


    let promptUser = function () {
        inquirer.prompt([{
            name: "value",
            type: "input",
            message: "Choose a letter:"
        }]).then(function (letter) {
            let letterReturned = (letter.value).toUpperCase();
            let guessedAlready = false;
            for (let i = 0; i < lettersGuessed.length; i++) {
                if (letterReturned === lettersGuessed[i]) {
                    guessedAlready = true;
                }
            }
            if (guessedAlready === false) {
                lettersGuessed.push(letterReturned);

                let found = currentWord.checkLetters(letterReturned);

                if (found === 0) {
                    guessesRemaining--;
                    console.log('Incorrect!' + ' Guesses remaining: ' + guessesRemaining);
                    console.log('\n\n~~~~~~~~~~~~~~~~~~~~\n\n');
                    console.log(currentWord.renderOutcome());
                    console.log('\n\n~~~~~~~~~~~~~~~~~~~~');
                    console.log("Letters guessed: " + lettersGuessed);

                } else {
                    console.log("Correct!\n\n");
                    if (currentWord.foundTheWord() === true) {
                        console.log(currentWord.renderOutcome());
                        console.log("You've guessed the word. Congrats!");
                    } else {
                        console.log('Guesses remaining: ' + guessesRemaining + '\n\n');
                        console.log(currentWord.renderOutcome());
                        console.log('\n\n~~~~~~~~~~~~~~~~~~~~\n\n');
                        console.log("Letters guessed: " + lettersGuessed);
                    }
                }
                if (guessesRemaining > 0 && currentWord.found === false) {
                    promptUser();
                } else if (guessesRemaining === 0) {
                    console.log('Game over!\n');
                    console.log('The correct word is ' + currentWord.word + "\n");
                }
            } else {
                console.log("That letter was used already.\n ")
                promptUser();
            }
        });
    };

            inquirer.prompt([
                {
                    name: "letter",
                    message: "Press Enter to start the hangman game!!!!!"
                }
            ]).then(function (answers) {
                initGame();

            });

        };

startGame();


