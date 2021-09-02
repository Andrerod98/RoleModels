import React from "react";
import { BoardModel } from ".";
import { Box, Flex } from "@chakra-ui/react";
import { BoardController } from "./BoardController";
import { Card } from "./Card";
import { CardsLayout } from "./CardLayout";

export function BoardView({ controller }: { controller: BoardController }) {
  const component = controller.get() as BoardModel;

  return (
    <Flex p={"20px"} width={"50%"} height={"90%"}>
      <Box>
        <CardsLayout type={"deck"}>
          {component.deckCards.map((c) => (
            <Card
              isBack
              value={c}
              height={"100%"}
              onClick={() => {
                controller.withDrawCard();
                controller.emitEvent("onWithdraw");
              }}
            />
          ))}
        </CardsLayout>
      </Box>
      <Box ml={"300px"}>
        <CardsLayout type={"table"}>
          {component.playedCards.map((c) => (
            <Card value={c} height={"100%"} />
          ))}
        </CardsLayout>
      </Box>
    </Flex>
  );
}
