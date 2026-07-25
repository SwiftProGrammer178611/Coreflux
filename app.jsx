import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import { initGame, shootWhen } from "./game.js";

function PowerCellPage() {

  useEffect(() => {
    const cleanup = initGame();
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
      */}
      <canvas id="game"></canvas>
      <h1>Mech Laser:  <span id="powerCell"></span></h1>
      <h1>Repair Nanites:  <span id="RepairNanites"></span></h1>
      <h1>CryoCoolant:  <span id="CryoCoolant"></span></h1>
      <h1>ChassisScrap:  <span id="ChassisScrap"></span></h1>
      <h1>Plasma:  <span id="plasma"></span></h1>
      <div className="">
        <div className="flex relative h-[80%] w-[80%]">
          <img src="./images/isometricMap.png " className="w-full h-full block"  />
          <div className="flex" id="battle" style={{ position: "absolute", top: "20px", left: "20px" }}>
            {/* This is for main mech DIV */}
            <div
              id="mech1Cont"
              style={{
                width: "158px",
                height: "166px",
                overflow: "hidden",
                // border: "1px solid red",
                position: "absolute"
              }}
            >
              <img
                id="mech1Sprite"
                src="/images/mech1ImgSet.png"
                style={{
                  
                  width: "1010px",
                  height: "136px",
                  maxWidth: "none",

                }}
              />
            </div>
            {/* This is for enemy DIV */}
            <div
              style={{
                width: "200px",
                height: "154px",
                overflow: "hidden",
                // border: "1px solid red",
              }}
            >
              <img
                id="enemySprite"
                src="/images/enemy3.png"
                style={{
                  width: "1000px",
                  height: "134px",
                  maxWidth: "none",

                }}
              />
            </div>
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
  return <h1 className="text-white text-2xl">Chassis Scrap</h1>;
}

function App() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen} page={location.pathname} />
      <main className="flex-1 p-8 overflow-y-auto w-[50%]">
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

