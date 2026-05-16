"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Languages } from "lucide-react";

const navLinks = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#help", label: "Help" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full">
      <nav className="mx-auto flex h-[74px] w-full items-center justify-between px-8 sm:px-9 lg:px-[50px] 2xl:h-[88px] 2xl:px-[70px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Aythiya"
            width={140}
            height={56}
            className="h-[46px] w-auto 2xl:h-16"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-7 2xl:gap-9">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-medium text-slate-700 transition-colors hover:text-primary-600 2xl:text-sm"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-1.5 border-l border-slate-300/70 pl-4 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700 2xl:text-sm">
            <Languages className="h-3.5 w-3.5 text-slate-500 2xl:h-4 2xl:w-4" />
            EN
          </button>
          <Link
            href="#chat"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-600/25 transition-colors hover:bg-primary-700 2xl:px-6 2xl:py-3 2xl:text-sm"
          >
            Start Your Case
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100/60"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-4 mt-2 rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-lg">
          <div className="space-y-1 px-3 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="#chat"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-primary-600 px-4 py-2.5 text-center text-base font-semibold text-white hover:bg-primary-700"
            >
              Start Your Case
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
