"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/badge";
import {
  assetCategoryLabels,
  medicalUtilityLabels,
  roomCategoryLabels,
} from "@/components/labels";
import { formatArea, formatCurrency } from "@/lib/format";
import {
  createAssetMap,
  getAssetCategoryOrder,
  getRecommendedAssets,
  getRoomAssetCost,
  getRoomAssetQuantity,
} from "@/lib/planner";
import type { AssetTemplate, PlacedAsset, PlannerCatalog, PlacedRoom, RoomTemplate } from "@/lib/types";

import { AssetPicker } from "./asset-picker";

type RoomCardProps = {
  room: PlacedRoom;
  template: RoomTemplate;
  catalog: PlannerCatalog;
  onRename: (name: string) => void;
  onRemove: () => void;
  onAddAsset: (assetId: string) => void;
  onChangeQuantity: (placedAssetId: string, delta: number) => void;
  onRemoveAsset: (placedAssetId: string) => void;
  onAddRecommended: () => void;
  onAddRecommendedItem: (assetId: string, quantity: number) => void;
};

type AssetRow = {
  placed: PlacedAsset;
  asset: AssetTemplate;
};

export function RoomCard({
  room,
  template,
  catalog,
  onRename,
  onRemove,
  onAddAsset,
  onChangeQuantity,
  onRemoveAsset,
  onAddRecommended,
  onAddRecommendedItem,
}: RoomCardProps) {
  const assetMap = useMemo(() => createAssetMap(catalog), [catalog]);
  const recommended = useMemo(
    () => getRecommendedAssets(catalog, template),
    [catalog, template],
  );
  const [showAllUtilities, setShowAllUtilities] = useState(false);
  const visibleUtilities = showAllUtilities
    ? template.utilities
    : template.utilities.slice(0, 3);
  const hiddenUtilityCount = Math.max(template.utilities.length - 3, 0);
  const hiddenUtilityLabels = template.utilities
    .slice(3)
    .map((utility) => medicalUtilityLabels[utility])
    .join(", ");

  const rows: AssetRow[] = room.assets.flatMap((placed) => {
    const asset = assetMap.get(placed.assetId);
    return asset ? [{ placed, asset }] : [];
  });

  const groups = getAssetCategoryOrder(catalog.vertical).map((category) => ({
    category,
    rows: rows.filter((row) => row.asset.category === category),
  })).filter((group) => group.rows.length > 0);

  const placedAssetIds = new Set(room.assets.map((asset) => asset.assetId));
  const roomCost = getRoomAssetCost(room, catalog);
  const assetQuantity = getRoomAssetQuantity(room);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <label className="block">
            <span className="sr-only">Room name</span>
            <input
              value={room.name}
              onChange={(event) => onRename(event.target.value)}
              className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold outline-none transition-colors hover:border-border focus:border-border focus-visible:ring-2 focus-visible:ring-brand"
            />
          </label>
          <p className="mt-1 line-clamp-2 px-1 text-xs leading-5 text-muted-foreground">
            {template.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${room.name}`}
          className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-sm text-muted-foreground transition-colors hover:border-crit hover:text-crit"
        >
          ×
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="neutral">{roomCategoryLabels[template.category]}</Badge>
        <Badge variant="neutral">{formatArea(room.areaSqm)}</Badge>
        <Badge variant="neutral">
          {template.patientBeds === 0
            ? "No beds"
            : `${template.patientBeds} ${template.patientBeds === 1 ? "bed" : "beds"}`}
        </Badge>
        {visibleUtilities.map((utility) => (
          <Badge key={utility} variant="neutral">
            {medicalUtilityLabels[utility]}
          </Badge>
        ))}
        {hiddenUtilityCount > 0 ? (
          <button
            type="button"
            onClick={() => setShowAllUtilities((current) => !current)}
            aria-expanded={showAllUtilities}
            title={
              showAllUtilities
                ? "Show fewer utilities"
                : `Also requires: ${hiddenUtilityLabels}`
            }
            className="inline-flex items-center whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {showAllUtilities ? "Show fewer" : `+${hiddenUtilityCount} more`}
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {groups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/50 p-3 text-xs text-muted-foreground">
            No items yet. Add the recommended setup or choose individual items
            below.
          </p>
        ) : (
          groups.map((group) => {
            const groupQuantity = group.rows.reduce(
              (total, row) => total + row.placed.quantity,
              0,
            );
            const groupCost = group.rows.reduce(
              (total, row) =>
                total + row.asset.unitCostCents * row.placed.quantity,
              0,
            );

            return (
              <details
                key={group.category}
                open
                className="rounded-xl border border-border bg-background"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-semibold [&::-webkit-details-marker]:hidden">
                  <span>
                    {assetCategoryLabels[group.category]}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({groupQuantity})
                    </span>
                  </span>
                  <span className="font-normal text-muted-foreground">
                    {formatCurrency(groupCost)}
                  </span>
                </summary>
                <ul className="border-t border-border p-1.5">
                  {group.rows.map(({ placed, asset }) => (
                    <li
                      key={placed.id}
                      className="flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{asset.name}</p>
                        <p className="text-muted-foreground">
                          {formatCurrency(asset.unitCostCents)} each
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onChangeQuantity(placed.id, -1)}
                          aria-label={`Decrease ${asset.name} in ${room.name}`}
                          className="grid size-6 place-items-center rounded-md border border-border transition-colors hover:bg-background"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-medium">
                          {placed.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onChangeQuantity(placed.id, 1)}
                          aria-label={`Increase ${asset.name} in ${room.name}`}
                          className="grid size-6 place-items-center rounded-md border border-border transition-colors hover:bg-background"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveAsset(placed.id)}
                          aria-label={`Remove ${asset.name} from ${room.name}`}
                          className="grid size-6 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-crit hover:text-crit"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {assetQuantity} {assetQuantity === 1 ? "item" : "items"}
        </span>
        <span className="font-medium text-foreground">
          {formatCurrency(roomCost)}
        </span>
      </div>

      <AssetPicker
        room={template}
        catalog={catalog}
        placedAssetIds={placedAssetIds}
        recommended={recommended}
        onAddAsset={onAddAsset}
        onAddRecommended={onAddRecommended}
        onAddRecommendedItem={onAddRecommendedItem}
      />
    </article>
  );
}
