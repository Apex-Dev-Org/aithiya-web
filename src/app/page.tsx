"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LawAreas from "./components/LawAreas";
import About from "./components/About";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LawAreas />
        <About />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
