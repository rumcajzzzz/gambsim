"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@styles/navigation.css"; 

export const Navigation = () => {
  const pathName = usePathname();

  const links = [
    { href: "/", text: "Home", icon: "/homeicon.svg"},
    { href: "/leaderboard", text: "Leaderboard", icon: "/leaderboardicon.svg"},
    { href: "/about", text: "About", icon: "/abouticon.svg"},
    { href: "/contact", text: "Contact", icon: "/contacticon.svg"},
  ];

  return (
    <nav className="navbar">
      {links.map((link) => {
        const isActive = pathName === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`link ${isActive ? "link--active" : "link--inactive"}`}
          > 
            {link.icon && <img src={link.icon} alt={link.text} className="w-6 h-6"/>}
          </Link>
        );
      })}
    </nav>
  );
};
