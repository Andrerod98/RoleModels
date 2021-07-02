import { useSpring, animated } from "react-spring";

import React, { useEffect } from "react";

import { useGesture } from "react-use-gesture";
import { add, scale } from "vec-la";
export function ThrowingBall({ x, y, children, controller, component }: any) {
  useEffect(() => {
    set.start({
      xy: [x, y],
    });
  }, [x, y]);

  const [{ xy }, set] = useSpring(() => ({
    xy: [x, y],
    from: { xy: [0, 0] },
  }));
  // direction calculates pointer direction
  // temp is like a cache, it contains the values that you return inside "set"
  // this way we can inject the springs current coordinates on the initial event and
  // add delta to it for convenience

  const bind3 = useGesture({
    onMoveEnd: ({ xy: [px, py], dragging }) =>
      !dragging &&
      controller.update({
        ...component,
        x: px,
        y: py,
        children: [],
      }),
    onMoveStart: ({ xy: [px, py], dragging }) =>
      !dragging &&
      controller.update({
        ...component,
        x: px,
        y: py,
        children: [],
      }),
    onDrag: ({ down, delta, velocity, direction }) => {
      const vv = xy.get();
      const yy = add(delta, vv);
      set.start({
        xy: yy,
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
        position: "absolute",
        transform: xy.to((x, y) => `translate3d(${x}px,${y}px,0)`),
      }}
    >
      {children}
    </animated.div>
  );
}
