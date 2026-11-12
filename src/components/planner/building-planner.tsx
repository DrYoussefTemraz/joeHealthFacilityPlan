"use client";

import { useEffect, useMemo, useReducer, useState } from "react";

import {
  calculateBillOfMaterials,
  calculateBuildingSummary,
  createRoomMap,
  getRecommendedAssets,
} from "@/lib/planner";
import type {
  BuildingPlan,
  BuildingPreset,
  Floor,
  PlacedAsset,
  PlacedRoom,
  PlannerCatalog,
} from "@/lib/types";

import { BillOfMaterials } from "./bill-of-materials";
import {
  buildingReducer,
  createEmptyBuilding,
} from "./building-reducer";
import { FloorCard } from "./floor-card";
import { PlannerSummary } from "./planner-summary";

const STORAGE_KEY = "joehealthplan.virtual-building.v1";
const STORAGE_VERSION = 1;

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2)}`;
}

function isBuildingPlan(value: unknown): value is BuildingPlan {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as BuildingPlan;
  return (
    typeof candidate.name === "string" &&
    Array.isArray(candidate.floors) &&
    Array.isArray(candidate.rooms)
  );
}

type BuildingPlannerProps = {
  catalog: PlannerCatalog;
};

export function BuildingPlanner({ catalog }: BuildingPlannerProps) {
  const [building, dispatch] = useReducer(
    buildingReducer,
    undefined,
    createEmptyBuilding,
  );
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState("");

  const roomMap = useMemo(() => createRoomMap(catalog), [catalog]);
  const summary = useMemo(
    () => calculateBuildingSummary(building, catalog),
    [building, catalog],
  );
  const billOfMaterials = useMemo(
    () => calculateBillOfMaterials(building, catalog),
    [building, catalog],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          version?: number;
          building?: unknown;
        };
        if (
          parsed.version === STORAGE_VERSION &&
          isBuildingPlan(parsed.building)
        ) {
          dispatch({ type: "replace", building: parsed.building });
        }
      }
    } catch {
      // A corrupt saved plan should never block the planner from opening.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, building }),
      );
    } catch {
      // Storage can be unavailable in private browsing; the tool still works.
    }
  }, [building, hydrated]);

  function addRoom(floor: Floor, templateId: string) {
    const template = roomMap.get(templateId);
    if (!template) {
      return;
    }

    const existingCount = building.rooms.filter(
      (room) => room.templateId === templateId,
    ).length;
    const name =
      existingCount === 0
        ? template.name
        : `${template.name} ${existingCount + 1}`;

    dispatch({
      type: "addRoom",
      room: {
        id: createId("room"),
        templateId,
        name,
        floorId: floor.id,
        areaSqm: template.defaultAreaSqm,
        assets: [],
      },
    });
    setStatus(`Added ${name} to ${floor.name}.`);
  }

  function addFloor() {
    const nextLevel =
      Math.max(...building.floors.map((floor) => floor.level), -1) + 1;
    const floor: Floor = {
      id: createId("floor"),
      name: `Level ${nextLevel}`,
      level: nextLevel,
    };
    dispatch({ type: "addFloor", floor });
    setStatus(`Added ${floor.name}.`);
  }

  function removeFloor(floorId: string) {
    if (building.floors.length <= 1) {
      setStatus("Keep at least one floor in the building.");
      return;
    }
    dispatch({ type: "removeFloor", floorId });
    setStatus("Removed the empty floor.");
  }

  function removeRoom(room: PlacedRoom) {
    const itemCount = room.assets.reduce(
      (total, asset) => total + asset.quantity,
      0,
    );
    if (
      itemCount > 0 &&
      !window.confirm(
        `Remove ${room.name} and its ${itemCount} ${
          itemCount === 1 ? "item" : "items"
        }?`,
      )
    ) {
      return;
    }
    dispatch({ type: "removeRoom", roomId: room.id });
    setStatus(`Removed ${room.name}.`);
  }

  function addAsset(roomId: string, assetId: string) {
    dispatch({
      type: "addAsset",
      roomId,
      assetId,
      placedAssetId: createId("asset"),
    });
  }

  function addRecommendedItem(
    roomId: string,
    assetId: string,
    quantity: number,
  ) {
    dispatch({
      type: "addAssets",
      roomId,
      assets: [{ assetId, quantity, placedAssetId: createId("asset") }],
    });
  }

  function addRecommended(roomId: string) {
    const room = building.rooms.find((candidate) => candidate.id === roomId);
    const template = room ? roomMap.get(room.templateId) : undefined;
    if (!room || !template) {
      return;
    }

    const recommended = getRecommendedAssets(catalog, template);
    if (recommended.length === 0) {
      setStatus(`${template.name} has no recommended setup.`);
      return;
    }

    const placedAssetIds = new Set(
      room.assets.map((asset) => asset.assetId),
    );
    const missing = recommended.filter(
      (item) => !placedAssetIds.has(item.asset.id),
    );

    if (missing.length === 0) {
      setStatus(`The recommended setup is already in ${room.name}.`);
      return;
    }

    dispatch({
      type: "addAssets",
      roomId,
      assets: missing.map((item) => ({
        assetId: item.asset.id,
        quantity: item.quantity,
        placedAssetId: createId("asset"),
      })),
    });
    setStatus(`Added the recommended setup to ${room.name}.`);
  }

  function loadExample(presetId: string) {
    const preset = catalog.buildingPresets.find(
      (candidate: BuildingPreset) => candidate.id === presetId,
    );
    if (!preset) {
      return;
    }

    if (
      building.rooms.length > 0 &&
      !window.confirm(
        `Replace the current building with ${preset.name}? Your current rooms and items will be lost.`,
      )
    ) {
      return;
    }

    const floors: Floor[] = preset.floors.map((name, index) => ({
      id: createId("floor"),
      name,
      level: index,
    }));

    const templateCounts = new Map<string, number>();
    for (const presetRoom of preset.rooms) {
      templateCounts.set(
        presetRoom.templateId,
        (templateCounts.get(presetRoom.templateId) ?? 0) + 1,
      );
    }

    const seen = new Map<string, number>();
    const rooms: PlacedRoom[] = preset.rooms.flatMap((presetRoom) => {
      const template = roomMap.get(presetRoom.templateId);
      if (!template) {
        return [];
      }

      const total = templateCounts.get(template.id) ?? 1;
      const index = (seen.get(template.id) ?? 0) + 1;
      seen.set(template.id, index);

      const setup = presetRoom.assets ?? template.recommendedSetup;
      const assets: PlacedAsset[] = setup.map((item) => ({
        id: createId("asset"),
        assetId: item.assetId,
        quantity: item.quantity,
      }));

      return [
        {
          id: createId("room"),
          templateId: template.id,
          name: total > 1 ? `${template.name} ${index}` : template.name,
          floorId:
            floors[presetRoom.floorIndex]?.id ?? floors[0]?.id ?? "",
          areaSqm: template.defaultAreaSqm,
          assets,
        },
      ];
    });

    dispatch({
      type: "replace",
      building: { name: preset.name, floors, rooms },
    });
    setStatus(`Loaded ${preset.name}.`);
  }

  function resetBuilding() {
    if (
      building.rooms.length > 0 &&
      !window.confirm(
        "Reset the building? All rooms, items and the saved browser copy will be cleared.",
      )
    ) {
      return;
    }
    dispatch({ type: "reset" });
    setStatus("Building reset.");
  }

  return (
    <div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <label className="min-w-0 flex-1">
            <span className="text-xs font-medium text-muted-foreground">
              Building name
            </span>
            <input
              value={building.name}
              onChange={(event) =>
                dispatch({ type: "rename", name: event.target.value })
              }
              className="mt-1 w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-2xl font-semibold tracking-tight outline-none transition-colors hover:border-border focus:border-border focus-visible:ring-2 focus-visible:ring-brand"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <label className="block">
              <span className="sr-only">Load an example building</span>
              <select
                value=""
                onChange={(event) => {
                  const presetId = event.currentTarget.value;
                  if (presetId) {
                    loadExample(presetId);
                  }
                }}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand"
              >
                <option value="">Load example…</option>
                {catalog.buildingPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={resetBuilding}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-crit hover:text-crit"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {hydrated
            ? "Autosaved to this browser."
            : "Loading any saved building…"}{" "}
          Illustrative mock catalog, costs and utilities — not for procurement or
          clinical guidance.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-5">
          {building.floors.map((floor) => (
            <FloorCard
              key={floor.id}
              floor={floor}
              rooms={building.rooms.filter(
                (room) => room.floorId === floor.id,
              )}
              catalog={catalog}
              onAddRoom={(templateId) => addRoom(floor, templateId)}
              onRemoveFloor={() => removeFloor(floor.id)}
              onRenameRoom={(roomId, name) =>
                dispatch({ type: "renameRoom", roomId, name })
              }
              onRemoveRoom={(roomId) => {
                const room = building.rooms.find(
                  (candidate) => candidate.id === roomId,
                );
                if (room) {
                  removeRoom(room);
                }
              }}
              onAddAsset={addAsset}
              onChangeQuantity={(roomId, placedAssetId, delta) =>
                dispatch({
                  type: "changeQuantity",
                  roomId,
                  placedAssetId,
                  delta,
                })
              }
              onRemoveAsset={(roomId, placedAssetId) =>
                dispatch({ type: "removeAsset", roomId, placedAssetId })
              }
              onAddRecommended={addRecommended}
              onAddRecommendedItem={addRecommendedItem}
            />
          ))}

          <button
            type="button"
            onClick={addFloor}
            className="w-full rounded-2xl border border-dashed border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-brand hover:text-brand"
          >
            + Add floor
          </button>
        </div>

        <aside className="lg:sticky lg:top-24">
          <PlannerSummary summary={summary} />
        </aside>
      </div>

      <BillOfMaterials rows={billOfMaterials} />

      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}
