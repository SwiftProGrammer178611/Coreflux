// Candy Crush core logic, following the classic "Code Candy Crush In
// JavaScript" tutorial's own approach (direct img.src comparisons, the
// same startGame/crushThree/checkValid/slideCandy/genCandy structure)
// instead of a custom rewrite.
//
// Adapted for this project in a few ways:
//   1. Wrapped in initGame()/cleanup instead of window.onload, since this
//      runs inside a React component's useEffect, not a plain page load.
//   2. Candy names, image folder, and the resource counters (PowerCell,
//      CryoCoolant, RepairNanites, ChassisScrap) match this project instead
//      of the tutorial's plain color set.
//   3. Tile selection uses click-to-select-then-click-adjacent-to-swap
//      (see tileClick) instead of the tutorial's native HTML5 drag-and-drop,
//      whose drop event proved unreliable here.
//   4. Full run-length match detection (crushThree) and onerror logging on
//      images.

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

// Tracks the running tick interval so initGame() can never end up with two
// running at once if it gets called again before cleanup runs.
let activeIntervalId = null;

export function initGame() {
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

    activeIntervalId = window.setInterval(function () {
        // console.log + try/catch on purpose: if the browser's console
        // filter is hiding "Errors", a thrown exception here would
        // otherwise vanish silently and it'd look like nothing is running
        // at all. This guarantees visibility regardless of that filter.
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
        activeIntervalId = null;
    };
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

            // Diagnostic only — doesn't change game behavior, just makes a
            // missing/misnamed image file obvious in the console instead of
            // silently rendering as an indistinguishable broken-image icon.
            tile.onerror = () => console.log("Missing candy image:", tile.src);

            tile.addEventListener("click", tileClick);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    // If this ever prints a number other than 81, there are stray tiles
    // left over from a previous startGame() call that didn't get cleared
    // (e.g. two intervals/boards running at once from an HMR reload).
    console.log(
        "startGame() done. Tiles in #board DOM:",
        document.getElementById("board").children.length,
        "| board array size:", board.length, "x", board[0]?.length
    );
}

// Click-to-select-then-click-adjacent-to-swap, instead of native HTML5
// drag-and-drop. The drag/drop event sequence (dragstart/dragover/drop/
// dragend) turned out to be unreliable here — "drop" frequently never
// fired on the target tile, so dragEnd always saw a missing otherTile and
// aborted the swap, meaning a match could never be completed. Click-based
// selection has no such event-timing dependency.
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
        // Treat as picking a new first tile instead of a swap attempt.
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

// Finds which candy type a tile is by matching its image path against the
// candies list (mirrors the tutorial's src-based checks; only needed here
// because, unlike the tutorial, this game gives a different resource bonus
// per candy type).
function getCandyType(tile) {
    for (const candy of candies) {
        if (tile.src.includes(candy)) {
            return candy;
        }
    }
    return tile.src.includes("blank") ? "blank" : "";
}

// Same idea as the tutorial's Crush 3 (compare .src directly, blank out
// matches), but finds the FULL length of a run instead of only checking
// fixed 3-cell windows. With a fixed window, a coincidental 4-in-a-row
// blanks its first 3 cells, then the very next window starts on an
// already-blanked cell and stops early — leaving one candy from the run
// stuck on the board. Scanning full runs avoids that and awards the bonus
// once per run instead of once per overlapping window.
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

// Checks only whether the tile at (r, c) is itself part of a 3+ run, in
// either direction. checkValid used to scan the whole board for ANY match
// instead of just the two just-swapped cells, so a swap that created no
// match of its own could still get kept just because some unrelated match
// happened to exist elsewhere on the board (very common, since the tick
// loop keeps regenerating candies constantly).
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