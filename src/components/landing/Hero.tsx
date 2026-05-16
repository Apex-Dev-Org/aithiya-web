import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Gift,
  Languages,
  Play,
  Send,
  Scale,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[580px] overflow-hidden xl:min-h-[760px]">
      <div aria-hidden className="absolute inset-0 -z-20">
      <Image
  src="/assets/hero-tower.png"
  alt=""
  width={1920}
  height={2800}
  priority
  className="h-[760px] w-full object-fill"
/>
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-white" />
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-white/55 via-white/20 to-transparent" />
      </div>

      <div className="mx-auto w-full px-8 pt-[135px] pb-20 sm:px-9 lg:px-[50px] 2xl:px-[70px] 2xl:pt-[175px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 2xl:gap-16">
          <div className="animate-fade-in-up lg:col-span-6">
            <p className="font-sinhala text-[30px] font-medium leading-[1.2] text-slate-800 sm:text-[34px] 2xl:text-[54px]">
              දන්නවාද
              <br />
              ඔබේ අයිතිවාසිකම
            </p>

            <h1 className="mt-3 font-display text-[48px] font-bold leading-[1.04] tracking-tight text-primary-600 sm:text-[54px] 2xl:mt-4 2xl:text-[86px]">
              Know Your Rights.
            </h1>

            <p className="mt-4 max-w-[405px] text-[15px] leading-relaxed text-slate-600 2xl:max-w-[620px] 2xl:text-[22px]">
              Describe what happened. We&apos;ll help you understand what the
              law may say — and what to do next.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 2xl:mt-10 2xl:gap-4">
              <a
                href="#chat"
                className="inline-flex h-9 min-w-[106px] items-center justify-center rounded-lg bg-primary-600 px-6 text-xs font-bold text-white shadow-lg shadow-primary-600/25 transition-all hover:-translate-y-0.5 hover:bg-primary-700 2xl:h-14 2xl:min-w-[160px] 2xl:rounded-xl 2xl:text-base"
              >
                Try now
              </a>
              <a
                href="#how"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-4 text-xs font-bold text-primary-600 backdrop-blur transition-colors hover:border-primary-300 hover:text-primary-700 2xl:h-14 2xl:rounded-xl 2xl:px-6 2xl:text-base"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-100 text-primary-600 2xl:h-6 2xl:w-6">
                  <Play className="h-2.5 w-2.5 fill-current 2xl:h-3.5 2xl:w-3.5" />
                </span>
                Learn how it works
              </a>
            </div>

            <div className="mt-8 inline-flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur 2xl:mt-10 2xl:gap-4 2xl:px-6 2xl:py-4">
              <Pill icon={Sparkles} label="Powered by AI" iconClass="text-primary-600" />
              <Pill icon={ShieldCheck} label="Confidential" iconClass="text-emerald-600" />
              <Pill icon={Gift} label="Free to use" iconClass="text-primary-600" />
              <Pill icon={Languages} label="Sinhala + English" iconClass="text-amber-600" />
            </div>
          </div>

          <div
            className="animate-fade-in-up lg:col-span-6"
            style={{ animationDelay: "120ms" }}
          >
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({
  icon: Icon,
  label,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconClass?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 2xl:text-sm">
      <Icon className={`h-3.5 w-3.5 2xl:h-4 2xl:w-4 ${iconClass ?? ""}`} />
      {label}
    </span>
  );
}

function ChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] lg:ml-auto lg:max-w-[380px] xl:max-w-[430px] 2xl:max-w-[560px]">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary-200/50 to-white/0 blur-2xl"
      />

      <div className="relative rounded-3xl border border-white/70 bg-white/35 p-3 shadow-2xl shadow-primary-900/10 backdrop-blur-md 2xl:p-5">
        <div className="flex items-center justify-between border-b border-white/50 pb-3 2xl:pb-5">
          <div className="flex items-center gap-2.5 2xl:gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-md shadow-primary-600/30 2xl:h-14 2xl:w-14 2xl:rounded-xl">
              <Scale className="h-4 w-4 text-white 2xl:h-7 2xl:w-7" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-slate-900 2xl:text-xl">
                LAW AI
              </p>
              <p className="text-[11px] text-slate-500 2xl:text-sm">AI Legal Assistant</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 2xl:px-3 2xl:py-1.5 2xl:text-sm">
            <span className="relative flex h-2 w-2 2xl:h-2.5 2xl:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Online
          </span>
        </div>

        <div className="no-scrollbar max-h-[300px] space-y-3 overflow-y-auto py-4 2xl:max-h-[440px] 2xl:space-y-5 2xl:py-6">
          <div className="flex justify-end">
            <div className="max-w-[86%] rounded-2xl rounded-br-md bg-primary-100 px-3 py-2 text-[11px] leading-snug text-slate-800 shadow-sm 2xl:px-5 2xl:py-4 2xl:text-base">
              <p>
                I haven&apos;t received my salary for 2 months. What can I do?
              </p>
              <p className="mt-1 text-right text-[9px] text-slate-500 2xl:mt-2 2xl:text-xs">
                10:34 AM
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-slate-200/70 bg-white px-3 py-3 text-[11px] leading-snug text-slate-700 shadow-sm 2xl:px-5 2xl:py-5 2xl:text-base">
              <p>
                This may involve your right to receive wages under Sri Lankan
                law.
              </p>

              <p className="mt-3 text-[11px] font-bold text-slate-900 2xl:mt-4 2xl:text-base">
                You may have the right to:
              </p>
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 2xl:space-y-1 2xl:text-[15px]">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary-500" />
                  Receive all unpaid salary
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary-500" />
                  Interest for delay
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary-500" />
                  Make a complaint to the Labour Department
                </li>
              </ul>

              <p className="mt-3 text-[11px] font-bold text-slate-900 2xl:mt-4 2xl:text-base">
                Next steps you can take:
              </p>
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 2xl:space-y-1 2xl:text-[15px]">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary-500" />
                  Send a written request to your employer
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary-500" />
                  Keep records of payment due
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary-500" />
                  File a complaint if not resolved
                </li>
              </ul>

              <p className="mt-2 text-right text-[9px] text-slate-400 2xl:text-xs">
                10:34 AM
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm 2xl:px-5 2xl:py-4">
          <input
            type="text"
            placeholder="Ask anything about your situation…"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-slate-700 placeholder:text-slate-400 focus:outline-none 2xl:text-base"
            readOnly
          />
          <button
            className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 2xl:h-11 2xl:w-11"
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5 2xl:h-5 2xl:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
