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
    <>
      {/* for better practices, I think using a canvas is better, so all our game related thing will be drawn there 
      TODO: LATER THO, THIS WILL TAKE A WHILE
      */}
      <canvas id="game"></canvas>
      <div className="">
        <div className="flex relative h-[80%] w-[80%]">
          <img src="./bg.png " className="w-full h-full block" />
          <div className="flex" id="battle" style={{ position: "absolute", top: "20px", left: "20px" }}>
            <div
              style={{
                width: "168px",
                height: "136px",
                overflow: "hidden",
                border: "1px solid red",
              }}
              className="absolute"
            >
              <button onClick={shootWhen}>SHOOT</button>
              <img
                id="mech1Sprite"
                src="/images/mech1ImgSet.png"
                style={{
                  width: "1010px",
                  height: "136px",
                  maxWidth: "none",
                  imageRendering: "pixelated",

                }}
              />
            </div>
            <div
              style={{
                width: "266px",
                height: "234px",
                overflow: "hidden",
                border: "1px solid red",
              }}
            >
              <img
                id="enemySprite"
                src="/images/enemy3.png"
                style={{
                  width: "1010px",
                  height: "136px",
                  maxWidth: "none",
                  imageRendering: "pixelated",

                }}
              />
            </div>
          </div>
        </div>

      </div>

      <h1>Score <span id="score"></span></h1>
      <div id="board" className=""></div>
      <h1>Mech Laser:  <span id="powerCell"></span></h1>
      <h1>Repair Nanites:  <span id="RepairNanites"></span></h1>
      <h1>CryoCoolant:  <span id="CryoCoolant"></span></h1>
      <h1>ChassisScrap:  <span id="ChassisScrap"></span></h1>

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