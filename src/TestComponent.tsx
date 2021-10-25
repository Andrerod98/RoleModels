import { Box } from "@chakra-ui/layout";
import { useDrag } from "@use-gesture/react";
import React, { useRef } from "react";

export const TestComponent = () => {
  const ref = useRef(null);

  useDrag(
    ({ first, distance: [dx, dy] }) => {
      if (first && dx + dy < 3) console.log("THIS IS A LONG PRESS");
    },
    {
      delay: 2000,
      target: ref,
      filterTaps: true,
      threshold: 0,
    }
  );

  return <Box w={"200px"} h={"200px"} bg={"green"} ref={ref}></Box>;
};
