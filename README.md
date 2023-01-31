# @kosmotema/react-zoom-pan-pinch

Super fast and light react Node.js package for zooming, panning and pinching html elements in an easy way.

This is a fork of [@pronestor/react-zoom-pan-pinch](https://github.com/proNestorAps/react-zoom-pan-pinch), created in order to expose styles in a separate `.css` file (to support the use of the library inside web components).

Since repository [@pronestor/react-zoom-pan-pinch](https://github.com/proNestorAps/react-zoom-pan-pinch) is archived, version 3 of this package is archived too. You can found version 4, that is based on [the original repo from Maciej Pyrc](https://github.com/prc5/react-zoom-pan-pinch) with the same changes [here](https://github.com/kosmotema/react-zoom-pan-pinch).

## Documentation

[Storybook for `@kosmotema/react-zoom-pan-pinch`](https://kosmotema.github.io/react-zoom-pan-pinch-v3/).

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
