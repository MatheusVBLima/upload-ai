import { Link } from "react-router-dom";
import {ArrowUpRight} from 'lucide-react'

export function Header() {
  return (
    <header
      className="px-6 py-3 flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between 
   container"
    >
      <Link to={"/"}><h1 className="text-xl font-bold text-center">What Does This Video Say</h1></Link>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground text-center flex items-center gap-2">
          Made with 💛 by <Link to="https://www.linkedin.com/in/matheusvblima/" target="_blank" className="flex items-center gap-0.5 underline"><span>Matheus Lima</span> <ArrowUpRight size={15}/></Link>
        </span>
      </div>
    </header>
  );
}
