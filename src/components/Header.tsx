import { Link } from "react-router-dom";

export function Header() {
  return (
    <header
      className="px-6 py-3 flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between 
   container"
    >
      <Link to={"/"}><h1 className="text-xl font-bold text-center">What Does This Video Say</h1></Link>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground text-center">
          Feito com 💛 por um 🐍
        </span>
      </div>
    </header>
  );
}
