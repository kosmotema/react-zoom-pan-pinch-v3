import {
  calculateBounds,
  getMouseBoundedPosition,
} from "core/bounds/bounds.utils";
import { initialState } from "../../constants/state.constants";
import { ReactZoomPanPinchContext } from "../../models";
import { PositionType } from "../../models/calculations.model";
import { roundNumber } from "../../utils/calculations.utils";
import { createState } from "../../utils/state.utils";
import { animations } from "../animations/animations.constants";
import { animate } from "../animations/animations.utils";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import { checkZoomBounds } from "../zoom/zoom.utils";

export const handleCalculateButtonZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
): number => {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation } = setup;
  const { size } = zoomAnimation;

  if (wrapperComponent === null) {
    throw new Error("Wrapper is not mounted");
  }

  const targetScale = scale * Math.exp(delta * step);

  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    false,
  );
  return newScale;
};

export function handleZoomToViewCenter(
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  animationTime: number,
  animationType: keyof typeof animations,
): void {
  const { wrapperComponent } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (wrapperComponent === null) {
    console.error("No WrapperComponent found");
    return;
  }

  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (wrapperWidth / 2 - positionX) / scale;
  const mouseY = (wrapperHeight / 2 - positionY) / scale;

  const newScale = handleCalculateButtonZoom(contextInstance, delta, step);

  const targetState = handleZoomToPoint(
    contextInstance,
    newScale,
    mouseX,
    mouseY,
  );

  if (targetState === undefined) {
    console.error(
      "Error during zoom event. New transformation state was not calculated.",
    );
    return;
  }

  animate(contextInstance, targetState, animationTime, animationType);
}

export function resetTransformations(
  contextInstance: ReactZoomPanPinchContext,
  animationTime: number,
  animationType: keyof typeof animations,
): void {
  const { setup, wrapperComponent } = contextInstance;
  const { limitToBounds } = setup;
  const initialTransformation = createState(contextInstance.props);
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (wrapperComponent === null) {
    return;
  }

  const newBounds = calculateBounds(
    contextInstance,
    initialTransformation.scale,
  );

  const boundedPositions = getMouseBoundedPosition(
    initialTransformation.positionX,
    initialTransformation.positionY,
    newBounds,
    limitToBounds,
    0,
    0,
    wrapperComponent,
  );

  const newState = {
    scale: initialTransformation.scale,
    positionX: boundedPositions.x,
    positionY: boundedPositions.y,
  };

  if (
    scale === initialTransformation.scale &&
    positionX === initialTransformation.positionX &&
    positionY === initialTransformation.positionY
  ) {
    return;
  }

  animate(contextInstance, newState, animationTime, animationType);
}

export function calculateZoomToNode(
  contextInstance: ReactZoomPanPinchContext,
  node: HTMLElement,
  customZoom?: number,
): { positionX: number; positionY: number; scale: number } {
  const { wrapperComponent } = contextInstance;
  const { limitToBounds, minScale, maxScale } = contextInstance.setup;
  if (wrapperComponent === null) {
    return initialState;
  }

  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const nodeRect = getOffset(node);

  const nodeLeft = nodeRect.x;
  const nodeTop = nodeRect.y;
  const nodeWidth = node.offsetWidth;
  const nodeHeight = node.offsetHeight;

  const scaleX = wrapperComponent.offsetWidth / nodeWidth;
  const scaleY = wrapperComponent.offsetHeight / nodeHeight;

  const newScale = checkZoomBounds(
    customZoom ?? Math.min(scaleX, scaleY),
    minScale,
    maxScale,
    0,
    false,
  );

  const offsetX = (wrapperRect.width - nodeWidth * newScale) / 2;
  const offsetY = (wrapperRect.height - nodeHeight * newScale) / 2;

  const newPositionX = (wrapperRect.left - nodeLeft) * newScale + offsetX;
  const newPositionY = (wrapperRect.top - nodeTop) * newScale + offsetY;

  const bounds = calculateBounds(contextInstance, newScale);

  const { x, y } = getMouseBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    0,
    0,
    wrapperComponent,
  );

  return { positionX: x, positionY: y, scale: newScale };
}

function getOffset(element: Element | null): PositionType {
  if (element === null || !(element instanceof HTMLElement)) {
    return {
      x: 0,
      y: 0,
    };
  }

  const parentOffset = getOffset(element.offsetParent);

  return {
    x: element.offsetLeft + parentOffset.x,
    y: element.offsetTop + parentOffset.y,
  };
}

export function isValidZoomNode(node: any): boolean {
  if (node === null || node === undefined) {
    console.error("Zoom node not found");
    return false;
  }

  if (
    typeof node !== "object" ||
    (!("offsetWidth" in node) && !("offsetHeight" in node))
  ) {
    console.error("Zoom node must contain offsetWidth and offsetHeight");
    return false;
  }

  return true;
}
