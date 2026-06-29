import type { AppProject } from "@/content/apps";
import { Reveal } from "@/components/ui/Reveal";
import { StoreBadges } from "@/components/apps/StoreBadges";

/** Portrait phone frame wrapping a looping video (or image). */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[260px]">
      <div className="overflow-hidden rounded-[2.2rem] border-[6px] border-[#16151a] bg-black shadow-2xl ring-1 ring-white/10">
        <div style={{ aspectRatio: "9 / 19.3" }} className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AppShowcase({ app, reverse = false }: { app: AppProject; reverse?: boolean }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Phone video */}
      <Reveal className={reverse ? "lg:order-2" : ""}>
        <PhoneFrame>
          {app.video ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={app.video.src}
              poster={app.video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : app.shots[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.shots[0].src} alt={app.shots[0].alt} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
        </PhoneFrame>
      </Reveal>

      {/* Details */}
      <Reveal delay={120} className={reverse ? "lg:order-1" : ""}>
        {app.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.logo} alt={`${app.name} logo`} className="mb-5 h-12 w-auto" />
        )}
        <span className="eyebrow opacity-70">{app.category}</span>
        <h3 className="mt-3" style={{ fontSize: "var(--text-xl)" }}>{app.name}</h3>
        <p className="mt-4 max-w-md text-muted">{app.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {app.features.map((f) => (
            <li key={f} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {f}
            </li>
          ))}
        </ul>

        <StoreBadges appStore={app.stores.appStore} googlePlay={app.stores.googlePlay} className="mt-8" />
      </Reveal>

      {/* Screenshot strip (full width under the two columns) */}
      {app.shots.length > 1 && (
        <div className="lg:col-span-2">
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {app.shots.map((s) => (
              <div
                key={s.src}
                className="w-[150px] shrink-0 overflow-hidden rounded-[1.4rem] border-[5px] border-[#16151a] bg-black shadow-xl"
              >
                <div style={{ aspectRatio: "9 / 19.3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
