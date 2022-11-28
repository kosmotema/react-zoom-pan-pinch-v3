import { PositionType, ReactZoomPanPinchContext } from "../../models";
import { checkIsNumber, isExcludedNode, roundNumber } from "../../utils";
import { checkZoomBounds } from "../zoom/zoom.utils";

export const isWheelAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const { disabled, wheelDisabled, touchPadDisabled, excluded } =
    contextInstance.setup.wheel;
  const { isInitialized, isPanning } = contextInstance;

  const target = event.composedPath()[0] as HTMLElement | null;
  const isAllowed = isInitialized && !isPanning && !disabled && target !== null;
  if (!isAllowed) {
    return false;
  }

  // Event ctrlKey detects if touchpad action is executing wheel or pinch gesture
  if (wheelDisabled && !event.ctrlKey) {
    return false;
  }
  if (touchPadDisabled && event.ctrlKey) {
    return false;
  }

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) {
    return false;
  }

  return true;
};

export function getDelta(
  event: WheelEvent,
  customDelta?: number | null,
): number {
  const deltaY = event.deltaY < 0 ? 1 : -1;
  const delta = checkIsNumber(customDelta, deltaY);
  return delta;
}

export function getMousePosition(
  event: WheelEvent | MouseEvent | TouchEvent,
  contentComponent: HTMLDivElement,
  scale: number,
): PositionType {
  const contentRect = contentComponent.getBoundingClientRect();

  let mouseX = 0;
  let mouseY = 0;

  if ("clientX" in event) {
    // mouse position x, y over wrapper component
    mouseX = (event.clientX - contentRect.left) / scale;
    mouseY = (event.clientY - contentRect.top) / scale;
  } else {
    const touch = event.touches[0];
    mouseX = (touch.clientX - contentRect.left) / scale;
    mouseY = (touch.clientY - contentRect.top) / scale;
  }

  if (isNaN(mouseX) || isNaN(mouseY)) {
    console.error("No mouse or touch offset found");
  }

  return {
    x: mouseX,
    y: mouseY,
  };
}

export const handleCalculateWheelZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  disablePadding: boolean,
  getTarget?: boolean,
): number => {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation } = setup;
  const { size, disabled } = zoomAnimation;

  if (wrapperComponent === null) {
    throw new Error("Wrapper is not mounted");
  }

  const targetScale = scale + delta * (scale - scale * step) * step;

  if (getTarget === true) {
    return targetScale;
  }
  const paddingEnabled = disablePadding ? false : !disabled;
  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    paddingEnabled,
  );
  return newScale;
};

export const handleWheelZoomStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const { previousWheelEvent } = contextInstance;
  const { scale } = contextInstance.transformState;
  const { maxScale, minScale } = contextInstance.setup;

  if (previousWheelEvent === null) {
    return false;
  }
  if (scale < maxScale || scale > minScale) {
    return true;
  }
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY)) {
    return true;
  }
  if (
    previousWheelEvent.deltaY > 0 &&
    previousWheelEvent.deltaY < event.deltaY
  ) {
    return true;
  }
  if (
    previousWheelEvent.deltaY < 0 &&
    previousWheelEvent.deltaY > event.deltaY
  ) {
    return true;
  }
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY)) {
    return true;
  }
  return false;
};
