import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import { initGame, shootWhen, startCam } from "./game.js";

function PowerCellPage() {

  useEffect(() => {
    const cleanup = initGame();
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = startCam();
    return cleanup;
  }, []);

  return (
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
    */

    <>
      {/* for better practices, I think using a canvas is better, so all our game related thing will be drawn there 
      TODO: LATER THO, THIS WILL TAKE A WHILE

        canvas:
        -load all sprites
        -setup fixed width and height
        -player moves around within it with a camera as they move, and enemies 'come out' of 
        specific positions located in forests or bushes areas OR Alternate case is theres enemy camps,
        where player attacks accordingly
        -also have info about all powerups etc in top left and irght bar areas to visually see
        -throughout 'world' player can 'rescue' other bots to build its team(For ultimate camp mb? or just for other world conquers)

        -First tackle is enemy shooting mechanics and when:
          *if player encounters certain radius of 'forest' or hidden area, then enemies come out, 'walk' 
          certain path and get ready to shoot, and they attack player. Player has plasma, and shoot automatically
          'missile-like' shots or mb you can upgrades your basic powerups, like plasma three is regular auto shot,
          but for upgrade, it can be missile combo three, so its better than a regular combo three. coin system potentially?
      */}

{/* Hours Calc

MONDAY
wake at 3:30 till 5:30 code  for 1.5 ish hrs on metroship
walk come back by 7:00 lock in till 9:00 metro ship, and this will get you to around 3.5 hrs
-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
9:00 to 5:00 all macondo -> 

-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
6:00-7:00 metroship and final submissions
7:00-8:00 is hackachu -> 10hrs 10 mins
9:00-11:00 hackachu -> 12 hrs 10 mins

leeway time till 11:15 pm if needed

TUESDAY
3:30-5:30 hackachu -> 12 hrs 40 mins
7:00-9:00 hackachu -> 14 hrs 40 mins
9:00-5:00 macondo
6:00-7:00 hackachu -> 15 hrs 40 mins
7:00-8:30 busy
9:00-11:00 hackachu -> 17 hrs 40 mins

WEDNESDAY

5:00-5:30 hackachu -> 18 hrs 10 mins
7:00-9:00 hackachu -> 20 hrs 10 mins
9:00-5:00 macondo
6:00-8:00 hackachu -> 22 hrs 10 mins
9:00-11:00 hackachu -> 24 hrs and 10 mins

THURSDAY

5:00-5:30 hackchu -> 24 hrs and 40 mins
7:00-9:00 hackachu -> finalizations, make sure everything is perfect, nothing stupid
9:00-5:00 macondo 

currect hackclubs we are doing: 
ISPY -> GOAL: MONITOR CURVED!
HACKACHU -> GOAL: WATCH 150 BUCKS FOR SHEYKH  
MACONDO - GOAL, A MAC AIR, BUT REMVOE AI, ADD. COMMENTS AND DESCRIPTIVE COMMENTS OF FUNCTIONS, FORGET ABOUT AI
METROSHIP -> GOAL: BOTTLE OWALA
*/}
      <div className="frame">
        <div className="corner_topleft"></div>
        <div className="corner_topright"></div>
        <div className="corner_bottomleft"></div>
        <div className="corner_bottomright"></div>

        <div className="camera" tabIndex={0}>
          <div className="map pixel-art">
            <div className="character" facing="down" walking="true">
              <div className="shadow pixel-art"></div>
              <div className="character_spritesheet pixel-art"></div>
              
            {/* This is for mechWalk DIV
            <div
              id ="mech1WalkCont"
              style={{
                width: "200px",
                height: "154px",
                overflow: "hidden",
                // border: "1px solid red",
              }}
            >
              <img 
                id="mech1WalkSprite"
                src="/images/mech1WalkAnim.png"
                style={{
                  width: "1000px",
                  height: "134px",
                  maxWidth: "none",
                }}
              />
            </div> */}
          </div>
          </div>
        </div>
      </div>
      <h1>Mech Laser:  <span id="powerCell"></span></h1>
      <h1>Repair Nanites:  <span id="RepairNanites"></span></h1>
      <h1>CryoCoolant:  <span id="CryoCoolant"></span></h1>
      <h1>ChassisScrap:  <span id="ChassisScrap"></span></h1>
      <h1>Plasma:  <span id="plasma"></span></h1>
      <div className="">

        <div className="flex relative h-[80%] w-[80%]">
        </div>
      </div>
      <h1>Score <span id="score"></span></h1>
      <div id="board" className=""></div>
    </>
  )
}

function CryoCoolantPage() {
  return <h1 className="text-white text-2xl">Cryo Coolant</h1>;
}
function RepairNanitesPage() {
  return <h1 className="text-white text-2xl">Repair Nanites</h1>;
}
function ChassisScrapPage() {
  return <h1 className="text-white text-2xl">Chassis Scrap Hello WORLDO!</h1>;
}

function App() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen} page={location.pathname} />
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <Routes>
          <Route path="/" element={<PowerCellPage />}></Route>
          <Route path="/cryo-coolant" element={<CryoCoolantPage />}></Route>
          <Route path="/repair-nanites" element={<RepairNanitesPage />}></Route>
          <Route path="/chassis-scrap" element={<ChassisScrapPage />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;