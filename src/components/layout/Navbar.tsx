import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        RET<span>control</span>
      </Link>
      <div className="navbar-links">
        <Link href="#features">Funciones</Link>
        <Link href="#como-funciona">Cómo funciona</Link>
        <Link href="#precios">Precios</Link>
      </div>
      <Link href="#precios" className="navbar-cta">
        Empezar ahora
      </Link>
    </nav>
  );
}