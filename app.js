/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach winningScore points on GLOBAL score wins the game

NOTES:
-The Try storing the score values in var's instead of storing them in the DOM 
*/
const p1TurnPanel = document.querySelector(".player-0-panel");
const p2TurnPanel = document.querySelector(".player-1-panel");

const p1GlobalScore = document.getElementById("score-0");
const p2GlobalScore = document.getElementById("score-1");

const p1CurrentScore = document.getElementById("current-0");
const p2CurrentScore = document.getElementById("current-1");

let p1glbScr = parseInt(p1GlobalScore.textContent);
let p2glbScr = parseInt(p2GlobalScore.textContent);

let p1OldGlobal = "";
let p2OldGlobal = "";

let winner = "";

let numofMatches = 0;
let p1Wins = 0;
let p2Wins = 0;
let bestOf = 1;

let winningScore = 100;

const myRules = () => {
    swal ({
        title: 'RULES:',
        width: "800px",
        html: (`
        <br>1. To win you need your <em><strong>global score</strong></em> >= ${winningScore} (<em><strong>Winning Score</strong></em> default = 100) to win.<br>
        <br>2. If you roll a die with a value of <strong>1</strong>, it will reset your <em><strong>current score</strong></em> to <strong>0</strong>.<br>
        <br>3. To prevent that from happening you need to <em><strong>hold</strong></em>.<br>
        <br>4. <em><strong>Hold</strong></em> keeps and adds you <em><strong>current score</strong></em> in the <em><strong>global score</strong></em>.<br>
        <br>"PRESS HOME KEY TO SEE THIS AGAIN"
        `),
        type: 'info',
        confirmButtonText: 'Cool',
        position: 'center',
        footer: `<strong>"If you want to change the winning score to somethin else and you can also set the game to be best of 1/3/5"</strong>`,
    });
}
myRules();

//Selects the dice and changes their srcs to a different die (Displays die in releation to die num)
//Adds the sum of the dice to the current score of the player whom it's his or her turn
const rollBtn = document.querySelector(".btn-roll");
const changeDiceToRandNum = () => {
    const randNum = () => {return Math.floor((Math.random() * 6) + 1)};
    const firstDieSelector = document.querySelector("#firstDie");
    const secondDieSelector = document.querySelector("#secondDie");

//Stores the RandNums in a vars
    let firstRandDieNum = randNum();
    let secondRandDieNum = randNum();
    let sumOfRandNums = firstRandDieNum + secondRandDieNum;

//Changes the dice img
    firstDieSelector.setAttribute("src", `dice-${firstRandDieNum}.png`);
    secondDieSelector.setAttribute("src", `dice-${secondRandDieNum}.png`);


    
//Changes turns when the roll btn is clicked
//Adds the sum of the dice to the current score
    if (p1TurnPanel.classList.contains("active")) {
        setTimeout(() => {
            if (firstRandDieNum === 1 || secondRandDieNum === 1) {//if one die = 1 it resets current score
                swal({
                    title: (`Player 1 Rolled a One!`),
                    html: (`Player 1's <em><strong>current score</strong></em> resets.`),
                });
                console.log("p1's current score resets");
                p1CurrentScore.textContent = "0";
                p1TurnPanel.classList.toggle("active");
                p2TurnPanel.classList.toggle("active");
            } else {
                p1CurrentScore.textContent = parseInt(p1CurrentScore.textContent) + sumOfRandNums;
                console.log(`p1's Dice Sum = ${sumOfRandNums},`, "Player2's turn");
                checkScores(firstRandDieNum, secondRandDieNum)
                p1TurnPanel.classList.toggle("active");
                p2TurnPanel.classList.toggle("active");
            }
        }, 50);
    } else if (p2TurnPanel.classList.contains("active")) {
        setTimeout(() => {
            if (firstRandDieNum === 1 || secondRandDieNum === 1) {//if one die = 1 it resets current score
                swal({
                    title: (`Player 2 Rolled a One!`),
                    html: (`Player 2's <em><strong>current score</strong></em> resets.`),
                });
                console.log("p2's current score resets");
                p2CurrentScore.textContent = "0";
                p1TurnPanel.classList.toggle("active");
                p2TurnPanel.classList.toggle("active");
            } else {
                p2CurrentScore.textContent = parseInt(p2CurrentScore.textContent) + sumOfRandNums;
                console.log(`p2's Dice Sum = ${sumOfRandNums},`, "Player1's turn");
                checkScores(firstRandDieNum, secondRandDieNum)
                p1TurnPanel.classList.toggle("active");
                p2TurnPanel.classList.toggle("active");
            }
        }, 50);
    } else {
        p1TurnPanel.classList.toggle("active");
        console.log("Default to p1's turn");
        console.log(`Player 1 press "Roll Dice" to start the game or "Hold to skip your turn"`);
    }
}
rollBtn.addEventListener("click", changeDiceToRandNum);


//Resets all scores back to zero and resets the turn to p1
//Keeps track of the number of matches
const newGameBtn = document.querySelector(".btn-new");
const resetNewGame = () => {
    p1TurnPanel.classList.add("active");
    p2TurnPanel.classList.remove("active");
    p1glbScr = 0;
    p2glbScr = 0;
    p1GlobalScore.textContent = "0";
    p2GlobalScore.textContent = "0";
    p1CurrentScore.textContent = "0";
    p2CurrentScore.textContent = "0";
    rollBtn.style.display = "inline-block";
    holdBtn.style.display = "inline-block";
    setScoreBtn.style.display = "inline-block";
    setBestOfBtn.style.display = "inline-block";
}
newGameBtn.addEventListener("click", resetNewGame);


//Stores the current score into the global score and toggles turns
//Resets current score to 0
const holdBtn = document.querySelector(".btn-hold");
const storeCurrentScore = () => {
    if (p1TurnPanel.classList.contains("active")) {
        p1OldGlobal = p1GlobalScore.textContent;
        p1glbScr += parseInt(p1CurrentScore.textContent);
        p1GlobalScore.textContent = p1glbScr//Assigns current score to global score (Allows it to show on page)
        checkScores(p1OldGlobal, p2OldGlobal);
        if (p1CurrentScore.textContent !== "0") {
            console.log("p1's current score transfered to global.");
        } else if (p1GlobalScore.textContent < winningScore) {
            console.log("p1 passed his/her turn.");
        }
        p1CurrentScore.textContent = "0";
        p1TurnPanel.classList.toggle("active");
        p2TurnPanel.classList.toggle("active");
    } else if (p2TurnPanel.classList.contains("active")) {
        p2OldGlobal = p2GlobalScore.textContent;
        p2glbScr += parseInt(p2CurrentScore.textContent);
        p2GlobalScore.textContent = p2glbScr//Assigns current score to global score (Allows it to show on page)
        checkScores(p1OldGlobal, p2OldGlobal);
        if (p2CurrentScore.textContent !== "0") {
            console.log("p2's current score transfered to global.");
        } else if (p2GlobalScore.textContent < winningScore) {
            console.log("p2 passed his/her turn.");
        }
        p2CurrentScore.textContent = "0";
        p1TurnPanel.classList.toggle("active");
        p2TurnPanel.classList.toggle("active");
    } else {
        p1TurnPanel.classList.toggle("active");
        console.log("Default to p1's turn");
        console.log(`Player 1 press "Roll Dice" to start the game or "Hold to skip your turn"`);
    }
}
holdBtn.addEventListener("click", storeCurrentScore);

/*
POPUP NEEDS TO BE DONE WITH SWEET ALERTS NOW
*/
//Checks both score's sums if the sum is <= winningScore then it alert's user
//Adds both scores into the global score box to diplay the total score
//Pop-up window for the winner and alert for info of match only after pop-up window
const checkScores = (p1, p2) => {
    if (p1glbScr >= winningScore) {
        p1GlobalScore.textContent = p1glbScr;//Assigns current score to global score (Allows it to show on page)
        let p1crtscr = p1CurrentScore.textContent;
        winner = "Player 1";
        numofMatches += 1;
        p1Wins += 1;
        swal({
            title: `Match ${p1Wins} WINNER!!!`,
            html: (`
            --------------------------<strong>"${winner} Wins!"</strong>--------------------------<br>
                <br>You can reset the game with the <strong>"New Game"</strong> Button.<br>

                <br>BestOf = <strong>${bestOf}.</strong><br>
                <br>Total Number of rounds ${winner} has won = <strong>${p1Wins}.</strong><br>
                <br>Total Number of rounds played = <strong>${numofMatches}.</strong><br>

                <br>${winner}'s Old Global Score = <strong>${p1}.</strong><br>
                <br>${winner}'s CurrentScore = <strong>${p1crtscr}.</strong><br>
                <br>${winner}'s GlobalScore = <strong>${p1GlobalScore.textContent}.</strong><br>
            <br>--------------------------<strong>"${winner} Wins!"</strong>--------------------------<br>
            `),
            type: 'success',
            confirmButtonText: 'Cool',
            position: 'center',            
        });
        p1glbScr = 0;
        p1CurrentScore.textContent = "0";
        console.log("Total Number of Matches = ", numofMatches);
        console.log("p1 wins = ", p1Wins);
        rollBtn.style.display = "none";
        holdBtn.style.display = "none";
        setScoreBtn.style.display = "none";
        setBestOfBtn.style.display = "none";
        //Checks Best Of 
        //CAN Reset resets bestOf to 1
        //CAN Reset Number of matches
        //CAN Reset total p1Wins and total p2Wins
        if (bestOf === 1 && p1Wins === bestOf) {
            alert(`
            Player 1 Won the best of 1!
            BestOf is still set to ${bestOf}.
            and Winning Score is still set to ${winningScore}.
            `);
            //bestOf = 1;
            // numofMatches = 0;
            // p1Wins = 0;
            // p2Wins = 0;
        } else if (bestOf === 3 && p1Wins === (bestOf - 1)) {
            alert(`
            Player 1 Won the best of 3!
            BestOf is still set to ${bestOf}.
            and Winning Score is still set to ${winningScore}.
            `);
            //bestOf = 1;
            // numofMatches = 0;
            // p1Wins = 0;
            // p2Wins = 0;
        } else if (bestOf === 5 && p1Wins === (bestOf - 2)) {
            alert(`
            Player 1 Won the best of 5!
            BestOf is still set to ${bestOf}.
            and Winning Score is still set to ${winningScore}.
            `);
            //bestOf = 1;
            // numofMatches = 0;
            // p1Wins = 0;
            // p2Wins = 0;
        }
    } else if (p2glbScr >= winningScore) {
        p2GlobalScore.textContent = p2glbScr;//Assigns current score to global score (Allows it to show on page)
        let p2crtscr = p2CurrentScore.textContent;
        winner = "Player 2";
        numofMatches += 1;
        p2Wins += 1;
        swal({
            title: `Match ${p2Wins} WINNER!!!`,
            html: (`
            --------------------------<strong>"${winner} Wins!"</strong>--------------------------<br>
                <br>You can reset the game with the <strong>"New Game"</strong> Button.<br>

                <br>Best Of = <strong>${bestOf}.</strong><br>
                <br>Total Number of rounds ${winner} has won = <strong>${p2Wins}.</strong><br>
                <br>Total Number of rounds played = <strong>${numofMatches}.</strong><br>

                <br>${winner}'s Old Global Score = <strong>${p2}.</strong><br>
                <br>${winner}'s CurrentScore = <strong>${p2crtscr}.</strong><br>
                <br>${winner}'s GlobalScore = <strong>${p2GlobalScore.textContent}.</strong><br>
            <br>--------------------------<strong>"${winner} Wins!"</strong>--------------------------<br>
            `),
            type: 'success',
            confirmButtonText: 'Cool',
            position: 'center',
        });
        p2glbScr = 0;
        p2CurrentScore.textContent = "0";
        console.log("Total Number of Matches = ", numofMatches);
        console.log("p2 wins = ", p2Wins);
        rollBtn.style.display = "none";
        holdBtn.style.display = "none";
        setScoreBtn.style.display = "none";
        setBestOfBtn.style.display = "none";
        //Checks Best Of 
        //CAN Reset resets bestOf to 1
        //CAN Reset Number of matches
        //CAN Reset total p1Wins and total p2Wins
        if (bestOf === 1 && p2Wins === bestOf) {
            alert(`
            Player 2 Won the best of 1!
            BestOf is still set to ${bestOf}.
            and Winning Score is still set to ${winningScore}.
            `);
            //bestOf = 1;
            // numofMatches = 0;
            // p1Wins = 0;
            // p2Wins = 0;
        } else if (bestOf === 3 && p2Wins === (bestOf - 1)) {
            alert(`
            Player 2 Won the best of 3!
            BestOf is still set to ${bestOf}.
            and Winning Score is still set to ${winningScore}.
            `);
            //bestOf = 1;
            // numofMatches = 0;
            // p1Wins = 0;
            // p2Wins = 0;
        } else if (bestOf === 5 && p2Wins === (bestOf - 2)) {
            alert(`
            Player 2 Won the best of 5!
            BestOf is still set to ${bestOf}.
            and Winning Score is still set to ${winningScore}.
            `);
            //bestOf = 1;
            // numofMatches = 0;
            // p1Wins = 0;
            // p2Wins = 0;
        }
    }
}

//Best of Input Field
const setBestOfBtn = document.querySelector(".btn-bestof-settings");
const gameBestOf = () => {
    swal({
        title: 'Play a Best of? (default = 1)',
        html: (`
        <br>You must choose one of these numbers:<br>
        <br>Best of <strong>1.</strong><br>
        <br>Best of <strong>3.</strong><br>
        <br>Best of <strong>5.</strong><br>
        `),
        type: 'question',
        input: 'text',
        inputAttributes: {

        },
        inputValue: 1,
    });
}

//Sets the bestOf var to the user's best of input ONLY if the input is 1 or 3 or 5.
const userSetBestOf = () => {
    bestOfNumUserInput = parseInt(swal.getInput().value)
    if (bestOfNumUserInput === 1) {
        console.log('Best of',bestOfNumUserInput, 'match(es)');
        bestOf = bestOfNumUserInput;
    } else if (bestOfNumUserInput === 3) {
        console.log('Best of',bestOfNumUserInput, 'match(es)');
        bestOf = bestOfNumUserInput;
    } else if (bestOfNumUserInput === 5) {
        console.log('Best of',bestOfNumUserInput, 'match(es)');
        bestOf = bestOfNumUserInput;
    } else {
        swal({
            type: 'error',
            html: (`
            Please Only Input <strong>1</strong> or <strong>3</strong> or <strong>5</strong>.<br>
            <br><em><strong>BestOf</strong></em> is still = <strong>${bestOf}</strong>
            `),
        });
    }
}
setBestOfBtn.addEventListener("click", gameBestOf);
setBestOfBtn.addEventListener("blur", userSetBestOf);

//User can set total number of matches/winningScore
const setScoreBtn = document.querySelector(".btn-score-settings");
const gameScoreSettings = () => {
    swal({
        title: 'What is your desired winning score value?',
        type: 'question',
        input: 'range',
        inputAttributes: {
            min: 50,
            max: 500,
            step: 25,
        },
        inputValue: 100,
    });
}

//Outputs the user inputted value for the winning score
const userSetScore = () => {
    if (parseInt(swal.getInput().value) !== 100) {
    console.log('winning SCORE =',swal.getInput().value);
    winningScore = swal.getInput().value;
    }
}
setScoreBtn.addEventListener("click", gameScoreSettings);
setScoreBtn.addEventListener("blur", userSetScore);


document.addEventListener("keydown", (e) => {
    if (e.key === "Home") {
        myRules();
    }
});