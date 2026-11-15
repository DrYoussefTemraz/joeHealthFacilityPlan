import type { Metadata } from "next";

import { PlannerShell } from "@/components/planner/planner-shell";
import { getPlannerCatalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hotel building planner",
  description:
    "Build a virtual hotel floor by floor and choose the devices, equipment, guest furniture, public furniture and machines for every guest room and back-of-house space.",
};

export default async function HotelPlannerPage() {
  const catalog = await getPlannerCatalog("hospitality");

  return <PlannerShell vertical="hospitality" catalog={catalog} />;
}
