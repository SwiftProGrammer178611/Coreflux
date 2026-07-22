import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {Routes,Route,useLocation} from "react-router-dom";
import {initGame} from "./game.js";

// Swap these placeholders for your real page content whenever you're ready. Completed.✅ Just change what goes on these pages now, or restructure route differently if necessary?
function PowerCellPage() {
  useEffect(()=>{
    const cleanup = initGame();
    return cleanup;
  }, []);

  return (
    <>
      <h1>Score <span id = "score"></span></h1>
      <div id="board"></div>
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
    <div className="flex">
      <Sidebar open={open} setOpen={setOpen} page={location.pathname} />
      <main className="flex-1 p-8">
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