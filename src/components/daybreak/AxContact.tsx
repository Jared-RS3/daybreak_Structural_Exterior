import { Img } from "@/components/ui/Img";
import { ZoomIn } from "@/components/motion/ZoomIn";
import { DesignForm } from "./DesignForm";
import { AxLabel } from "./ax";

/**
 * The one ask, set as Axion sets its contact block: a darkened photograph,
 * the pitch and what the free design includes on the left, the form on a
 * white panel with a sunrise rule across its top.
 */
export function AxContact({
  label,
  title,
  lede,
  includes,
  email,
  image,
}: {
  label: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  includes: string[];
  email: string;
  image: string;
}) {
  return (
    <section
      id="free-design"
      aria-labelledby="free-design-title"
      className="relative isolate flex min-h-svh scroll-mt-16 items-center overflow-hidden bg-fg"
    >
      <div className="absolute inset-0 -z-10">
        <ZoomIn className="absolute inset-0" from={1.15}>
          <div className="relative size-full">
            <Img src={image} alt="" sizes="100vw" className="opacity-50" />
          </div>
        </ZoomIn>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
      </div>
      <div className="container-wide grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <div className="flex flex-col lg:col-span-5">
          <AxLabel tone="light">{label}</AxLabel>
          <h2 id="free-design-title" className="font-home mt-8 text-[clamp(2.2rem,4vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.03em] text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.6] text-white/80">{lede}</p>
          <div className="mt-10 lg:mt-auto lg:pt-10">
            <p className="mono-label text-[12.5px] text-white/70">What you get</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {includes.map((c) => (
                <li key={c} className="mono-label bg-white/10 px-2.5 py-1.5 text-[12.5px] text-white">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[16.5px] text-white/80">
              Rather email?{" "}
              <a href={`mailto:${email}`} className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                {email}
              </a>
            </p>
          </div>
        </div>
        <div className="border-t-[3px] border-sun bg-white p-6 sm:p-9 lg:col-span-7">
          <DesignForm />
        </div>
      </div>
    </section>
  );
}
