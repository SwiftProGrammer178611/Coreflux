import { createRoot } from "react-dom/client";
import Sidebar from "./Sidebar";

const root = createRoot(document.getElementById('sidebar-root'));
root.render(<Sidebar/>)