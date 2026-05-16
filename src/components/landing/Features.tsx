import Image from "next/image";
import {
  MessageSquareText,
  FileText,
  Search,
  Mic,
  FolderLock,
  Languages,
  Clock,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareText,
    title: "AI Legal Chat",
    body: "Conversational answers grounded in Sri Lankan statutes and case law.",
  },
  {
    icon: FileText,
    title: "Document Help",
    body: "Draft, review, and explain agreements, notices, and affidavits.",
  },
  {
    icon: Search,
    title: "Case Search",
    body: "Find precedents and judgments relevant to your question instantly.",
  },
  {
    icon: Mic,
    title: "Voice Support",
    body: "Speak your question — Aythiya listens, transcribes, and replies.",
  },
  {
    icon: FolderLock,
    title: "Private File Storage",
    body: "Store sensitive documents securely with end-to-end encryption.",
  },
  {
    icon: Languages,
    title: "Sinhala · Tamil · English",
    body: "Native multilingual responses, written exactly the way you ask.",
  },
  {
    icon: Clock,
    title: "24 / 7 Availability",
    body: "Get answers any hour of any day — no appointments, no waiting.",
  },
  {
    icon: BadgeCheck,
    title: "Free to Get Started",
    body: "Core legal guidance is free for every citizen, forever.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/assets/what-we-do-bg.png"
          alt=""
          fill
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white" />
      </div>

      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary-600">
            Capabilities
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-slate-900">
            What You Can Do with Aythiya
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to navigate the law — in one beautifully simple
            assistant.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group card-elevated rounded-2xl p-6 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-primary-600/10"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
