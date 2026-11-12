import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Icon } from "@/components/icons";
import { getFacilities, getFacilityBySlug } from "@/lib/data";

import { FacilityDetail } from "./facility-detail";
import { FacilityDetailSkeleton } from "./facility-detail-skeleton";

/**
 * `generateStaticParams` must return at least one param under
 * `cacheComponents` — an empty array is a build error. Returning every slug
 * prerenders each facility plan.
 */
export async function generateStaticParams() {
  const facilities = await getFacilities();
  return facilities.map((facility) => ({ slug: facility.slug }));
}

export async function generateMetadata(
  props: PageProps<"/facilities/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const facility = await getFacilityBySlug(slug);

  if (!facility) {
    return { title: "Facility not found" };
  }

  return { title: facility.name, description: facility.summary };
}

export default function FacilityPage(props: PageProps<"/facilities/[slug]">) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <Link
        href="/facilities"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
      >
        <Icon name="arrow-right" className="size-4 rotate-180" />
        All facilities
      </Link>

      {/*
       * `params` is passed down as a promise instead of being awaited here, so
       * the App Shell this route prefetches doesn't depend on the slug. The
       * slug read and the data load happen inside the boundary and stream in.
       */}
      <Suspense fallback={<FacilityDetailSkeleton />}>
        <FacilityDetail params={props.params} />
      </Suspense>
    </div>
  );
}
