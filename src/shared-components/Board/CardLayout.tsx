import { Box } from "@chakra-ui/react";
import React, { useState } from "react";

interface CardsLayout {
  type: "deck" | "table";
  children: JSX.Element[];
}
export const CardsLayout = (props: CardsLayout) => {
  const [rotations] = useState(
    Array.from(Array(52).keys()).map((child, index) =>
      Math.floor(Math.random() * 180)
    )
  );
  return (
    <Box position={"relative"}>
      {React.Children.map(props.children, (child, index) => {
        switch (props.type) {
          case "deck":
            return (
              <Box
                position={"absolute"}
                left={0}
                top={0}
                w={"200px"}
                transform={"translate(-" + index + "px, -" + index + "px)"}
              >
                {child}
              </Box>
            );
          case "table":
            return (
              <Box
                position={"absolute"}
                left={0}
                top={0}
                w={"200px"}
                transform={"rotate(" + rotations[index] + "deg)"}
              >
                {child}
              </Box>
            );
        }
      })}
    </Box>
  );
};
