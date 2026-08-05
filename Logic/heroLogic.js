const sheetw = 128, sheeth = 128;
const sheetcols = 4, sheetrows = 4;
const framew = 32;
const frameh = 32;



let startingState = "down";
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
    if (!mechType.src.includes("/images/ninjaAdvPack/Actor/CharacterAnimated/NinjaGreen/Separate/Dead.png")) {
        mechType.src = "/images/ninjaAdvPack/Actor/CharacterAnimated/NinjaGreen/Separate/Dead.png";
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

const placeCharacter = () => {

        var pixelSize = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
        );

        //Smooth going against a boundary
        const held_direction = held_directions[0];
        if(held_directions.length>0){
            let nextX=x;
            let nextY=y;
            if(held_directions.includes(directions.right)) {nextX+=speed;}
            if(held_directions.includes(directions.left)) {nextX-=speed;}
            if(held_directions.includes(directions.down)) {nextY+=speed;}
            if(held_directions.includes(directions.up)) {nextY-=speed;}

            if(canWalkZones(nextX,y)) {x=nextX;}
            if(canWalkZones(x,nextY)) {y=nextY;}
            
        }
        if(mechstates.startsWith("idle") || mechstates.startsWith("walk")) {
                if(held_direction == directions.up) facing = up
                else if(held_direction === directions.down) facing="down";
                else if(held_direction === directions.left) {facing="side"; facingLeft=true;}
                else if(held_sireciton === directions.right) {facing = "side"; facingLeft=true;}
            
                const facingLabel = facing.charAt(0).toUpperCase()+ facing.slice(1);
                const nextState = (held_direction ? "walk": "idle") + facingLabel;
                if(nextState !== mechState){
                    mechState = nextState;
                    mechFrame=0;
                }
            }
        
        /*
            Player limits and bounds on current map:
        */

        var leftLimit = -45;
        var rightLimit = (55 * 18.3) + 80;
        var topLimit = -80 + 0;
        var bottomLimit = (65 * 10);
        if (x < leftLimit) { x = leftLimit; }
        if (x > rightLimit) { x = rightLimit; }
        if (y < topLimit) { y = topLimit; }
        if (y > bottomLimit) { y = bottomLimit; }

        // projectile spawns here
        playerMapX = (x + 60) * pixelSize;
        playerMapY = (y + 100) * pixelSize;
        playerX = x;
        playerY = y;

        var camera_left = pixelSize * 10;
        var camera_top = pixelSize * -25;

        // let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));

        // this code section here is for the camera  to not show the teal background behind the map
        // the 
        let mapW = 1160;
        var mapH = 1160 * (1024 / 1536);
        let camW = 290;
        let camH = 274;
        let camLeft = pixelSize * 10;
        let camTop = pixelSize * -25;
        let translateY = -y * pixelSize * zoom + camTop;
        let translateX = -x * pixelSize * zoom + camLeft;

        // these are the maximum the camera can trtavel before the edge shows
        let minTranslateX = pixelSize * (camW - mapW * zoom);
        let minTranslateY = pixelSize * (camH - mapH * zoom);
        translateX = Math.min(0, Math.max(minTranslateX, translateX));
        translateY = Math.min(0, Math.max(minTranslateY, translateY));
        // console.log("translateY:", translateY, "minTranslateY:", minTranslateY);
        map.style.transform = `translate3d(${translateX}px, ${translateY}px,0) scale(${zoom})`;
        character.style.transform = `translate3d( ${x * pixelSize}px, ${y * pixelSize}px, 0 ) scale(0.4)`;
    }

//function1: mech anim base for all animations
//function2: mech movements
//function3: mech shooting
//function4: mech levels logic
/*
    game functionality shift: Remove candy crush style game aspect, it feels like two seperate games 
    bolted together.

    

    1. Get all asset sprites loaded in.
    2. animate all sprites left right up and down
    3. 

    
*/

/*
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