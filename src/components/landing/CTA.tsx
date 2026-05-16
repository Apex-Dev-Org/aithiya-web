import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-24">
      <div className="container-page">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-primary-200/40 blur-3xl"
          />

          <div className="flex justify-center">
            <Image
              src="/assets/cta-decorative.png"
              alt="Aythiya — defending the rights of every Sri Lankan"
              width={1200}
              height={780}
              className="w-full max-w-3xl h-auto"
            />
          </div>

          <div className="relative -mt-6 sm:-mt-10 text-center">
            <div className="inline-flex flex-col items-center">
              <Image
                src="/assets/logo.png"
                alt="Aythiya"
                width={140}
                height={48}
                className="h-12 w-auto"
              />
            </div>

            <h2 className="mt-6 font-display text-3xl sm:text-5xl font-bold text-slate-900 max-w-3xl mx-auto leading-tight">
              Have a Legal Query? Ask for Free.
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of Sri Lankans using Aythiya every day to
              understand their rights, draft documents, and stay one step ahead
              of the law.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#chat"
                className="group inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all hover:-translate-y-0.5"
              >
                Ask Aythiya now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                Explore features
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
