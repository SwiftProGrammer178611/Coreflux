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
    <>
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
