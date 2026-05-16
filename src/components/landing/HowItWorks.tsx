import Image from "next/image";
import { MessageCircleQuestion, BrainCircuit, Scale } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessageCircleQuestion,
    title: "Type Your Question",
    body: "Ask anything about Sri Lankan law in your preferred language — Sinhala, Tamil, or English. No legal jargon needed.",
  },
  {
    n: "02",
    icon: BrainCircuit,
    title: "AI Analyses Instantly",
    body: "Aythiya searches statutes, case law, and trusted sources, then composes a clear, contextual answer in seconds.",
  },
  {
    n: "03",
    icon: Scale,
    title: "Understand & Act",
    body: "Get plain-language guidance with citations, next steps, and links to official resources whenever you need them.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/assets/how-it-works-bg.png"
          alt=""
          fill
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white" />
      </div>

      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary-600">
            Process
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-slate-900">
            How Aythiya AI works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Three simple steps from question to clarity.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative card-elevated rounded-2xl p-7 group hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-600/25">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-4xl font-bold text-primary-100 group-hover:text-primary-200 transition-colors">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {s.body}
              </p>

              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 h-px w-8 lg:w-10 bg-gradient-to-r from-primary-300 to-transparent"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
