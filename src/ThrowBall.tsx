import { useSpring, animated } from "react-spring";

import React from "react";

import "./throw.css";
import { useGesture } from "react-use-gesture";
import { add, scale } from "vec-la";
export function Decay() {
  const [{ xy }, set] = useSpring(() => ({
    xy: [500, 60],
    from: { xy: [0, 0] },
  }));
  // direction calculates pointer direction
  // temp is like a cache, it contains the values that you return inside "set"
  // this way we can inject the springs current coordinates on the initial event and
  // add delta to it for convenience

  const bind3 = useGesture({
    onDrag: ({ down, delta, velocity, direction }) => {
      const vv = xy.get();
      set.start({
        xy: add(delta, vv),
        immediate: down,
        config: {
          velocity: scale(direction, velocity),
          decay: true,
        },
      });
      return vv;
    },
  });
  return (
    <animated.div
      {...bind3()}
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "green",
        background: "hotpink",
        borderRadius: "50%",
        cursor: "-webkit-grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        whiteSpace: "pre",
        willChange: "transform",
        transform: xy.to((x, y) => `translate3d(${x}px,${y}px,0)`),
      }}
    />
  );
}
