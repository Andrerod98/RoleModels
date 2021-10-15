import { Box, Heading, Center, Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import { CrossAppState, CrossAppContext } from "../context/AppContext";

export const RecoveringModal = () => {
  const { mode } = useContext<CrossAppState>(CrossAppContext);

  if (mode.mode !== "recovery" && mode.mode !== "setting-up") {
    return <></>;
  }

  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      bg={"rgba(0,0,0, 0.75)"}
      position={"absolute"}
      left={0}
      top={0}
    >
      <Center h={"100%"} w={"100%"}>
        <Box>
          <Heading color={"white"} w={"100%"} textAlign={"center"}>
            {mode.mode === "recovery"
              ? "Recovering workspace..."
              : "Setting up workspace..."}
          </Heading>
          <Center w={"100%"}>
            <Spinner size={"xl"} color={"white"} borderWidth={"5px"} my={5} />
          </Center>
        </Box>
      </Center>
    </Box>
  );
};
