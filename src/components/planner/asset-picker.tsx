"use client";

import { useMemo, useState } from "react";

import { assetCategoryLabels } from "@/components/labels";
import { formatCurrency } from "@/lib/format";
import {
  getCompatibleAssets,
  groupAssetsByCategory,
  type RecommendedAssetView,
} from "@/lib/planner";
import type { PlannerCatalog, RoomTemplate } from "@/lib/types";

type AssetPickerProps = {
  room: RoomTemplate;
  catalog: PlannerCatalog;
  placedAssetIds: Set<string>;
  recommended: RecommendedAssetView[];
  onAddAsset: (assetId: string) => void;
  onAddRecommended: () => void;
  onAddRecommendedItem: (assetId: string, quantity: number) => void;
};

export function AssetPicker({
  room,
  catalog,
  placedAssetIds,
  recommended,
  onAddAsset,
  onAddRecommended,
  onAddRecommendedItem,
}: AssetPickerProps) {
  const [query, setQuery] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");

  const compatibleAssets = useMemo(
    () => getCompatibleAssets(catalog, room),
    [catalog, room],
  );

  const filteredAssets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return compatibleAssets;
    }
    return compatibleAssets.filter((asset) =>
      `${asset.name} ${asset.description}`.toLowerCase().includes(needle),
    );
  }, [compatibleAssets, query]);

  const groups = useMemo(
    () => groupAssetsByCategory(filteredAssets),
    [filteredAssets],
  );

  const missingRecommended = recommended.filter(
    (item) => !placedAssetIds.has(item.asset.id),
  );

  return (
    <div className="mt-4 space-y-3">
      {missingRecommended.length > 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/60 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold">Recommended for this room</p>
            <button
              type="button"
              onClick={onAddRecommended}
              className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Add full setup
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {missingRecommended.map((item) => (
              <button
                key={item.asset.id}
                type="button"
                onClick={() =>
                  onAddRecommendedItem(item.asset.id, item.quantity)
                }
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                title={item.asset.description}
              >
                + {item.asset.name}
                {item.quantity > 1 ? ` ×${item.quantity}` : ""}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <details className="rounded-xl border border-border bg-background">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-semibold text-brand [&::-webkit-details-marker]:hidden">
          + Add item to {room.name}
        </summary>

        <div className="space-y-2 border-t border-border p-3">
          <label className="block">
            <span className="sr-only">Search compatible items</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedAssetId("");
              }}
              placeholder="Search devices, equipment, furniture, machines..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </label>

          <label className="block">
            <span className="sr-only">Choose an item</span>
            <select
              value={selectedAssetId}
              onChange={(event) => setSelectedAssetId(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="">
                {filteredAssets.length === 0
                  ? "No matching items"
                  : `Choose from ${filteredAssets.length} compatible items…`}
              </option>
              {groups.map((group) => (
                <optgroup
                  key={group.category}
                  label={assetCategoryLabels[group.category]}
                >
                  {group.assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} · {formatCurrency(asset.unitCostCents)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Only items compatible with this room type are listed.
            </p>
            <button
              type="button"
              disabled={!selectedAssetId}
              onClick={() => {
                if (!selectedAssetId) {
                  return;
                }
                onAddAsset(selectedAssetId);
                setSelectedAssetId("");
              }}
              className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to room
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}
