"use client";
import LaunchGameButton from "./LaunchGameButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GradientBorderButton from "./GradientBorderButton";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    {
      name: "Home",
      path: "/",
      classes: "text-hover-gradient-home",
    },
    {
      name: "Game",
      path: "/game",
      classes: "text-hover-gradient-game",
    },
    {
      name: "Bank",
      path: "/bank",
      classes: "text-hover-gradient-bank",
    },
  ];

  return (
    <nav className="bg-[#070005] fixed w-full z-20">
      <div className="flex w-full items-center justify-between py-6 px-8">
        <a href="/" className="font-mono text-3xl  " style={{letterSpacing:"6px"}}>
        <span className="bg-clip-text text-transparent uppercase font-extrabold bg-gradient-to-r from-red-magic to-blue-magic">
            Cosmos-Casino
          </span>
        </a>

        <div className="font-display flex gap-12">
          {navLinks?.map(({ name, path, classes }, index) => (
            <Link
              className={`${classes} ${
                path === pathname ? "before:opacity-0" : ""
              }`}
              key={index}
              href={path}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="buttons flex  gap-3">
          {false ? (
            <>
              <GradientBorderButton classes={"text-white"}>
                {account ? account?.address.slice(0, 6) + "..." + account?.address?.slice(-10) : "Connect Wallet"}
              </GradientBorderButton>
            </>
          ) : (
            <>
              <LaunchGameButton />
            </>
          )}
        </div>
      </div>
      <div className="w-full h-0.5 magic-gradient"></div>
    </nav>
  );
}
