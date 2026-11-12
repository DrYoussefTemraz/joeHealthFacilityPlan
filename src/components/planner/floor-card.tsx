"use client";

import { useMemo } from "react";

import { roomCategoryLabels } from "@/components/labels";
import { formatArea } from "@/lib/format";
import { createRoomMap, ROOM_CATEGORY_ORDER } from "@/lib/planner";
import type { Floor, PlacedRoom, PlannerCatalog } from "@/lib/types";

import { RoomCard } from "./room-card";

type FloorCardProps = {
  floor: Floor;
  rooms: PlacedRoom[];
  catalog: PlannerCatalog;
  onAddRoom: (templateId: string) => void;
  onRemoveFloor: () => void;
  onRenameRoom: (roomId: string, name: string) => void;
  onRemoveRoom: (roomId: string) => void;
  onAddAsset: (roomId: string, assetId: string) => void;
  onChangeQuantity: (
    roomId: string,
    placedAssetId: string,
    delta: number,
  ) => void;
  onRemoveAsset: (roomId: string, placedAssetId: string) => void;
  onAddRecommended: (roomId: string) => void;
  onAddRecommendedItem: (
    roomId: string,
    assetId: string,
    quantity: number,
  ) => void;
};

export function FloorCard({
  floor,
  rooms,
  catalog,
  onAddRoom,
  onRemoveFloor,
  onRenameRoom,
  onRemoveRoom,
  onAddAsset,
  onChangeQuantity,
  onRemoveAsset,
  onAddRecommended,
  onAddRecommendedItem,
}: FloorCardProps) {
  const roomMap = useMemo(() => createRoomMap(catalog), [catalog]);

  const groups = ROOM_CATEGORY_ORDER.map((category) => ({
    category,
    rooms: catalog.roomTemplates
      .filter((room) => room.category === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((group) => group.rooms.length > 0);

  const floorArea = rooms.reduce((total, room) => total + room.areaSqm, 0);
  const floorBeds = rooms.reduce(
    (total, room) => total + (roomMap.get(room.templateId)?.patientBeds ?? 0),
    0,
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{floor.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"} ·{" "}
            {formatArea(floorArea)} · {floorBeds}{" "}
            {floorBeds === 1 ? "bed" : "beds"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {rooms.length === 0 ? (
            <button
              type="button"
              onClick={onRemoveFloor}
              className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-crit hover:text-crit"
            >
              Remove floor
            </button>
          ) : null}

          <label className="block">
            <span className="sr-only">Add room to {floor.name}</span>
            <select
              value=""
              onChange={(event) => {
                const templateId = event.currentTarget.value;
                if (templateId) {
                  onAddRoom(templateId);
                }
              }}
              className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="">+ Add room…</option>
              {groups.map((group) => (
                <optgroup
                  key={group.category}
                  label={roomCategoryLabels[group.category]}
                >
                  {group.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
      </div>

      {rooms.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground">
          This floor is empty. Choose a hospital room type from the dropdown to
          start.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {rooms.map((room) => {
            const template = roomMap.get(room.templateId);
            if (!template) {
              return null;
            }

            return (
              <RoomCard
                key={room.id}
                room={room}
                template={template}
                catalog={catalog}
                onRename={(name) => onRenameRoom(room.id, name)}
                onRemove={() => onRemoveRoom(room.id)}
                onAddAsset={(assetId) => onAddAsset(room.id, assetId)}
                onChangeQuantity={(placedAssetId, delta) =>
                  onChangeQuantity(room.id, placedAssetId, delta)
                }
                onRemoveAsset={(placedAssetId) =>
                  onRemoveAsset(room.id, placedAssetId)
                }
                onAddRecommended={() => onAddRecommended(room.id)}
                onAddRecommendedItem={(assetId, quantity) =>
                  onAddRecommendedItem(room.id, assetId, quantity)
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
