import { useEffect, useRef, useCallback } from "react";

export interface InputBinding<T> {
  key?: string;
  pointerZone?: "left" | "center" | "right";
  action: T;
}

export interface InputHandlerOptions<T> {
  bindings: InputBinding<T>[];
  onAction: (action: T, start: boolean) => void;
  element?: HTMLElement | null;
  preventDefault?: boolean;
  touchEnabled?: boolean;
  mouseEnabled?: boolean;
  keyboardEnabled?: boolean;
}

interface InputState<T> {
  actions: Set<T>;
  isPointerDown: boolean;
  pointerPosition: { x: number; y: number } | null;
}

export const useInputHandler = <T extends string>({
  bindings,
  onAction,
  element,
  preventDefault = true,
  touchEnabled = true,
  mouseEnabled = true,
  keyboardEnabled = true,
}: InputHandlerOptions<T>) => {
  const state = useRef<InputState<T>>({
    actions: new Set(),
    isPointerDown: false,
    pointerPosition: null,
  });

  const getActionFromKey = useCallback(
    (key: string): T | undefined => {
      return bindings.find((binding) => binding.key === key)?.action;
    },
    [bindings],
  );

  const getActionFromPointer = useCallback(
    (x: number, y: number, element: HTMLElement): T | undefined => {
      const rect = element.getBoundingClientRect();
      const relativeX = (x - rect.left) / rect.width;

      if (!bindings.some((b) => b.pointerZone)) {
        return bindings.find((b) => !b.pointerZone)?.action;
      }

      if (relativeX < 0.33) {
        return bindings.find((b) => b.pointerZone === "left")?.action;
      } else if (relativeX > 0.66) {
        return bindings.find((b) => b.pointerZone === "right")?.action;
      } else {
        return bindings.find((b) => b.pointerZone === "center")?.action;
      }
    },
    [bindings],
  );

  useEffect(() => {
    if (!element) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyboardEnabled) return;
      const action = getActionFromKey(e.key);
      if (action && !state.current.actions.has(action)) {
        if (preventDefault) e.preventDefault();
        state.current.actions.add(action);
        onAction(action, true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!keyboardEnabled) return;
      const action = getActionFromKey(e.key);
      if (action) {
        if (preventDefault) e.preventDefault();
        state.current.actions.delete(action);
        onAction(action, false);
      }
    };

    const handlePointerStart = (x: number, y: number) => {
      if (!element) return;
      state.current.isPointerDown = true;
      state.current.pointerPosition = { x, y };
      const action = getActionFromPointer(x, y, element);
      if (action) {
        state.current.actions.add(action);
        onAction(action, true);
      }
    };

    const handlePointerMove = (x: number, y: number) => {
      if (!element || !state.current.isPointerDown) return;

      const prevAction = getActionFromPointer(
        state.current.pointerPosition?.x || 0,
        state.current.pointerPosition?.y || 0,
        element,
      );
      if (prevAction) {
        state.current.actions.delete(prevAction);
        onAction(prevAction, false);
      }

      state.current.pointerPosition = { x, y };
      const newAction = getActionFromPointer(x, y, element);
      if (newAction) {
        state.current.actions.add(newAction);
        onAction(newAction, true);
      }
    };

    const handlePointerEnd = () => {
      if (!element || !state.current.isPointerDown) return;

      const action = state.current.pointerPosition
        ? getActionFromPointer(
            state.current.pointerPosition.x,
            state.current.pointerPosition.y,
            element,
          )
        : undefined;

      if (action) {
        state.current.actions.delete(action);
        onAction(action, false);
      }

      state.current.isPointerDown = false;
      state.current.pointerPosition = null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      const touch = e.touches[0];
      handlePointerStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      handlePointerEnd();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (preventDefault) e.preventDefault();
      handlePointerStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (preventDefault && state.current.isPointerDown) e.preventDefault();
      handlePointerMove(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (preventDefault) e.preventDefault();
      handlePointerEnd();
    };

    if (touchEnabled) {
      element.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      element.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      element.addEventListener("touchend", handleTouchEnd);
    }

    if (mouseEnabled) {
      element.addEventListener("mousedown", handleMouseDown);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseup", handleMouseUp);
      element.addEventListener("mouseleave", handleMouseUp);
    }

    if (keyboardEnabled) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      if (touchEnabled) {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
      }

      if (mouseEnabled) {
        element.removeEventListener("mousedown", handleMouseDown);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseup", handleMouseUp);
        element.removeEventListener("mouseleave", handleMouseUp);
      }

      if (keyboardEnabled) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [
    element,
    bindings,
    onAction,
    preventDefault,
    touchEnabled,
    mouseEnabled,
    keyboardEnabled,
    getActionFromKey,
    getActionFromPointer,
  ]);

  return state.current;
};
