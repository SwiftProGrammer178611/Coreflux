
let candies = ["CryoCoolant", "Plasma", "RepairNanites", "PowerCell", "ChassisScrap"];
let board = [];
let rows = 9;
let columns = 9;
let score = 0;

let selectedTile = null;

let powerCell = 0;
let cryoCoolant = 0;
let repairNanites = 0;
let chassisScrap = 0;

let activeIntervalId = null;






export function initGame() {
    const canvas = document.getElementById("game");
const myCanvasPainbrush = canvas.getContext("2d");


canvas.width = 800;
canvas.height = 600;
myCanvasPainbrush.fillStyle = "red";
myCanvasPainbrush.fillRect(100,100,100,100);
    
    console.log("initGame() called. Previous interval id:", activeIntervalId);
    if (activeIntervalId !== null) {
        window.clearInterval(activeIntervalId);
        activeIntervalId = null;
    }
    
    board = [];
    score = 0;
    powerCell = 0;
    cryoCoolant = 0;
    repairNanites = 0;
    chassisScrap = 0;
    selectedTile = null;

    startGame();
    startEnemyIdle();

    activeIntervalId = window.setInterval(function () {
        try {
            crushCandy();
            slideCandy();
            genCandy();
        } catch (err) {
            console.log("!!! TICK ERROR:", err);
        }
    }, 100);

    console.log("Interval started with id:", activeIntervalId);

    document.getElementById("score").innerText = score;
    document.getElementById("powerCell").innerText = powerCell;
    document.getElementById("CryoCoolant").innerText = cryoCoolant;
    document.getElementById("RepairNanites").innerText = repairNanites;
    document.getElementById("ChassisScrap").innerText = chassisScrap;

    return () => {
        window.clearInterval(activeIntervalId);
        window.clearInterval(enemyIdInterval);
        activeIntervalId = null;
    };
}

let mech1State = "idle"

export function shootWhen() {
    if(powerCell>0){
        let mech1Frame = 0;
    
        const fwid = 1010/6;
        let id = 0;
        id = setInterval(() => {
        const mech = document.getElementById("mech1Sprite");
        if (!mech) return;
        //mech1Frame = (mech1Frame + 1) % 6;
        
        //the const id trick here is neat, the browser creates INTERVAL 1 created and then returns it, so here when we do const id= the set interval its rly const id=1 and then we clear Interval to clera that 1 and restart!

        mech1State = "shooting";
        console.log(mech1State)
        mech.style.transform = `translateX(-${mech1Frame * fwid}px)`;

        mech1Frame++;

        //we hv to use clearInterval to stop after 6 frames
        if(mech1Frame >= 6){
            clearInterval(id);
        }
    }, 150)
    powerCell=powerCell - 5;
    console.log(powerCell);
    document.getElementById("powerCell").innerHTML = powerCell;
    }

    return true;

}


// export function enemyShoot(){
//     if(powerCell>0){
//         let e1Frame = 3;
    
//         const fwid = 1064/4;
//         let id = 0;
//         setInterval(() => {
//         const mech = document.getElementById("enemySprite");
//         if (!mech) return;
//         //mech1Frame = (mech1Frame + 1) % 6;
        
//         //the const id trick here is neat, the browser creates INTERVAL 1 created and then returns it, so here when we do const id= the set interval its rly const id=1 and then we clear Interval to clera that 1 and restart!

//         mech1State = "shooting";
//         console.log(e1Frame)
//         mech.style.transform = `translateX(-${e1Frame * fwid}px)`;

//         e1Frame--;

//         //we hv to use clearInterval to stop after 6 frames
//         // if(e1Frame < 0){
//         //     clearInterval(id);
//         // }
//     }, 150)
//     powerCell=powerCell - 5;
//     console.log(powerCell);
//     document.getElementById("powerCell").innerHTML = powerCell;
//     }

//     return true;
// }

document.addEventListener("keyup")

let enemFrame=0;
  let enemyIdInterval=null;
  const enemyFrameTot = 4;
  const enemyFrameWidth = 1064/enemyFrameTot;

  function startEnemyIdle(){
    if(enemyIdInterval !== null){
        window.clearInterval(enemyIdInterval);
    }

    enemyIdInterval = window.setInterval(() => {
        const enemy = document.getElementById("enemySprite");
        if(!enemy) return;
        enemy.style.transform = `translateX(-${enemFrame * enemyFrameWidth}px)`;
        enemFrame = (enemFrame+1) % enemyFrameTot;
    }, 150)
  }

let enemyHealth = 100;
function enemyDownWhen(){
    if(powerCell > 5 && shootWhen()){
        enemyHealth -= 10;
        const id2 = 0;
        id2 = setInterval(() => {

        }, 150)
    }
}


function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    document.getElementById("board").innerHTML = "";
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";
            tile.onerror = () => console.log("Missing candy image:", tile.src);
            tile.addEventListener("click", tileClick);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(
        "startGame() done. Tiles in #board DOM:",
        document.getElementById("board").children.length,
        "| board array size:", board.length, "x", board[0]?.length
    );
}
function tileClick() {
    if (this.src.includes("blank")) {
        return;
    }

    if (!selectedTile) {
        selectedTile = this;
        selectedTile.classList.add("selected");
        return;
    }

    if (selectedTile === this) {
        selectedTile.classList.remove("selected");
        selectedTile = null;
        return;
    }

    let [r, c] = selectedTile.id.split("-").map(Number);
    let [r2, c2] = this.id.split("-").map(Number);

    let isAdjacent = (r === r2 && Math.abs(c - c2) === 1) || (c === c2 && Math.abs(r - r2) === 1);

    if (!isAdjacent) {

        selectedTile.classList.remove("selected");
        selectedTile = this;
        selectedTile.classList.add("selected");
        return;
    }

    let currImage = selectedTile.src;
    let otherImage = this.src;

    selectedTile.src = otherImage;
    this.src = currImage;

    let validMove = checkValid(r, c, r2, c2);
    if (!validMove) {
        selectedTile.src = currImage;
        this.src = otherImage;
    }

    selectedTile.classList.remove("selected");
    selectedTile = null;
}

function crushCandy() {
    crushThree();
}

function getCandyType(tile) {
    for (const candy of candies) {
        if (tile.src.includes(candy)) {
            return candy;
        }
    }
    return tile.src.includes("blank") ? "blank" : "";
}

function crushThree() {
    let toClear = new Set();
    let matchedTypes = [];

    // rows
    for (let r = 0; r < rows; r++) {
        let c = 0;
        while (c < columns) {
            let tile = board[r][c];
            if (tile.src.includes("blank")) {
                c++;
                continue;
            }
            let runStart = c;
            while (c + 1 < columns && board[r][c + 1].src === tile.src) {
                c++;
            }
            if (c - runStart + 1 >= 3) {
                for (let k = runStart; k <= c; k++) {
                    toClear.add(r + "-" + k);
                }
                matchedTypes.push(getCandyType(tile));
                console.log("match found (row)", r, runStart + "-" + c, getCandyType(tile));
            }
            c++;
        }
    }

    // columns
    for (let c = 0; c < columns; c++) {
        let r = 0;
        while (r < rows) {
            let tile = board[r][c];
            if (tile.src.includes("blank")) {
                r++;
                continue;
            }
            let runStart = r;
            while (r + 1 < rows && board[r + 1][c].src === tile.src) {
                r++;
            }
            if (r - runStart + 1 >= 3) {
                for (let k = runStart; k <= r; k++) {
                    toClear.add(k + "-" + c);
                }
                matchedTypes.push(getCandyType(tile));
                console.log("match found (col)", c, runStart + "-" + r, getCandyType(tile));
            }
            r++;
        }
    }

    if (toClear.size === 0) {
        return;
    }

    const clearedKeys = [...toClear];
    console.log("clearing", clearedKeys.length, "tiles:", clearedKeys);
    for (const key of clearedKeys) {
        let [r, c] = key.split("-").map(Number);
        board[r][c].src = "./images/blank.png";
    }
    const [sampleR, sampleC] = clearedKeys[0].split("-").map(Number);
    console.log("cleared. sample tile src is now:", board[sampleR][sampleC].src);

    for (const type of matchedTypes) {
        score += 30;
        applyMatchReward(type);
    }
    document.getElementById("score").innerText = score;
}

function applyMatchReward(type) {
    if (type === "PowerCell") {
        powerCell += 15;
        document.getElementById("powerCell").innerText = powerCell;
    } else if (type === "CryoCoolant") {
        cryoCoolant += 15;
        document.getElementById("CryoCoolant").innerText = cryoCoolant;
    } else if (type === "RepairNanites") {
        repairNanites += 100;
        document.getElementById("RepairNanites").innerText = repairNanites;
    } else if (type === "ChassisScrap") {
        chassisScrap += 90;
        document.getElementById("ChassisScrap").innerText = chassisScrap;
    }
}

function hasMatchAt(r, c) {
    let src = board[r][c].src;
    if (src.includes("blank")) {
        return false;
    }

    let horizontal = 1;
    for (let c2 = c - 1; c2 >= 0 && board[r][c2].src === src; c2--) horizontal++;
    for (let c2 = c + 1; c2 < columns && board[r][c2].src === src; c2++) horizontal++;
    if (horizontal >= 3) {
        return true;
    }

    let vertical = 1;
    for (let r2 = r - 1; r2 >= 0 && board[r2][c].src === src; r2--) vertical++;
    for (let r2 = r + 1; r2 < rows && board[r2][c].src === src; r2++) vertical++;
    return vertical >= 3;
}

function checkValid(r1, c1, r2, c2) {
    return hasMatchAt(r1, c1) || hasMatchAt(r2, c2);
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let index = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[index][c].src = board[r][c].src;
                index--;
            }
        }
        for (let r = index; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function genCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}