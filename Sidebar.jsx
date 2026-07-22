import {Link} from "react-router";
import {NAV_ITEMS} from "./navItems";

export default function Sidebar({ open, setOpen, page }) {
    return (
        <div className={`bg-red-500 h-screen p-5 pt-8 transition-all duration-300 overflow-hidden relative ${open ? "w-72" : "w-20"}`}>
            <button onClick={() => setOpen(!open)} className="bg-white text-red-800 text-3xl rounded-full absolute -right-3 top-9 border-red-900 cursor-pointer w-10 h-10 flex items-center justify-center">
                <img src="/Blue-Striped-Horizontal.png" className="w-8 h-8" alt="toggle" />
            </button>

            <nav className = "mt-16 flex flex-col gap-5">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 text-white cursor-pointer ${page === item.path ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        {open && <span className="whitespace-nowrap">{item.label}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
