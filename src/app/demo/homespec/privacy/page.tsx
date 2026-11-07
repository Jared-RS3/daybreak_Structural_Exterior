import type { Metadata } from "next";
import { DemoPrivacyNotice } from "@/components/demo/DemoPrivacyNotice";
import { HomeSpecShell } from "@/components/demo/HomeSpecShell";
import { homespec } from "@/lib/demos/homespec";

/* The demo's own privacy notice, linked from the estimate form's consent box
   and the footer. See components/demo/DemoPrivacyNotice.tsx. */

export const metadata: Metadata = {
  title: { absolute: "Privacy Notice | HomeSpec concept by Daybreak StructureWorks" },
  description: "How Daybreak StructureWorks handles what you send through the HomeSpec estimator demo.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function HomeSpecPrivacyPage() {
  return (
    <HomeSpecShell title="Privacy Notice">
      <DemoPrivacyNotice client={homespec.short} effective="November 7, 2026" />
    </HomeSpecShell>
  );
}
