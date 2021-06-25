import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { StitchingCombinedView } from "./shared-object/combined-views/stitching-combined-view/StitchingCombinedView";
import { View } from "./shared-object/views/View";

export function Stitching({
  view,
  combinedView,
  role,
}: {
  view: View;
  combinedView: StitchingCombinedView;
  role: string;
}) {
  const rows = combinedView.getRows();
  const columns = combinedView.getColumns();
  const position = combinedView.getPosition(role);

  console.log(combinedView.getPositions());

  function calculatePosition(
    position: number,
    nRows: number,
    nColumns: number
  ): [row: number, column: number, width: number, height: number] {
    let currentPos = 0;

    if (nRows === 0 || nColumns === 0) return [0, 0, 0, 0];

    for (let column = 0; column < nColumns; column++) {
      for (let row = 0; row < nRows; row++) {
        currentPos++;

        if (currentPos == position)
          return [row, column, row * (100 / nRows), column * (100 / nColumns)];
      }
    }

    return [0, 0, 0, 0];
  }
  const [cs, rws, wPerc, hPerc] = calculatePosition(position, rows, columns);
  console.log({ w: wPerc, h: hPerc });
  return (
    <Box
      transform={"translate(-" + 100 * cs + "%,-" + 100 * rws + "%)"}
      h={"100%"}
      w={"100%"}
    >
      <Grid
        h={100 * columns + "%"}
        w={100 * rows + "%"}
        templateRows={"repeat(" + rows + ", 1fr)"}
        templateColumns={"repeat(" + columns + ", 1fr)"}
      >
        <GridItem rowSpan={rows} colSpan={columns}>
          <Box position={"relative"} w={"100%"} h={"100%"} bg={"black"}>
            {view.getRoot().generateWidget()}
            {/*<Box
              w={100 / rows + "%"}
              h={100 / columns + "%"}
              bg={"red"}
              position={"absolute"}
              left={wPerc + "%"}
              top={hPerc + "%"}
            ></Box>*/}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
