# @kosmotema/react-zoom-pan-pinch

Super fast and light react Node.js package for zooming, panning and pinching html elements in an easy way.

This is a fork of [@pronestor/react-zoom-pan-pinch](https://github.com/proNestorAps/react-zoom-pan-pinch) created in order to expose styles in a separate `.css` file.

## Documentation

[Storybook for `@kosmotema/react-zoom-pan-pinch`](https://kosmotema.github.io/react-zoom-pan-pinch/).

## Quick Start

### Installation

```shell
yarn add @kosmotema/react-zoom-pan-pinch
```

or

```shell
npm install @kosmotema/react-zoom-pan-pinch
```

### Usage

Basic usage:

```jsx
import {
  TransformComponent,
  TransformWrapper,
} from "@kosmotema/react-zoom-pan-pinch";

import "@kosmotema/react-zoom-pan-pinch/dist/index.css";

export const SimpleExample = () => (
  <TransformWrapper>
    <TransformComponent>
      <img src="image.jpg" alt="test" />
    </TransformComponent>
  </TransformWrapper>
);
```

With controls:

```jsx
import {
  TransformComponent,
  TransformWrapper,
} from "@kosmotema/react-zoom-pan-pinch";

import "@kosmotema/react-zoom-pan-pinch/dist/index.css";

export const ExampleWithZoomControls = () => (
  <TransformWrapper
    initialPositionX={200}
    initialPositionY={100}
    initialScale={1}
  >
    {({ zoomIn, zoomOut, ...rest }) => (
      <>
        <div className="tools">
          <button onClick={() => zoomIn()}>+</button>
          <button onClick={() => zoomOut()}>-</button>
        </div>
        <TransformComponent>
          <img src="image.jpg" alt="test" />
          <div>Example text</div>
        </TransformComponent>
      </>
    )}
  </TransformWrapper>
);
```

## License

MIT © [Pronestor](https://github.com/proNestorAps), [Artem Pitikin](https://github.com/kosmotema)
