import { Link } from "react-router-dom";

export function Header() {
  return (
    <div
      className="px-6 py-3 flex items-center justify-between 
  border-b"
    >
      <Link to={"/"}><h1 className="text-xl font-bold">What Does This Video Say</h1></Link>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Feito com 💛 por um 🐍
        </span>
      </div>
    </div>
  );
}
