"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/navigation.css"; 

export const Navigation = () => {
  const pathName = usePathname();

  const links = [
    { href: "/", text: "Home"},
    { href: "/about", text: "About"},
    { href: "/contact", text: "Contact"},
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
            {link.text}
          </Link>
        );
      })}
    </nav>
  );
};
