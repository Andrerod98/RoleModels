import { Box, Center, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { HandModel } from ".";
import { Card } from "../Board/Card";
import { HandController } from "./HandController";

export function HandView({ controller }: { controller: HandController }) {
  const component = controller.get() as HandModel;

  const [selected, setSelected] = useState("");

  return (
    <Flex p={"20px"} bg={"#099311"} w={"100%"} h={"100%"}>
      <Center w={"100%"} h={"100%"}>
        {component.cards.map((c) => (
          <Box transform={selected === c ? "translateY(-20px)" : ""}>
            <Card
              isBack={component.flipped}
              value={c}
              height={"200px"}
              onClick={() => {
                if (selected === c) {
                  controller.playCard(c);
                  controller.emitEvent("onPlayCard", c);
                } else {
                  setSelected(c);
                }
              }}
            />
          </Box>
        ))}
      </Center>
    </Flex>
  );
}
