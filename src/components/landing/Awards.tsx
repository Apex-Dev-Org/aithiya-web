import Image from "next/image";

const awards = [
  {
    title: "Innovation in LegalTech",
    org: "Sri Lanka Tech Awards 2025",
    note: "Recognized for democratizing legal access through AI.",
  },
  {
    title: "Best AI Product",
    org: "South Asia Build Summit 2025",
    note: "Awarded for impact in multilingual legal assistance.",
  },
  {
    title: "Citizen Empowerment Award",
    org: "Digital Sri Lanka Forum 2025",
    note: "For making the law understandable to every Sri Lankan.",
  },
];

export default function Awards() {
  return (
    <section className="bg-white pb-20">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {awards.map((a) => (
            <div
              key={a.title}
              className="card-elevated rounded-2xl px-6 py-7 text-center"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/laurel.png"
                  alt=""
                  width={220}
                  height={120}
                  className="h-20 w-auto"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                {a.title}
              </h3>
              <p className="mt-1 text-xs font-semibold tracking-wide text-primary-700 uppercase">
                {a.org}
              </p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {a.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
