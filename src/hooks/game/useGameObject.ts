import type { SpaceGameObject } from "@/types/game/game";
import { useRef, useCallback } from "react";

interface GameObjectsState {
  objects: Map<string, SpaceGameObject>;
  spatialHash: Map<string, Set<string>>;
  cellSize: number;
}

const getCellKey = (x: number, y: number, cellSize: number): string => {
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  return `${cellX},${cellY}`;
};

export const useGameObjects = (cellSize = 50) => {
  const objectsRef = useRef<GameObjectsState>({
    objects: new Map(),
    spatialHash: new Map(),
    cellSize,
  });

  const updateSpatialHash = useCallback((object: SpaceGameObject) => {
    const { x, y, width, height } = object;
    const startCellX = Math.floor(x / objectsRef.current.cellSize);
    const startCellY = Math.floor(y / objectsRef.current.cellSize);
    const endCellX = Math.floor((x + width) / objectsRef.current.cellSize);
    const endCellY = Math.floor((y + height) / objectsRef.current.cellSize);

    for (let cellX = startCellX; cellX <= endCellX; cellX++) {
      for (let cellY = startCellY; cellY <= endCellY; cellY++) {
        const key = `${cellX},${cellY}`;
        if (!objectsRef.current.spatialHash.has(key)) {
          objectsRef.current.spatialHash.set(key, new Set());
        }
        objectsRef.current.spatialHash.get(key)?.add(object.id);
      }
    }
  }, []);

  const removeSpatialHash = useCallback((object: SpaceGameObject) => {
    const { x, y, width, height } = object;
    const startCellX = Math.floor(x / objectsRef.current.cellSize);
    const startCellY = Math.floor(y / objectsRef.current.cellSize);
    const endCellX = Math.floor((x + width) / objectsRef.current.cellSize);
    const endCellY = Math.floor((y + height) / objectsRef.current.cellSize);

    for (let cellX = startCellX; cellX <= endCellX; cellX++) {
      for (let cellY = startCellY; cellY <= endCellY; cellY++) {
        const key = `${cellX},${cellY}`;
        objectsRef.current.spatialHash.get(key)?.delete(object.id);
      }
    }
  }, []);

  const addObject = useCallback(
    (object: SpaceGameObject) => {
      objectsRef.current.objects.set(object.id, object);
      updateSpatialHash(object);
    },
    [updateSpatialHash],
  );

  const removeObject = useCallback(
    (id: string) => {
      const object = objectsRef.current.objects.get(id);
      if (object) {
        removeSpatialHash(object);
        objectsRef.current.objects.delete(id);
      }
    },
    [removeSpatialHash],
  );

  const updateObject = useCallback(
    (id: string, updates: Partial<SpaceGameObject>) => {
      const object = objectsRef.current.objects.get(id);
      if (object) {
        const updatedObject = { ...object, ...updates };
        if (updates.x !== undefined || updates.y !== undefined) {
          removeSpatialHash(object);
          objectsRef.current.objects.set(id, updatedObject);
          updateSpatialHash(updatedObject);
        } else {
          objectsRef.current.objects.set(id, updatedObject);
        }
      }
    },
    [updateSpatialHash, removeSpatialHash],
  );

  const getNearbyObjects = useCallback(
    (x: number, y: number, radius: number): SpaceGameObject[] => {
      const startCellX = Math.floor((x - radius) / objectsRef.current.cellSize);
      const startCellY = Math.floor((y - radius) / objectsRef.current.cellSize);
      const endCellX = Math.floor((x + radius) / objectsRef.current.cellSize);
      const endCellY = Math.floor((y + radius) / objectsRef.current.cellSize);

      const nearbyObjects = new Set<SpaceGameObject>();

      for (let cellX = startCellX; cellX <= endCellX; cellX++) {
        for (let cellY = startCellY; cellY <= endCellY; cellY++) {
          const key = `${cellX},${cellY}`;
          const cell = objectsRef.current.spatialHash.get(key);
          if (cell) {
            for (const id of cell) {
              const object = objectsRef.current.objects.get(id);
              if (object) {
                nearbyObjects.add(object);
              }
            }
          }
        }
      }

      return Array.from(nearbyObjects);
    },
    [],
  );

  const getObjectsByType = useCallback((prefix: string): SpaceGameObject[] => {
    return Array.from(objectsRef.current.objects.values()).filter((obj) =>
      obj.id.startsWith(prefix),
    );
  }, []);

  const clearObjects = useCallback(() => {
    objectsRef.current.objects.clear();
    objectsRef.current.spatialHash.clear();
  }, []);

  return {
    addObject,
    removeObject,
    updateObject,
    getNearbyObjects,
    getObjectsByType,
    clearObjects,
    objectsRef,
  };
};
