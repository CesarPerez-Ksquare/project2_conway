const rows = 30;
const cols = 50;

let initiate = false;// change parameter when clicks start
let timer;//To control lives
let lifespeed = 1000;// One second 

let currBox = [rows];
let nextBox = [rows];
// Creates two-dimensional arrays
function createBoxArrays() {
    for (let i = 0; i < rows; i++) {
        currBox[i] = new Array(cols);
        nextBox[i] = new Array(cols);

    }
}
function initBoxArrays() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            currBox[i][j] = 0;
            nextBox[i][j] = 0;
        }
    }
}
function createLife() {
    let life = document.querySelector('#life');

    let tbl = document.createElement('table');
    tbl.setAttribute('id', 'lifegrid');
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let box = document.createElement('td');
            box.setAttribute('id', i + '_' + j);
            box.setAttribute('class', 'dead');
            box.addEventListener('click', boxClick);
            tr.appendChild(box);
        }
        tbl.appendChild(tr);
    }
    life.appendChild(tbl);
}
function boxClick() {
    let loc = this.id.split("_");
    let row = Number(loc[0]);
    let col = Number(loc[1]);
    // Toggle box alive or dead
    if (this.className === 'alive') {
        this.setAttribute('class', 'dead');
        currBox[row][col] = 0;
    } else {
        this.setAttribute('class', 'alive');
        currBox[row][col] = 1;
    }
}
function createnextBox() {
    for (row in currBox) {
        for (col in currBox[row]) {

            let boxes = getBoxesCount(row, col);

            // If Alive
            if (currBox[row][col] == 1) {

                if (boxes < 2) {
                    nextBox[row][col] = 0;
                } else if (boxes == 2 || boxes == 3) {
                    nextBox[row][col] = 1;
                } else if (boxes > 3) {
                    nextBox[row][col] = 0;
                }
            } else if (currBox[row][col] == 0) {
                // If Dead 

                if (boxes == 3) {
                    nextBox[row][col] = 1;
                }
            }
        }
    }

}
function getBoxesCount(row, col) {
    let count = 0;
    let nrow = Number(row);
    let ncol = Number(col);

    if (nrow - 1 >= 0) {
        // Check top box
        if (currBox[nrow - 1][ncol] == 1)
            count++;
    }
    // Upper left corner
    if (nrow - 1 >= 0 && ncol - 1 >= 0) {
        //Check upper left box
        if (currBox[nrow - 1][ncol - 1] == 1)
            count++;
    }
    // Upper right corner
    if (nrow - 1 >= 0 && ncol + 1 < cols) {
        //Check upper right box
        if (currBox[nrow - 1][ncol + 1] == 1)
            count++;
    }
    if (ncol - 1 >= 0) {
        //Check left box
        if (currBox[nrow][ncol - 1] == 1)
            count++;
    }
    if (ncol + 1 < cols) {
        //Check right box
        if (currBox[nrow][ncol + 1] == 1)
            count++;
    }
    if (nrow + 1 < rows && ncol - 1 >= 0) {
        //Check bottom left box
        if (currBox[nrow + 1][ncol - 1] == 1)
            count++;
    }
    if (nrow + 1 < rows && ncol + 1 < cols) {
        //Check bottom right box
        if (currBox[nrow + 1][ncol + 1] == 1)
            count++;
    }
    if (nrow + 1 < rows) {
        //Check bottom box
        if (currBox[nrow + 1][ncol] == 1)
            count++;
    }


    return count;
}

function updatecurrBox() {

    for (row in currBox) {
        for (col in currBox[row]) {
            // Update the current 
            currBox[row][col] = nextBox[row][col];
            // Set nextBox back to empty
            nextBox[row][col] = 0;
        }
    }

}
function updatelife() {
    let box = '';
    for (row in currBox) {
        for (col in currBox[row]) {
            box = document.getElementById(row + '_' + col);
            if (currBox[row][col] == 0) {
                box.setAttribute('class', 'dead');
            } else {
                box.setAttribute('class', 'alive');
            }
        }
    }
}
function cycle() {

    createnextBox();
    updatecurrBox();
    updatelife();
    if (initiate) {
        timer = setTimeout(cycle, lifespeed);
    }
}
function startStopGame() {
    let startlife = document.querySelector('#btnstartstop');
    //created a conditional that will check if the game has begun and will pause it or otherwise resume it.
    if (initiate) {
        initiate = false;
        startlife.value = 'Start';
        clearTimeout(timer);
    } else {
        initiate = true;
        startlife.value = 'Stop';
        cycle();
    }
}
function clearLife() {
    location.reload();
}



window.onload = () => {
    createLife();// table
    createBoxArrays();// current and next boxes
    initBoxArrays();//Set all array locations to 0
}