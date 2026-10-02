import { AxLabel } from "@/components/daybreak/ax";
import { LostRevenueCalculator } from "@/components/daybreak/LostRevenueCalculator";
import { bookingHref, calculatorTrades } from "@/lib/daybreak";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost revenue calculator",
  robots: { index: false, follow: false },
};

/**
 * The lost-revenue calculator, for screen-sharing on a discovery call: step
 * two of the call on the homepage ("Find your leaks"). Unlisted on purpose:
 * no nav link, not in the sitemap, noindex. The numbers mean more worked out
 * together than filled in alone on the homepage.
 */
export default function CalculatorPage() {
  return (
    <div className="bg-panel pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="container-wide">
        <div className="border-t border-rule pt-6">
          <AxLabel>Your numbers</AxLabel>
        </div>
        <h1 className="font-home mt-10 text-[clamp(2.2rem,4.2vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.03em] text-fg lg:mt-14">
          What are your missed calls worth?
        </h1>
        <p className="mt-4 max-w-md text-[17px] leading-[1.6] text-muted">
          Your numbers, multiplied out, nothing added.
        </p>
        <div className="mt-10 lg:mt-12">
          <LostRevenueCalculator jobValue={calculatorTrades[0].jobValue} href={bookingHref} />
        </div>
      </div>
    </div>
  );
}
