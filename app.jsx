import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import { initGame, shootWhen, startCam } from "./game.js";

function PowerCellPage() {

  /*

  so for todays tasks for macondo, we can do the following:
  - I need to do flagships. When the player reaches the flagship area and stands there for say 5 seconds, 
    more and mroe enemies will keep spawning for that time, attacking player. Then, animation plays and 'chest' closes 
    signalling the flagship has been captured
  - Figure out logic, after completion of map, then what? Where shoudl player go to finish? 
    Like, When player enters map for first time should they enter in a rocketship or smthing? and then play and then fly off?
  - 


  */

  useEffect(() => {
    const cleanup = initGame();
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = startCam();
    return cleanup;
  }, []);

  return (
    <>
      <div className="frame">
        <div className="corner_topleft"></div>
        <div className="corner_topright"></div>
        <div className="corner_bottomleft"></div>
        <div className="corner_bottomright"></div>

        <div id="statusBar" className="absolute inset-0 z-10 pointer-events-none flex flex-row gap-4">
          <h1 className="text-white font-bold text-lg">Mech Laser:  <span id="powerCell"></span></h1>
          <h1 className="text-white font-bold text-lg">Repair Nanites: <span id="RepairNanites"></span></h1>
          <h1 className="text-white font-bold text-lg">CryoCoolant: <span id="CryoCoolant"></span></h1>
          <h1 className="text-white font-bold text-lg">ChassisScrap: <span id="ChassisScrap"></span></h1>
          <h1 className="text-white font-bold text-lg">Plasma: <span id="plasma"></span></h1>
        </div>
        <div id="rocketEnter" className="">
        </div>
        <div className="camera" tabIndex={0}>
          <div className="map pixel-art">
            Macondo, completed is:
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
      <div className="">
        <div className="flex relative h-[80%] w-[80%]">
        </div>
      </div>
      <h1 className="text-white font-bold text-xl">Score <span id="score"></span></h1>
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
      <main className="flex-1 p-8 overflow-y-auto w-full min-w-0">
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