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
            {/* This is for main mech DIV */}
            <div
              id="mech1Cont"
              style={{
                width: "158px",
                height: "166px",
                overflow: "hidden",
                border: "1px solid red",
                position: "absolute"
              }}
            >
              <button onClick={shootWhen}>SHOOT</button>
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