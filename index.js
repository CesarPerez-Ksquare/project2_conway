const rows = 30;                                                //  Sets the amount of rows in the game grid.
const cols = 50;                                                //  Sets the amount of columns in the game grid.

let initiate = false;                                           //  Variable that sets the state of the game after activating the Start button. Start = true, Stop = false.
let timer;                                                      //  Variable to adjust the speed of the game between generations.
let lifespeed = 1000;                                           //  One second.

let currBox = [rows];                                           //  Sets an array for the current box with the rows set.
let nextBox = [rows];                                           //  Sets an array for the next box with the rows set.

function createBoxArrays() {                                    //  Creates two-dimensional arrays for the current and the next box.
    for (let i = 0; i < rows; i++) {                            //  For each row it creates an array of columns.
        currBox[i] = new Array(cols);                           //  Creates two-dimensional array for the current box.
        nextBox[i] = new Array(cols);                           //  Creates two-dimensional array for the next box.
    }
}

function initBoxArrays() {                                      //  Initializes the current and next boxes as unpopulated or 0.
    for (let i = 0; i < rows; i++) {                            //  For each row:
        for (let j = 0; j < cols; j++) {                        //  For each column:
            currBox[i][j] = 0;                                  //  Set 0 to current box space.
            nextBox[i][j] = 0;                                  //  Set 0 to next box space.
        }
    }
}

function createLife() {                                         //  Creates the life of the game with the initial configuration provided by the user.
    let life = document.querySelector('.lifeGrid');             //  Creates a variable for the game grid.
    let tbl = document.createElement('table');                  //  Creates a variable to link the population table to the game grid.
    tbl.setAttribute('id', 'lifegrid');                         //  Sets the id attribute of the population table.

    for (let i = 0; i < rows; i++) {                            //  For each row:
        let tr = document.createElement('tr');                  //  Creates a variable for each row of the table.
        for (let j = 0; j < cols; j++) {                        //  For each column:
            let box = document.createElement('td');             //  Creates a variable for each space of the table.
            box.setAttribute('id', i + '_' + j);                //  Sets the id attribute with the row and column index.
            box.setAttribute('class', 'dead');                  //  Sets the class attribute of the space to dead (0).
            box.addEventListener('click', boxClick);            //  Add a listener to toggle the space to dead (0) or alive (1).
            tr.appendChild(box);                                //  Add the space to the table row array.
        }
        tbl.appendChild(tr);                                    //  Add the table row array to the table. 
    }
    life.appendChild(tbl);                                      //  Add the table to the game grid.
}

function boxClick() {                                           //  User Story 1: Toggle each space to dead (0) or alive (1).
    let loc = this.id.split("_");                               //  Creates a location variable.
    let row = Number(loc[0]);                                   //  Creates a row variable with the row provided by the grid space.
    let col = Number(loc[1]);                                   //  Creates a column variable with the column provided by grid space.
                                                        
    if (this.className === 'alive') {                           //  If the space is alive:
        this.setAttribute('class', 'dead');                     //  Sets class to dead.
        currBox[row][col] = 0;                                  //  Set the current space to dead (0).
    } else {                                                    //  Otherwise: 
        this.setAttribute('class', 'alive');                    //  Sets class to alive.
        currBox[row][col] = 1;                                  //  Set the current space to alive (1).
    }
}

function createNextBox() {                                      //  Creates the next generation box.
    for (row in currBox) {                                      //  For each row in the current box:
        for (col in currBox[row]) {                             //  For each column in the current row of the box:
            let boxes = getBoxesCount(row, col);                //  Creates a varible for the number of current neighbors alive (1).
                                                       
            if (currBox[row][col] === 1) {                      //  If cell is alive (1):
                if (boxes < 2) {                                //  If neighbors are less than 2:
                    nextBox[row][col] = 0;                      //  The cell dies in the next generation by underpopulation. 
                } else if (boxes === 2 || boxes === 3) {        //  Else, if neighbors are equal to 2 or 3:
                    nextBox[row][col] = 1;                      //  The cell lives in the next generation. 
                } else if (boxes > 3) {                         //  Else, if neighbors are more than 3: 
                    nextBox[row][col] = 0;                      //  The cell dies in the next generation by overpopulation.
                }
            } else if (currBox[row][col] === 0) {               //  Else, if it is dead (0):
                if (boxes === 3) {                              //  If neighbors are exactly 3:
                    nextBox[row][col] = 1;                      //  The cell becomes a live cell by reproduction.
                }
            }
        }
    }
}

function getBoxesCount(row, col) {                              //  Counts the current alive (1) neighbors.
    let count = 0;                                              //  Creates a variable to count alive (1) neighbors.
    let nrow = Number(row);                                     //  Creates a variable with the current row number.
    let ncol = Number(col);                                     //  Creates a variable with the current column number.

    if (nrow - 1 >= 0) {                                        //  Check if it is not at the top row of the grid:
        if (currBox[nrow - 1][ncol] === 1)                      //  Check top space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (nrow - 1 >= 0 && ncol - 1 >= 0) {                       //  Check if it is not at the top and at the left column of the grid:
        if (currBox[nrow - 1][ncol - 1] === 1)                  //  Check upper left space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (nrow - 1 >= 0 && ncol + 1 < cols) {                     //  Check if it is not at the top and at the right column of the grid:
        if (currBox[nrow - 1][ncol + 1] === 1)                  //  Check upper right space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (ncol - 1 >= 0) {                                        //  Check if it is not at the left column of the grid:
        if (currBox[nrow][ncol - 1] === 1)                      //  Check left space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (ncol + 1 < cols) {                                      //  Check if it is not at the right column of the grid:
        if (currBox[nrow][ncol + 1] === 1)                      //  Check right space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (nrow + 1 < rows && ncol - 1 >= 0) {                     //  Check if it is not at the bottom row and left column of the grid:
        if (currBox[nrow + 1][ncol - 1] === 1)                  //  Check bottom left space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (nrow + 1 < rows && ncol + 1 < cols) {                   //  Check if it is not at the bottom row and right column of the grid:
        if (currBox[nrow + 1][ncol + 1] === 1)                  //  Check botto right space and if is is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    if (nrow + 1 < rows) {                                      //  Check if it is not at the bottom row of the grid:
        if (currBox[nrow + 1][ncol] === 1)                      //  Check bottom space and if it is alive (1):
            count++;                                            //  Increase the counter variable.
    }
    return count;                                               //  Returns the counter variable.
}

function updateCurrBox() {                                      //  Updates the current table with the population of the next generation.
    for (row in currBox) {                                      //  For each row in the current table:
        for (col in currBox[row]) {                             //  For each column in the current table:
            currBox[row][col] = nextBox[row][col];              //  Update the current row and column.
            nextBox[row][col] = 0;                              //  Clear the next table row and column.
        }
    }
}

function updatelife() {                                         //  Updates the game grid with the next status of each space.
    let box = '';                                               //  Creates a local variable to select the space to update.
    
    for (row in currBox) {                                      //  For each row in current table:
        for (col in currBox[row]) {                             //  For each column in current table:
            box = document.getElementById(row + '_' + col);     //  The local variable will be the concatenated string of the row + _ + the column index.
            if (currBox[row][col] === 0) {                      //  If the current space is dead (0):
                box.setAttribute('class', 'dead');              //  Set the dead class attribute to the space.
            } else {                                            //  Otherwise:
                box.setAttribute('class', 'alive');             //  Set the alive class attribute to the space.
            }
        }
    }
}

function cycle() {                                              //  Run a Game of Life cycle.
    createNextBox();                                            //  Creates the next generation box.
    updateCurrBox();                                            //  Updates the current table with the population of the next generation.
    updatelife();                                               //  Updates the game grid with the next status of each space.
    
    if (initiate) {                                             //  If the game is running: 
        timer = setTimeout(cycle, lifespeed);                   //  The timer variable will execute the game cycle after the time between generations has passed.
    }
}

function startStopGame() {                                      //  User Story 2: Toogle the game status. Start/Stop.
    let startlife = document.querySelector('#btnStartStop');    //  Creates a variable that set the value of the Start/Stop button on the website.
    
    if (initiate) {                                             //  If the game has begun:
        initiate = false;                                       //  Status variable will be set to false.
        startlife.value = 'Start';                              //  Start/Stop button on the webiste will go to Start option.
        clearTimeout(timer);                                    //  Clear the timeout previosly established.
    } else {                                                    //  Otherwise:
        initiate = true;                                        //  Status variable will be set to true.
        startlife.value = 'Stop';                               //  Start/Stop button on the website will go to Stop option.
        cycle();                                                //  Run a Game of Life cycle.
    }
}

function clearLife() {                                          //  User Story 6: Set the game back to the initial state.
    location.reload();                                          //  Reloads the website to the initial state.
}

window.onload = () => {                                         //  When the windows has loaded:
    createLife();                                               //  Creates the life of the game with the initial configuration provided by the user.
    createBoxArrays();                                          //  Creates two-dimensional arrays for the current and the next box.
    initBoxArrays();                                            //  Initializes the current and next boxes as unpopulated or 0.
}