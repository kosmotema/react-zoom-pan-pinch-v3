import { ReactZoomPanPinchContext } from "../../models";
import { getCenterPosition } from "../../utils/styles.utils";
import { animations } from "../animations/animations.constants";
import { animate, handleCancelAnimation } from "../animations/animations.utils";
import {
  calculateZoomToNode,
  handleZoomToViewCenter,
  isValidZoomNode,
  resetTransformations,
} from "./handlers.utils";

export const zoomIn =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    step = 0.5,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    handleZoomToViewCenter(
      contextInstance,
      1,
      step,
      animationTime,
      animationType,
    );
  };

export const zoomOut =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    step = 0.5,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    handleZoomToViewCenter(
      contextInstance,
      -1,
      step,
      animationTime,
      animationType,
    );
  };

export const setTransform =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    newPositionX: number,
    newPositionY: number,
    newScale: number,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    const { positionX, positionY, scale } = contextInstance.transformState;
    const { wrapperComponent, contentComponent } = contextInstance;
    const { disabled } = contextInstance.setup;

    if (disabled || wrapperComponent === null || contentComponent === null) {
      return;
    }

    const targetState = {
      positionX: isNaN(newPositionX) ? positionX : newPositionX,
      positionY: isNaN(newPositionY) ? positionY : newPositionY,
      scale: isNaN(newScale) ? scale : newScale,
    };

    animate(contextInstance, targetState, animationTime, animationType);
  };

export const resetTransform =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    resetTransformations(contextInstance, animationTime, animationType);
  };

export const centerView =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    scale?: number,
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    const { transformState, wrapperComponent, contentComponent } =
      contextInstance;
    if (wrapperComponent !== null && contentComponent !== null) {
      const targetState = getCenterPosition(
        scale === undefined || scale === 0 ? transformState.scale : scale,
        wrapperComponent,
        contentComponent,
      );

      animate(contextInstance, targetState, animationTime, animationType);
    }
  };

export const zoomToElement =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    node: HTMLElement | string,
    scale?: number,
    animationTime = 600,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    handleCancelAnimation(contextInstance);

    const { wrapperComponent } = contextInstance;

    const target =
      typeof node === "string" ? document.getElementById(node) : node;

    if (
      wrapperComponent !== null &&
      isValidZoomNode(target) &&
      target !== null &&
      wrapperComponent.contains(target)
    ) {
      const targetState = calculateZoomToNode(contextInstance, target, scale);
      animate(contextInstance, targetState, animationTime, animationType);
    }
  };
