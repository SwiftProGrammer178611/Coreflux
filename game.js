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
let enemFrame = 0;
let enemyIdInterval = null;
const enemyFrameTot = 4;
const enemyFrameWidth = 1064 / enemyFrameTot;
let mech1State = "idle"
let mech1X = 20;
let mech1Y = 20;
let mech1MoveStep = 10;
let mech1WalkFrame = 0
let mech1Id = null;
let mech1ShootId = null;
let mech1WalkFwid = 1010 / 6;
let shootAutoNear = false;
let internalTemp = 0; // 0 is the baseline
let cryoFreezeSpecial = 0;
let mech1TotalHealth = 100;
let mech1SuperShield = false;
let plasma = 1000;
//For mech1 autoshoot, first check, is there enough plasma?
let autoShootId = null;
const autoShootRange = 300;
let enemies = [];

let canvas = null;
const sprites = [];
let playerMapX = 0;
let playerMapY = 0;

// Candy Crush tile logic board area: 
/*
  So right now, its kind of serperate minigames, and we need to tighten gap 
  between candy cursh aspect and shooting aliens aspect
  Lets figure out what the candies should do:
  🔥 = plasma
  Every match of three or more gets stored when neeeded and gets shot out automatically 
  killing enemies within proximity
  ❄️ = coolant
  cool the player constantly, and when above certian threshold, it charges a freeze special
  🔧 = repair nanites
  this will repair player constantly, as matches for this are made. The special will be a charge of bgi health, that will be used by player only when down 
  health a certain percetnage to big shield you against a big attack. only matters if hurt
  ⚙️ = chassis scrap
  this will recharge the shield effect, and will be used either when needed or when user wants to use it
  🔋 = power cell
  charges up special laser charge shot
  🌡️ = internal temperatures. This should be a bar going up/down based on the temp.
  things that effect this: 
  Plasma shots. These heat it up
  Coolant cools it down
  above certan threshold, plasma takes more matches to get generated. 
  At max robot overheats and explodes

  now, every now and then, a special special can come, which can provide specials, liek wipe the board clean, or 
  random specials, but this implementation can be for later. 

  Time for the Gameboard: 🎯
  so user goes and explores map, and encounters alien army eventually, has to defeat, 
  save world maybe 45 deg angle top down brids eye ish view is good, that way the anchrored 
  elf tnad roght is there, but it doenst look 2d, is isn't what I want

  mb clash of clans like look, tilting floor seems the way to go, isometric map of some sort has been put

user story:

landing page, describing the mech game
get started leads to the loading of the game and a tutorial
for security, instead of making user singup and login tediously, maybe a localstorage based jwt system for
BUT if login/signup is fine, then we'll do traditional jwt auth and mechanics to let user in

not concretely set, but for now at least, theres gonna be some form of a sidebar for:
stats/acheivements,
garage/workshop?
diff. worlds view with 3.js?
other pages, not fully figure out yet

main playing area includes the game baord, stacked with the canvas playing area

now for the game itself:
it's all mech based, saving planets

now, I'll need to do brainstorming on the mechanics, do I want a level adjavcent like system? where
as you grow more experienced, and conquer, you unlock? Thats very basic though, and I don't really like that
idea. OOH: each planet you 'free' grwos your team, but also provides different types of cusotmization, and features to
enhance the game how you want

Initial thoughts were create a system where you gather your team, and who you want, and fight eventual monster
but rather than that, I would prefer a 'big brother' like system or smthing where its kind of entropy based
and fights ocurring somehow, news, and fight, rather than a finally one and done type of thing.

Most abstract idea: world creator? you make your own world after a certain point in the game, and use your team

*/

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
    plasma = 1000;
    selectedTile = null;

    startGame();
    //startEnemyIdle();

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
    document.addEventListener("keydown", keyActions)
    document.addEventListener("keyup", keyUp);

    enemySpawn();

    if (plasma >= 150) {
        mech1ShootProjectile();
    }

    autoShootId = setInterval(autoShootCheck, 200);

    return () => {

    };
}

function generateRandomPath() {
    const paths = [];

    paths.push({
        x: Math.floor(Math.random() * 300) + 300,
        y: Math.floor(Math.random() * 100) + 20
    });
    paths.push({
        x: Math.floor(Math.random() * 200) + 150,
        y: Math.floor(Math.random() * 100) + 100
    });
    paths.push({
        x: mech1X + 50,
        y: mech1Y + 50
    });
    return paths;
}

function enemySpawn(path = generateRandomPath()) {
    const game = document.querySelector(".map");

    const enWrap = document.createElement("div");
    enWrap.style.position = "absolute"
    enWrap.style.width = enemyFrameWidth + "px";
    enWrap.style.height = "234px";
    enWrap.style.overflow = "hidden";

    const en = document.createElement("img")
    en.src = "./images/enemy3.png";
    en.style.width = (enemyFrameWidth * enemyFrameTot) + "px";
    en.style.height = "234px"
    en.style.maxWidth = "none"

    const startX = path[0].x;
    const startY = path[0].y;
    game.appendChild(enWrap);
    enWrap.appendChild(en);
    enWrap.style.left = startX + "px";
    enWrap.style.top = startY + "px";
    const enemyDef = {
        en,
        wrap: enWrap,
        x: startX,
        y: startY,
        path,
        waypointIndex: 1,
        health: 100
    }
    enemies.push(enemyDef);
    moveEnemyAlongPath(enemyDef);
    startEnemyWalk(enemyDef);
}

function enemyFall(enemy) {
    clearInterval(enemy.walkId);
    clearInterval(enemy.moveId);

    enemy.en.src = "./images/enemyFall.png";

    const frames = 6;
    let startFrame = 0;
    const width = 1036 / frames;
    const falling = setInterval(() => {
        enemy.en.style.transform = `translateX(-${startFrame * width}px)`;
        enemy.en.style.width = "1036px";
        enemy.wrap.style.width = width + "px";
        startFrame++;
        if (startFrame >= frames) {
            clearInterval(falling);
            enemy.wrap.remove();
        }
    }, 150);
}

//e is common used, short for event
function keyActions(e) {
    const mech1Cont = document.getElementById("mech1Cont");
    // just in case nothings there
    if (!mech1Cont) return;

    if (e.key === "w") {
        mech1Y -= mech1MoveStep;
        mech1Walking();
    } else if (e.key === "s" && e.repeat) {
        mech1Y += mech1MoveStep;
        mech1Walking();
    } else if (e.key === "a") {
        mech1X -= mech1MoveStep;
        mech1Walking();
    } else if (e.key === "d") {
        mech1X += mech1MoveStep;
        mech1Walking();
    } else if (e.key === "e") {
        shootWhen();
        mech1ShootProjectile();
    }

    else {
        return;
    }
    mech1Cont.style.left = mech1X + "px";
    mech1Cont.style.top = mech1Y + "px";
}

function mech1Walking() {
    mech1State = "walking";
    //here, I wanted the walking to play when keypress was beign held, for wasd
    // and the issue was clearInterval was happening, so I just need to return to make it stop
    // we jsut don't reset it, and let it keep going
    // A bit choppy of a solution, we'll add glboal key listeners later, in a code refactor
    // TODO: refactor to better listening to keypresses
    if (mech1Id !== null) {
        return;
    }
    let mechType = document.getElementById("mech1Sprite");
    if (!mechType.src.includes("mech1WalkAnim.png")) {
        mechType.src = "/images/mech1WalkAnim.png";
    }
    mech1Id = setInterval(() => {
        const mechWalk = document.getElementById("mech1Sprite");
        if (!mechWalk) return;
        mechWalk.style.transform = `translateX(-${mech1WalkFrame * mech1WalkFwid}px)`;
        mech1WalkFrame = (mech1WalkFrame + 1) % 6;
    }, 150);
}


let plasmaShots = [];

function mech1ShootProjectile(target) {
    if (plasma < 15) return;
    if (!target) {
        const found = findNearestEnemy(playerMapX, playerMapY);
        if (!found) return;
        target = found.enemy;
    }
    const map = document.querySelector(".map");
    const proj = document.createElement("img");
    proj.src = "./images/proj.png";   // ← your actual file
    proj.style.position = "absolute";
    proj.style.width = "20px";
    proj.style.height = "20px";
    proj.style.maxWidth = "none";

    const shot = { x: playerMapX, y: playerMapY, el: proj, target };
    proj.style.left = shot.x + "px";
    proj.style.top = shot.y + "px";
    map.appendChild(proj);

    plasma -= 15;
    document.getElementById("plasma").innerHTML = plasma;
    moveShot(shot);
}

function findNearestEnemy(fromX, fromY) {
    let nearest = null;
    let nearestDist = Infinity;
    for (const enemy of enemies) {

        const changeX = (enemy.x + enemyFrameWidth / 2) - fromX;   // enemy center
        const changeY = (enemy.y + 117) - fromY;                    // 117 = half of 234
        const dist = Math.sqrt(changeX * changeX + changeY * changeY);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearest = enemy;
        }
    }
    return nearest ? { enemy: nearest, dist: nearestDist } : null;
}

function autoShootCheck() {
    if (plasma < 15) return;
    const found = findNearestEnemy(playerMapX, playerMapY);
    if (!found || found.dist > autoShootRange) return;
    mech1ShootProjectile(found.enemy);
    document.querySelector(".character")?.setAttribute("shooting", "true"); // play the anim too
}

function moveShot(shot) {
    const moveId = setInterval(() => {
        if (!enemies.includes(shot.target)) {     // target died mid-flight
            shot.el.remove();
            clearInterval(moveId);
            return;
        }
        const tx = shot.target.x + enemyFrameWidth / 2;
        const ty = shot.target.y + 117;
        const dx = tx - shot.x;
        const dy = ty - shot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= 40) {                          // close enough = hit
            damageEnemy(shot.target, 25);
            shot.el.remove();
            clearInterval(moveId);
            return;
        }


        shot.x += (dx / dist) * 6;
        shot.y += (dy / dist) * 6;
        shot.el.style.left = shot.x + "px";
        shot.el.style.top = shot.y + "px";
    }, 30);
}

//made this a general damage function for all types of attacks
function damageEnemy(enemy, dmg) {
    enemy.health -= dmg;
    if (enemy.health <= 0) {
        clearInterval(enemy.walkId);
        enemies = enemies.filter(e => e !== enemy);
        score += 50;
        document.getElementById("score").innerText = score;
        enemyFall(enemy);
    }
}

function moveEnemyAlongPath(enemyDef) {
    if (enemyDef.waypointIndex >= enemyDef.path.length) {
        return;
    }
    const target = enemyDef.path[enemyDef.waypointIndex];
    const startX = enemyDef.x;
    const startY = enemyDef.y;
    const changeX = target.x - startX;
    const changeY = target.y - startY;
    const distCalc = Math.sqrt(changeX * changeX + changeY * changeY);
    const spd = 2;
    const stepX = (changeX / distCalc) * spd;
    const stepY = (changeY / distCalc) * spd;

    let x = startX;
    let y = startY;
    let traveledDist = 0;

    const moveId = setInterval(() => {
        x += stepX;
        y += stepY;

        traveledDist += spd;
        enemyDef.wrap.style.left = x + "px";
        enemyDef.wrap.style.top = y + "px";

        if (traveledDist >= distCalc) {
            clearInterval(moveId);
            enemyDef.x = target.x;
            enemyDef.y = target.y;
            enemyDef.waypointIndex++;
            moveEnemyAlongPath(enemyDef);
        }
    }, 30)
}

function moveProjEnem(proj) {
    const enemy = document.getElementById("enemySprite");
    if (!enemy) {
        proj.remove();
        return;
    }
    const startPosX = mech1X + 40;
    const startPosY = mech1Y + 20;
    const changeX = enemy.offsetLeft - startPosX;
    const changeY = enemy.offsetTop - startPosY;
    const distCalc = Math.sqrt(changeX * changeX + changeY * changeY);
    const spd = 3;
    const stepx = (changeX / distCalc) * spd;
    const stepy = (changeY / distCalc) * spd;
    let x = startPosX;
    let y = startPosY;
    let traveledDist = 0;
    const moveId = setInterval(() => {
        x += stepx;
        y += stepy;
        traveledDist += spd;
        proj.style.left = x + "px";
        proj.style.top = y + "px";
        enemyDef.x = x;
        enemyDef.y = y;

        if (traveledDist >= distCalc) {
            enemyHealth -= 20;
            proj.remove();
            clearInterval(moveId);
            enemy.remove();
            if (enemyHealth <= 0) {
                clearInterval(enemyIdInterval);
                enemyIdInterval = null;
            }
        }
    }, 16);
}

function enemyShoot() {
    //
}

function keyUp(e) {
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.key === "e") {
        if (mech1Id !== null) {
            clearInterval(mech1Id);
            mech1Id = null
        }
        mech1State = "idle";
        mech1WalkFrame = 0;
        const mech = document.getElementById("mech1Sprite");
        if (mech) {
            mech.style.transform = `translate(0px)`;
        }
    }
}

export function shootWhen() {
    if (powerCell > 0) {

        if (mech1Id !== null) {
            clearInterval(mech1Id);
            mech1Id = null;
        }

        if (mech1ShootId !== null) {
            clearInterval(mech1ShootId);
            mech1ShootId = null;
        }

        let mech1Frame = 0;
        const fwid = 1010 / 6;
        let mechType = document.getElementById("mech1Sprite");
        mechType.src = "/images/mech1ImgSet.png";

        mech1ShootId = setInterval(() => {
            const mech = document.getElementById("mech1Sprite");
            if (!mech) return;
            //mech1Frame = (mech1Frame + 1) % 6;
            //the const id trick here is neat, the browser creates INTERVAL 1 created and then returns it, so here when we do const id= the set interval its rly const id=1 and then we clear Interval to clera that 1 and restart!

            mech1State = "shooting";
            console.log(mech1State)
            mech.style.transform = `translateX(-${mech1Frame * fwid}px)`;

            mech1Frame++;

            //we hv to use clearInterval to stop after 6 frames
            if (mech1Frame >= 6) {
                //clears the shooting animation and not the walking, so walking still wokrs
                clearInterval(mech1ShootId);
            }
        }, 150)

        powerCell = powerCell - 5;
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

function startEnemyIdle() {
    if (enemyIdInterval !== null) {
        window.clearInterval(enemyIdInterval);

    }

    enemyIdInterval = window.setInterval(() => {
        const enemy = document.getElementById("enemySprite");
        if (!enemy) return;
        enemy.style.transform = `translateX(${enemFrame * enemyFrameWidth}px)`;
        enemFrame = (enemFrame + 1) % enemyFrameTot;
    }, 250)
}

function startEnemyWalk(enemyDef) {
    enemyDef.frame = 0;
    enemyDef.walkId = setInterval(() => {
        enemyDef.en.style.transform = `translateX(-${enemyDef.frame * enemyFrameWidth}px)`
        enemyDef.frame = (enemyDef.frame + 1) % enemyFrameTot;
    }, 150);
}

let enemyHealth = 100;
function enemyDownWhen() {
    if (powerCell > 5 && shootWhen()) {
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
        shootAutoNear = true;
        internalTemp += 10;
    } else if (type === "CryoCoolant") {
        cryoCoolant += 15;
        document.getElementById("CryoCoolant").innerText = cryoCoolant;
        if (internalTemp >= 0) {
            internalTemp -= 5;
        } else {
            cryoFreezeSpecial += 1;
        }
    } else if (type === "RepairNanites") {
        repairNanites += 100;
        document.getElementById("RepairNanites").innerText = repairNanites;
        if (mech1TotalHealth < 100) {
            mech1TotalHealth += repairNanites;
            if (mech1TotalHealth > 100) {
                mech1SuperShield = true;

            }
        }
    } else if (type === "ChassisScrap") {
        chassisScrap += 90;
        document.getElementById("ChassisScrap").innerText = chassisScrap;
    } else if (type === "Plasma") {
        plasma += 15;
        document.getElementById("plasma").innerHTML = plasma;
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


const sheetw = 654, sheeth = 381;
const sheetcols = 12, sheetrows = 7;
const framew = sheetw / sheetcols;
const frameh = sheeth / sheetrows;
const mechstates = {
    idle: { row: 0, frames: 8 },
    walk: { row: 1, frames: 12 },
    run: { row: 2, frames: 12 },
    attack: { row: 3, frames: 8, once: true },
    hurt: { row: 4, frames: 8, once: true },
    death: { row: 5, frames: 9, once: true, hold: true },
    jet: { row: 6, frames: 5, startCol: 0 },
    deploy: { row: 6, frames: 6, startCol: 6, once: true },
}

let mechState = "idle";
let mechFrame = 0;
let facingLeft = false;

export function startCam() {
    var character = document.querySelector(".character");
    var map = document.querySelector(".map");

    const spriteEl = document.querySelector(".character_spritesheet");
    setInterval(() => {
        const s = mechstates[mechState];
        const pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
        const col = (s.startCol || 0) + mechFrame;
        spriteEl.style.backgroundSize = `${sheetw * pixelSize}px ${sheeth * pixelSize}px`;
        spriteEl.style.backgroundPosition = `-${col * framew * pixelSize}px -${s.row * frameh * pixelSize}px`;
        spriteEl.style.transform = facingLeft ? "scaleX(-1)" : "";
        mechFrame++;
        if (mechFrame >= s.frames) {
            if (s.once) mechState = s.hold ? mechState : "idle";
            mechFrame = s.hold ? s.frames - 1 : 0;
        }
    }, 400);

    //start in the middle of the map
    var x = 900;
    var y = 340;
    var held_directions = []; //State of which arrow keys we are holding down
    var speed = 1; //How fast the character moves in pixels per frame
    const placeCharacter = () => {

        var pixelSize = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
        );

        const held_direction = held_directions[0];
        if (held_direction) {
            let nextX = x;
            let nextY = y;

            if (held_direction === directions.right) { nextX += speed; }
            if (held_direction === directions.left) { nextX -= speed; }
            if (held_direction === directions.down) { nextY += speed; }
            if (held_direction === directions.up) { nextY -= speed; }

            if (canWalkZones(nextX, nextY)) {
                x = nextX;
                y = nextY;
            }
            if (held_direction === directions.left) facingLeft = true;
            if (held_direction === directions.right) facingLeft = false;
        }
        if (mechState === "idle" || mechState === "walk") {
            mechState = held_direction ? "walk" : "idle";
        }

        /*
            Player limits and bounds on current map:
        */
        var leftLimit = -8;
        var rightLimit = (55 * 11) + 8;
        var topLimit = -8 + 0;



        var bottomLimit = (65 * 7);
        if (x < leftLimit) { x = leftLimit; }
        if (x > rightLimit) { x = rightLimit; }
        if (y < topLimit) { y = topLimit; }
        if (y > bottomLimit) { y = bottomLimit; }

        playerMapX = x * pixelSize;
        playerMapY = y * pixelSize;
        var camera_left = pixelSize * 66;
        var camera_top = pixelSize * 42;

        map.style.transform = `translate3d( ${-x * pixelSize + camera_left}px, ${-y * pixelSize + camera_top}px, 0 )`;
        character.style.transform = `translate3d( ${x * pixelSize}px, ${y * pixelSize}px, 0 )`;
    }

    //Set up the game loop
    const step = () => {
        placeCharacter();
        window.requestAnimationFrame(() => {
            step();
        })
    }
    step();

    /* Direction key state */
    const directions = {
        up: "up",
        down: "down",
        left: "left",
        right: "right",
    }
    const keys = {
        38: directions.up,
        37: directions.left,
        39: directions.right,
        40: directions.down,
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "e") {
            mechState = "attack";
            mechFrame = 0;
            mech1ShootProjectile();
        }
        var dir = keys[e.which];
        if (dir) {
            e.preventDefault();
            if (held_directions.indexOf(dir) === -1) {
                held_directions.unshift(dir);
            }
        }
    })
    document.addEventListener("keyup", (e) => {
        var dir = keys[e.which];
        var index = held_directions.indexOf(dir);
        if (index > -1) {
            held_directions.splice(index, 1)
        }
    });
    character.addEventListener("animationend", () => {
        character.removeAttribute("shooting");
    })
    showZones();
}

let zones = [
    { x1: 120, y1: 200, x2: 260, y2: 250 },
    { x1: 400, y1: 90, x2: 470, y2: 180 },
]
function canWalkZones(nx, ny) {
    const cx = nx + 16;
    const cy = ny + 24;
    for (const z of zones) {
        if (cx >= z.x1 && cx <= z.x2 && cy >= z.y1 && cy <= z.y2) {
            return false;
        }
    }
    return true;
}

const debZones = true;
function showZones() {
    if (!debZones) return;
    const map = document.querySelector(".map");
    const pixelSize = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
    );
    for (const z of zones) {
        const box = document.createElement("div");
        box.className = "zone-debug";
        box.style.position = "absolute";
        box.style.left = (z.x1 * pixelSize) + "px";
        box.style.top = (z.y1 * pixelSize) + "px";
        box.style.width = ((z.x2 - z.x1) * pixelSize) + "px";
        box.style.height = ((z.y2 - z.y1) * pixelSize) + "px";
        box.style.background = "rgba(34, 0, 255, 0.35)";
        box.style.outline = "2px solid red";
        map.appendChild(box);
    }
}