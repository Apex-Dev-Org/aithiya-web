import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="relative bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative">
              <Image
                src="/assets/about-statue.png"
                alt="Lady Justice with the Sri Lankan flag"
                width={1900}
                height={1700}
                className="h-auto w-[560px] max-w-full object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-primary-600">
              About Aythiya
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Justice, made <span className="text-primary-600">accessible</span>{" "}
              to every Sri Lankan.
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Aythiya was built on a simple belief: every citizen deserves to
              understand the law that governs their life. Our AI assistant
              translates complex statutes, court procedures, and legal jargon
              into clear, friendly answers — in your language.
            </p>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Whether you&apos;re facing a tenancy dispute, drafting an
              agreement, or simply curious about your rights, Aythiya is here
              24/7 — fast, private, and free.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              <Stat value="50K+" label="Questions answered" />
              <Stat value="3" label="Languages supported" />
              <Stat value="24/7" label="Always available" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-primary-700">{value}</p>
      <p className="mt-1 text-xs text-slate-500 leading-snug">{label}</p>
    </div>
  );
}
