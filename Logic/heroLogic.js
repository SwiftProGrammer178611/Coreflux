const sheetw = 1560, sheeth = 840;
const sheetcols = 13, sheetrows = 7;
const framew = 120;
const frameh = 120;

const mechstates = {
    idle: { row: 0, frames: 10 },
    walk: { row: 1, frames: 11 },
    run: { row: 2, frames: 11 },
    attack: { row: 3, frames: 8, once: true },
    hurt: { row: 4, frames: 9, once: true },
    death: { row: 5, frames: 9, once: true, hold: true },
    jet: { row: 6, frames: 5, startCol: 0 },
    deploy: { row: 6, frames: 8, startCol: 5, once: true },
};

let mechState = "idle";
let mechFrame = 0;
let facingLeft = false;

//function1: mech anim base for all animations
//function2: mech movements
//function3: mech shooting
//function4: mech levels logic
/*
    game functionality shift: Remove candy crush style game aspect, it feels like two seperate games 
    bolted together.

    
*/

function mech1Walking() {
    mech1State = "walking";
    //here, I wanted the walking to play when keypress was being held, for wasd
    // and the issue was clearInterval was happening, so I just need to return to make it stop
    // we jsut don't reset it, and let it keep going
    // A bit choppy of a solution, we'll add glboal key listeners later, in a code refactor
    // TODO: refactor to better listening to keypresses
    if (mech1Id !== null) {
        return;
    }
    let mechType = document.getElementById("mech1Sprite");
    if (!mechType.src.includes("/Sprites/mech1WalkAnim.png")) {
        mechType.src = "/images/mech1WalkAnim.png";
    }
    mech1Id = setInterval(() => {
        const mechWalk = document.getElementById("mech1Sprite");
        if (!mechWalk) return;
        mechWalk.style.transform = `translateX(-${mech1WalkFrame * mech1WalkFwid}px)`;
        mech1WalkFrame = (mech1WalkFrame + 1) % 6;
    }, 150);
}
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
        if(enemy.isRocket) continue;
        
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
//made this a general damage function for all types of attacks tried tracker
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
/*

vision wiht this game for the next 28 days:
    - Full game completed
    - multiple maps
    - hero destroys enemies, frees map(world) and mechs of that area or villagers populate again
    - resources and way mech interacts is from the cand crush style game
    - the mini game is core to the main game functioning, it's like the mech's internals
    - this game doesn't feel typical, theres no map view or cutscenes, its kind of minecraft styled
    - ending, once every world is finally free, and a (end-like) city is freed, theres no hard stop. rather, 
      combos are calmer and towards a different goal.
    - Art has to be shifted away from isometric, and more towards top down 2d chibi sprites like look. Art is going to be easier to create with this style as well
        * reference legend of zelda a link to the past(and Link's) awakening for art reference and ideas
    - 

- iSpy 
    *25 hrs monitor
    *15 hrs for 100$ watch
    Now, though these are cool, Our eyes are set on the prize. 1 Monitor, 500$ worth in watch money
    100/15 200/30 300/45 400/60 500/75 hrs
    Total time spent: 75 hrs for watch + 25 hrs for monitor = 100hrs
    ends Sept 1st. 30 days, 3.33 hrs a day min
    There are a lot of great deals for under 500 dollars for tissot

    projects to make: 
    
    hiding text in an image steganography
    OSINT tool
    Encrypted chat app(prob one that will take most time) maybe combined with: location based messagin system, where once you reach a location the message shows
    ooh, maybe when you text someone in the chat app, publicly it shows fake lcoation, while privtately it shows the reqla lcoation
    cnary token/honepot system, basically honeypots

    webcam tripwire: if cam notices anyone besides main user, it send notification or smthing
    Digital footprint audit tool

    messaging app is prob the one we are going to be making, but this will take a while. 
    Maybe first spy yt vid on OSINT or smthing, and then start messaging system
    Webcam is aslo a very cool proj to do, software level proj rather than web based approach.

- Treasure. hunt ysws: MORE RESEARCH ON HOW IT WORKS? HOURS BASED? 10 gold per hour
    *mouse 20hrs
    *apple dev licencse 20hrs
    fix up chrona and submit it here.
    chrona changes:
        - remove all art pieces, trees everything, it just doesnt look polished
        - maybe go for a pixelly look, rpg style mb, from an all in one art style set form one creator
        - make shop working
        - remove ai-ness of it, be inspired by the pixl website, and use that style.

    Ends aug 30
    https://treasure.hackclub.com/dashboard/shop

- Alchemize: RESERARCH HOW THIS WORKS, ends october, start after Macondo tho, based on when it ends, ends Oct 8th
    *Rasbperry pi $60 13.33 hrs
    *GAN V100 cube 8.89 hrs 
    *Apple dev account 25 hrs
    *KINDLE SCRIBE 339$ 70 hrs

- Forge
    *Random Hardware module, 10c
    *Random Microcontroller 15c
    *10$hardware grant 11c
    
    *Soldering grant 15c
    *3dPrinting CNC grant 10 $ 11c
    *apple pencil 100c

forge, cool projects to do here:
    - 2 ish hr project, strt when school starts, 


useful resources in hackclub resolution, for learning purposes: https://resolution.hackclub.com/app
*/