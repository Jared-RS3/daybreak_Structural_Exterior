import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";

/* ==========================================================================
   Mock contractor homepages for the agency's work showcase.

   Each is a miniature, fixed-proportion website drawn in code rather than a
   screenshot, so it stays sharp at any size. Every measurement is in `cqw`
   (a percentage of the frame's width), which makes the whole page scale as
   one picture. The companies are invented; the showcase labels them as
   concepts. They are illustrations, so the whole tree is aria-hidden and
   contains no real links. Prices and figures inside them are drawn furniture.
   ========================================================================== */

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden className={`relative aspect-[16/10] overflow-hidden ${className}`} style={{ containerType: "inline-size" }}>
      {children}
    </div>
  );
}

const star = (cls: string) => <Icon name="star" filled className={cls} />;
const stars = (cls: string) => (
  <span className="flex">
    {star(cls)}
    {star(cls)}
    {star(cls)}
    {star(cls)}
    {star(cls)}
  </span>
);


/* ---- 1. Cornerstone — premium foundation repair, navy and gold ---- */
export function CornerstoneMock() {
  return (
    <Frame className="bg-white text-[#0c274c]">
      <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.15cqw]">
        <span className="flex items-center gap-[0.9cqw]">
          <span className="flex size-[2.6cqw] items-center justify-center border-[0.2cqw] border-[#0c274c]">
            <span className="size-[1cqw] bg-[#c9ad85]" />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[1.9cqw] font-semibold tracking-[0.04em]">CORNERSTONE</span>
            <span className="block text-[0.85cqw] uppercase tracking-[0.3em] text-[#0c274c]/60">Foundation repair</span>
          </span>
        </span>
        <span className="flex gap-[2.4cqw] uppercase tracking-[0.12em] text-[#0c274c]/75">
          <span>About</span>
          <span>Repairs</span>
          <span>Crawl spaces</span>
          <span>Projects</span>
          <span>Reviews</span>
        </span>
        <span className="bg-[#0c274c] px-[1.6cqw] py-[0.9cqw] font-semibold uppercase tracking-[0.1em] text-white">Free inspection</span>
      </div>
      <div className="grid grid-cols-[0.95fr_1.25fr] gap-[3cqw] px-[4cqw] pt-[1.6cqw]">
        <div className="pt-[3cqw]">
          <p className="flex items-center gap-[1cqw] text-[1.05cqw] font-semibold uppercase tracking-[0.24em] text-[#0c274c]/70">
            <span className="h-px w-[3cqw] bg-[#c9ad85]" />
            Engineered. Warrantied. For life.
          </p>
          <p className="mt-[2cqw] font-serif text-[4.6cqw] leading-[1.02] tracking-[-0.01em]">
            Stronger Foundations for <span className="text-[#a8875a]">Lasting Homes</span>
          </p>
          <p className="mt-[2cqw] max-w-[32cqw] text-[1.4cqw] leading-[1.55] text-[#0c274c]/70">
            Steel piers driven to load-bearing soil, an engineer&rsquo;s letter with every repair, and a warranty that
            transfers when you sell.
          </p>
          <span className="mt-[2.6cqw] inline-flex items-center gap-[1cqw] bg-[#0c274c] px-[2cqw] py-[1.2cqw] text-[1.25cqw] font-semibold uppercase tracking-[0.1em] text-white">
            Check my foundation →
          </span>
          <div className="mt-[3.2cqw] flex gap-[2.6cqw] text-[1cqw] uppercase tracking-[0.12em] text-[#0c274c]/65">
            <span>Lifetime warranty</span>
            <span>Licensed P.E.</span>
            <span className="flex items-center gap-[0.5cqw]">{stars("size-[1.2cqw] text-[#c9ad85]")} 4.9</span>
          </div>
        </div>
        <div className="relative h-[46cqw] overflow-hidden">
          <Img src="/images/project-brick-ranch.jpg" alt="" sizes="(min-width:1024px) 34vw, 60vw" />
          <div className="absolute inset-x-[6cqw] bottom-[11cqw] flex justify-between">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="flex flex-col items-center gap-[0.4cqw]">
                <span className="bg-white/90 px-[0.6cqw] py-[0.2cqw] text-[0.85cqw] font-semibold">P{n}</span>
                <span className="size-[1cqw] rounded-full border-[0.25cqw] border-white bg-[#c9ad85]" />
              </span>
            ))}
          </div>
          <div className="absolute bottom-[2cqw] right-[2cqw] w-[24cqw] bg-white p-[1.6cqw] shadow-2xl">
            <p className="flex items-center justify-between text-[1cqw] font-semibold uppercase tracking-[0.14em]">
              Elevation survey <span className="text-[#a8875a]">●</span>
            </p>
            <div className="mt-[1cqw] grid grid-cols-3 gap-[0.6cqw] text-[0.95cqw]">
              {[
                ["Max drop", "1.8 in"],
                ["Over", "30 ft"],
                ["Piers", "14"],
              ].map(([k, v]) => (
                <span key={k} className="bg-[#f4f1ec] px-[0.7cqw] py-[0.6cqw]">
                  <span className="block text-[#0c274c]/60">{k}</span>
                  <span className="block text-[1.3cqw] font-semibold">{v}</span>
                </span>
              ))}
            </div>
            <p className="mt-[1cqw] font-serif text-[2cqw]">$19,400 – $24,900</p>
            <span className="mt-[0.8cqw] block bg-[#0c274c] py-[0.8cqw] text-center text-[1cqw] font-semibold uppercase tracking-[0.12em] text-white">
              Book free inspection
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---- 2. Bedrock — foundation repair, dark and bold ---- */
export function BedrockMock() {
  return (
    <Frame className="bg-[#14181d] font-sans text-white">
      <Img src="/images/foundation-excavation.jpg" alt="" sizes="(min-width:1024px) 60vw, 100vw" className="opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#14181d] via-[#14181d]/85 to-[#14181d]/20" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.2cqw]">
        <span className="flex items-center gap-[0.8cqw] font-numeric text-[1.9cqw] font-bold uppercase tracking-[0.06em]">
          <span className="inline-block h-[1.6cqw] w-[2.4cqw] bg-[#ff6a1a] [clip-path:polygon(0_100%,50%_0,100%_100%)]" /> Bedrock
        </span>
        <span className="flex gap-[2.4cqw] text-white/80">
          <span>Foundation</span>
          <span>Piers</span>
          <span>Drainage</span>
          <span>Reviews</span>
        </span>
        <span className="rounded-[0.4cqw] bg-[#ff6a1a] px-[1.6cqw] py-[0.8cqw] font-semibold">(214) 555-0188</span>
      </div>
      <div className="absolute left-[4cqw] top-[16cqw] w-[50cqw]">
        <p className="font-numeric text-[1.3cqw] font-semibold uppercase tracking-[0.2em] text-[#ff8a4a]">Dallas · Plano · Frisco</p>
        <p className="mt-[1.4cqw] font-numeric text-[6.2cqw] font-bold uppercase leading-[0.92]">
          Cracks fixed
          <br />
          at the source.
        </p>
        <p className="mt-[2cqw] max-w-[42cqw] text-[1.5cqw] leading-[1.5] text-white/80">
          Free elevation surveys, steel piers to bedrock and a lifetime warranty that transfers with the house.
        </p>
        <div className="mt-[2.6cqw] flex w-[44cqw] items-center rounded-[0.5cqw] bg-white p-[0.6cqw] text-[1.3cqw]">
          <span className="flex-1 px-[1.2cqw] text-[#6b7280]">Is your crack serious? Check it in 30 seconds</span>
          <span className="rounded-[0.4cqw] bg-[#ff6a1a] px-[1.8cqw] py-[1cqw] font-semibold text-white">Check it</span>
        </div>
        <div className="mt-[2.4cqw] flex items-center gap-[2.4cqw] text-[1.2cqw] text-white/80">
          <span className="flex items-center gap-[0.5cqw]">
            {stars("size-[1.4cqw] text-[#ffb020]")}
            4.9 Google
          </span>
          <span>Engineer-approved</span>
          <span>Licensed &amp; insured</span>
        </div>
      </div>
      <div className="absolute right-[4cqw] top-[18cqw] w-[26cqw] rounded-[0.8cqw] bg-white p-[1.8cqw] text-[#14181d] shadow-2xl">
        <p className="text-[1.1cqw] font-semibold uppercase tracking-[0.12em] text-[#ff6a1a]">Crack check</p>
        <div className="relative mt-[1.2cqw] aspect-[4/3] overflow-hidden rounded-[0.5cqw]">
          <Img src="/images/foundation-crack-brick.jpg" alt="" sizes="240px" />
          <span className="absolute left-[1cqw] top-[1cqw] rounded-full bg-[#fff4d6] px-[1cqw] py-[0.4cqw] text-[1cqw] font-semibold text-[#8a5a00]">
            ● Worth an inspection
          </span>
        </div>
        <p className="mt-[1.2cqw] font-numeric text-[2.4cqw] font-bold">$5,400 – $14,000</p>
        <p className="text-[1.1cqw] text-[#6b7280]">Stair-step crack · if it&rsquo;s settlement, 4–8 piers</p>
      </div>
    </Frame>
  );
}

/* ---- 3. DryLine — crawl spaces, clean and clinical ---- */
export function DryLineMock() {
  return (
    <Frame className="bg-[#eef2ee] text-[#18322a]">
      <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.2cqw]">
        <span className="font-display text-[2cqw] font-extrabold tracking-[-0.03em]">
          dryline<span className="text-[#2f8f6f]">.</span>
        </span>
        <span className="flex gap-[2.4cqw] text-[#18322a]/70">
          <span>Encapsulation</span>
          <span>Vapor barriers</span>
          <span>Dehumidifiers</span>
          <span>Our work</span>
        </span>
        <span className="rounded-full border border-[#18322a]/30 px-[1.6cqw] py-[0.7cqw]">Free inspection</span>
      </div>
      <div className="grid grid-cols-[1fr_1fr] gap-[3cqw] px-[4cqw] pt-[3cqw]">
        <div className="pt-[2cqw]">
          <p className="text-[1.2cqw] font-semibold uppercase tracking-[0.18em] text-[#2f8f6f]">Crawl space · Fort Worth</p>
          <p className="mt-[1.6cqw] font-display text-[5cqw] font-bold leading-[0.98] tracking-[-0.04em]">
            That musty smell starts under the floor.
          </p>
          <p className="mt-[2cqw] max-w-[36cqw] text-[1.5cqw] leading-[1.55] text-[#18322a]/70">
            A 20-mil liner, sealed vents and a dehumidifier sized to the space. Humidity measured before and
            after, priced in writing.
          </p>
          <div className="mt-[2.6cqw] flex gap-[1cqw] text-[1.3cqw] font-semibold">
            <span className="rounded-full bg-[#18322a] px-[2cqw] py-[1.1cqw] text-white">Book a crawl space check</span>
            <span className="rounded-full border border-[#18322a]/30 px-[2cqw] py-[1.1cqw]">See before &amp; after</span>
          </div>
          <div className="mt-[3.4cqw] grid grid-cols-3 border-t border-[#18322a]/15 pt-[1.6cqw]">
            {[
              ["20-mil", "Reinforced liner"],
              ["52%", "Humidity after"],
              ["25 yr", "Liner warranty"],
            ].map(([v, l]) => (
              <span key={l}>
                <span className="block font-display text-[2.6cqw] font-bold tracking-[-0.03em]">{v}</span>
                <span className="block text-[1.1cqw] text-[#18322a]/60">{l}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="relative h-[46cqw] overflow-hidden rounded-t-[16cqw]">
          <Img src="/images/crawl-foam.jpg" alt="" sizes="(min-width:1024px) 30vw, 50vw" />
          <span className="absolute bottom-[2cqw] left-[2cqw] rounded-full bg-white px-[1.6cqw] py-[0.8cqw] text-[1.2cqw] font-semibold">
            Aledo · 1,840 sq ft · 78% → 52% humidity
          </span>
        </div>
      </div>
    </Frame>
  );
}

/* ---- 4. Clapboard & Co. — siding, full-bleed and calm ---- */
export function ClapboardMock() {
  return (
    <Frame className="bg-[#1d2a38] text-white">
      <Img src="/images/siding-white-colonial.jpg" alt="" sizes="(min-width:1024px) 60vw, 100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1d2a38]/85 via-[#1d2a38]/50 to-[#1d2a38]/90" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.2cqw]">
        <span className="font-home text-[2cqw] font-semibold tracking-[-0.02em]">Clapboard &amp; Co.</span>
        <span className="flex gap-[2.4cqw] text-white/85">
          <span>Fiber cement</span>
          <span>Vinyl</span>
          <span>Trim</span>
          <span>Gallery</span>
        </span>
        <span className="rounded-full bg-[#f1ece2] px-[1.6cqw] py-[0.8cqw] font-semibold text-[#1d2a38]">Free estimate</span>
      </div>
      <div className="absolute inset-x-0 top-[13cqw] text-center">
        <p className="text-[1.2cqw] uppercase tracking-[0.24em] text-white/80">Siding &amp; exterior · Keller, TX</p>
        <p className="mt-[1.4cqw] font-home text-[6cqw] font-medium leading-[1] tracking-[-0.04em]">
          Siding that outlasts
          <br />
          the weather.
        </p>
        <p className="mx-auto mt-[1.8cqw] max-w-[44cqw] text-[1.5cqw] leading-[1.5] text-white/85">
          James Hardie® fiber cement, installed to spec, with the HOA paperwork handled for you.
        </p>
      </div>
      <div className="absolute inset-x-[8cqw] bottom-[3cqw] flex items-center gap-[1.4cqw] rounded-[1.2cqw] bg-[#f1ece2] p-[1.2cqw] text-[1.3cqw] text-[#1d2a38]">
        <span className="rounded-[0.8cqw] bg-white px-[1.6cqw] py-[1cqw]">
          <span className="block text-[1cqw] uppercase tracking-[0.12em] text-[#1d2a38]/60">Home</span>
          <span className="font-semibold">2 stories</span>
        </span>
        <span className="rounded-[0.8cqw] bg-white px-[1.6cqw] py-[1cqw]">
          <span className="block text-[1cqw] uppercase tracking-[0.12em] text-[#1d2a38]/60">Siding</span>
          <span className="font-semibold">Hardie lap, Iron Gray</span>
        </span>
        <span className="rounded-[0.8cqw] bg-white px-[1.6cqw] py-[1cqw]">
          <span className="block text-[1cqw] uppercase tracking-[0.12em] text-[#1d2a38]/60">Trim</span>
          <span className="font-semibold">Arctic White</span>
        </span>
        <span className="ml-auto text-right">
          <span className="block text-[1cqw] uppercase tracking-[0.12em] text-[#1d2a38]/60">Estimated</span>
          <span className="font-home text-[2.1cqw] font-semibold">$24,500 – $31,000</span>
        </span>
        <span className="rounded-full bg-[#1d2a38] px-[1.8cqw] py-[1.1cqw] font-semibold text-white">Book a visit</span>
      </div>
    </Frame>
  );
}

/* ---- 5. Keystone — basements & foundations, bright and gallery-led ---- */
export function KeystoneMock() {
  return (
    <Frame className="bg-white text-[#1d1d1f]">
      <div className="flex items-center justify-between px-[4cqw] py-[2.2cqw] text-[1.2cqw]">
        <span className="flex items-center gap-[0.8cqw] font-home text-[2cqw] font-semibold tracking-[-0.03em]">
          <span className="grid size-[2cqw] grid-cols-2 gap-[0.25cqw]">
            <span className="bg-[#2458c6]" />
            <span className="bg-[#b9ccf0]" />
            <span className="bg-[#b9ccf0]" />
            <span className="bg-[#2458c6]" />
          </span>
          Keystone
        </span>
        <span className="flex gap-[2.4cqw] text-[#1d1d1f]/65">
          <span>Basements</span>
          <span>Foundations</span>
          <span>Crawl spaces</span>
          <span>Projects</span>
        </span>
        <span className="rounded-[0.6cqw] bg-[#2458c6] px-[1.6cqw] py-[0.8cqw] font-semibold text-white">Book an inspection</span>
      </div>
      <div className="grid grid-cols-[1.55fr_1fr] gap-[1.2cqw] px-[4cqw]">
        <div className="relative h-[47cqw] overflow-hidden rounded-[1.2cqw]">
          <Img src="/images/basement-finished.jpg" alt="" sizes="(min-width:1024px) 38vw, 60vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-[2cqw] top-[2cqw] rounded-full bg-white px-[1.4cqw] py-[0.6cqw] text-[1.1cqw] font-semibold">After</span>
          <div className="absolute bottom-[3cqw] left-[3cqw] right-[3cqw] text-white">
            <p className="font-home text-[4.4cqw] font-medium leading-[1] tracking-[-0.04em]">Dry basements. Level floors. For good.</p>
            <div className="mt-[2cqw] flex gap-[1cqw] text-[1.3cqw] font-semibold">
              <span className="rounded-[0.6cqw] bg-white px-[1.8cqw] py-[1cqw] text-[#1d1d1f]">Check my crack</span>
              <span className="rounded-[0.6cqw] border border-white/60 px-[1.8cqw] py-[1cqw]">View projects</span>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-[1fr_1fr_auto] gap-[1.2cqw]">
          <div className="relative overflow-hidden rounded-[1.2cqw]">
            <Img src="/images/basement-block-crack.jpg" alt="" sizes="(min-width:1024px) 24vw, 40vw" />
            <span className="absolute left-[1.2cqw] top-[1.2cqw] rounded-full bg-white px-[1.2cqw] py-[0.5cqw] text-[1.1cqw] font-semibold">Before</span>
          </div>
          <div className="relative overflow-hidden rounded-[1.2cqw]">
            <Img src="/images/foundation-underpin.jpg" alt="" sizes="(min-width:1024px) 24vw, 40vw" />
            <span className="absolute left-[1.2cqw] top-[1.2cqw] rounded-full bg-white px-[1.2cqw] py-[0.5cqw] text-[1.1cqw] font-semibold">Underpinning</span>
          </div>
          <div className="flex items-center justify-between rounded-[1.2cqw] bg-[#edf2fc] px-[1.6cqw] py-[1.4cqw] text-[1.2cqw]">
            <span>
              <span className="block font-home text-[2.2cqw] font-semibold text-[#2458c6]">Lifetime</span>
              <span className="text-[#1d1d1f]/60">transferable warranty</span>
            </span>
            {stars("size-[1.4cqw] text-[#2458c6]")}
          </div>
        </div>
      </div>
    </Frame>
  );
}
