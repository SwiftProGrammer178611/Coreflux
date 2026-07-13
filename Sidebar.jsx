import {useState} from 'react';

const navLinks =[
    {icon:'⚡', label: 'Power Ups'},
    {icon:'', label: 'Link1'},
    {icon:'', label:'Shop'},
    {icon:'', label:"Settings"}
]

export default function Sidebar(){
    const [open, setOpen] = useState(false);
     
    return(
        <div className = {`bg-red-500 h-screen p-5 pt-8 transition-all duration-300 overflow-hidden relative ${open? 'w-72' : 'w-20'}`}>
            <button onClick={()=>setOpen(!open)}
            className = "bg-white text-red-800 text-3xl rounded-full absolute -right-3 top-9 border-red-900 cursor-pointer w-10 h-10 flex items-center justify-center">
                <img src="/images/Blue-Striped-Horizontal.png" className="w-8 h-8" alt="toggle" />
                </button>
                
                <nav className="mt-16 flex flex-col gap-5">
                    {navLinks.map((item)=> (
                        <div key={item.label} className='flex items-center gap-3 text-white'>
                            <span className='text-2xl'>{item.icon}</span>
                            {open && <span className='whitespace-nowrap'>{item.label}</span>}
                        </div>
                    ))}
                </nav>
        </div>  
    );
}