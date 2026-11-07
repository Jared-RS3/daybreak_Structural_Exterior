import type { Metadata } from "next";
import { DemoPrivacyNotice } from "@/components/demo/DemoPrivacyNotice";
import { SoutheastShell } from "@/components/demo/SoutheastShell";
import { southeast } from "@/lib/demos/southeast";

/* The demo's own privacy notice, linked from the estimate form's consent box
   and the footer. See components/demo/DemoPrivacyNotice.tsx. */

export const metadata: Metadata = {
  title: { absolute: "Privacy Notice | Southeast Crawlspace Consulting concept by Daybreak StructureWorks" },
  description: "How Daybreak StructureWorks handles what you send through the Southeast Crawlspace Consulting estimator demo.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function SoutheastPrivacyPage() {
  return (
    <SoutheastShell title="Privacy Notice">
      <DemoPrivacyNotice client={southeast.short} effective="November 7, 2026" />
    </SoutheastShell>
  );
}
