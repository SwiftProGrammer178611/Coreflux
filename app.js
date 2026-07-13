const { useState, useEffect } = React;

const NAV_ITEMS = [
  { id: "power-cell", icon: "⚡", label: "Power Cell" },
  { id: "cryo-coolant", icon: "❄️", label: "Cryo Coolant" },
  { id: "repair-nanites", icon: "🔧", label: "Repair Nanites" },
  { id: "chassis-scrap", icon: "🛠️", label: "Chassis Scrap" },
];

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  return NAV_ITEMS.some((item) => item.id === hash) ? hash : NAV_ITEMS[0].id;
}

function Sidebar({ open, setOpen, page }) {
  return (
    <div
      className={`bg-red-500 h-screen p-5 pt-8 transition-all duration-300 overflow-hidden relative ${
        open ? "w-64" : "w-20"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="bg-white text-blue-900 text-3xl rounded-full absolute -right-3 top-9 border-red-900 cursor-pointer w-10 h-10 flex items-center justify-center"
      >
        <img src="./images/Blue-Striped-Horizontal.png" className="w-8 h-8" alt="toggle" />
      </button>

      <nav className="mt-16 flex flex-col gap-5">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`flex items-center gap-3 text-white cursor-pointer ${
              page === item.id ? "opacity-100" : "opacity-70 hover:opacity-100"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            {open && <span className="whitespace-nowrap">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}

// Swap these placeholders for your real page content whenever you're ready.
function PowerCellPage() {
  return <h1 className="text-white text-2xl">Power Cell</h1>;
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

const PAGES = {
  "power-cell": PowerCellPage,
  "cryo-coolant": CryoCoolantPage,
  "repair-nanites": RepairNanitesPage,
  "chassis-scrap": ChassisScrapPage,
};

function App() {
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(getPageFromHash());

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const Page = PAGES[page];

  return (
    <div className="flex">
      <Sidebar open={open} setOpen={setOpen} page={page} />
      <main className="flex-1 p-8">
        <Page />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);