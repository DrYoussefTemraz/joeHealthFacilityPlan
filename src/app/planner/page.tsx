import type { Metadata } from "next";

import { PlannerShell } from "@/components/planner/planner-shell";
import { getPlannerCatalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hospital building planner",
  description:
    "Build a virtual hospital floor by floor and choose the devices, equipment, medical furniture, non-medical furniture and machines for every room.",
};

export default async function HospitalPlannerPage() {
  const catalog = await getPlannerCatalog("healthcare");

  return <PlannerShell vertical="healthcare" catalog={catalog} />;
}
