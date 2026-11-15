import type { BuildingPlan, Floor, PlacedRoom } from "@/lib/types";

export const EMPTY_BUILDING_NAME = "New virtual hospital";

/** Static ids keep the first server render deterministic. */
const DEFAULT_FLOORS: Floor[] = [
  { id: "floor-ground", name: "Ground floor", level: 0 },
  { id: "floor-1", name: "Level 1", level: 1 },
  { id: "floor-2", name: "Level 2", level: 2 },
];

export function createEmptyBuilding(
  name: string = EMPTY_BUILDING_NAME,
): BuildingPlan {
  return {
    name,
    floors: DEFAULT_FLOORS.map((floor) => ({ ...floor })),
    rooms: [],
  };
}

export type BuildingAction =
  | { type: "replace"; building: BuildingPlan }
  | { type: "rename"; name: string }
  | { type: "addFloor"; floor: Floor }
  | { type: "removeFloor"; floorId: string }
  | { type: "addRoom"; room: PlacedRoom }
  | { type: "renameRoom"; roomId: string; name: string }
  | { type: "removeRoom"; roomId: string }
  | {
      type: "addAsset";
      roomId: string;
      assetId: string;
      placedAssetId: string;
    }
  | {
      type: "addAssets";
      roomId: string;
      assets: Array<{
        assetId: string;
        quantity: number;
        placedAssetId: string;
      }>;
    }
  | {
      type: "changeQuantity";
      roomId: string;
      placedAssetId: string;
      delta: number;
    }
  | { type: "removeAsset"; roomId: string; placedAssetId: string }
  | { type: "reset"; name?: string };

export function buildingReducer(
  state: BuildingPlan,
  action: BuildingAction,
): BuildingPlan {
  switch (action.type) {
    case "replace":
      return action.building;

    case "rename":
      return { ...state, name: action.name };

    case "addFloor":
      return { ...state, floors: [...state.floors, action.floor] };

    case "removeFloor": {
      const hasRooms = state.rooms.some(
        (room) => room.floorId === action.floorId,
      );
      if (hasRooms) {
        return state;
      }
      return {
        ...state,
        floors: state.floors.filter((floor) => floor.id !== action.floorId),
      };
    }

    case "addRoom":
      return { ...state, rooms: [...state.rooms, action.room] };

    case "renameRoom":
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.roomId ? { ...room, name: action.name } : room,
        ),
      };

    case "removeRoom":
      return {
        ...state,
        rooms: state.rooms.filter((room) => room.id !== action.roomId),
      };

    case "addAsset":
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.id !== action.roomId) {
            return room;
          }

          const existing = room.assets.find(
            (asset) => asset.assetId === action.assetId,
          );
          if (existing) {
            return {
              ...room,
              assets: room.assets.map((asset) =>
                asset.id === existing.id
                  ? { ...asset, quantity: asset.quantity + 1 }
                  : asset,
              ),
            };
          }

          return {
            ...room,
            assets: [
              ...room.assets,
              {
                id: action.placedAssetId,
                assetId: action.assetId,
                quantity: 1,
              },
            ],
          };
        }),
      };

    case "addAssets":
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.id !== action.roomId) {
            return room;
          }

          const assets = [...room.assets];
          for (const item of action.assets) {
            const existing = assets.find(
              (asset) => asset.assetId === item.assetId,
            );
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              assets.push({
                id: item.placedAssetId,
                assetId: item.assetId,
                quantity: item.quantity,
              });
            }
          }

          return { ...room, assets };
        }),
      };

    case "changeQuantity":
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.id !== action.roomId) {
            return room;
          }

          return {
            ...room,
            assets: room.assets
              .map((asset) =>
                asset.id === action.placedAssetId
                  ? {
                      ...asset,
                      quantity: Math.max(0, asset.quantity + action.delta),
                    }
                  : asset,
              )
              .filter((asset) => asset.quantity > 0),
          };
        }),
      };

    case "removeAsset":
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.roomId
            ? {
                ...room,
                assets: room.assets.filter(
                  (asset) => asset.id !== action.placedAssetId,
                ),
              }
            : room,
        ),
      };

    case "reset":
      return createEmptyBuilding(action.name);
  }
}
