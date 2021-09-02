import React from "react";
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  XYChart,
  AreaSeries,
  AreaStack,
  Tooltip,
} from "@visx/xychart";
import { BrushChartController } from ".";

export function BrushChartView({
  controller,
}: {
  controller: BrushChartController;
}) {
  const data1 = [
    { x: "2020-01-01", y: 50 },
    { x: "2020-01-02", y: 10 },
    { x: "2020-01-03", y: 20 },
  ];

  const data2 = [
    { x: "2020-01-01", y: 30 },
    { x: "2020-01-02", y: 40 },
    { x: "2020-01-03", y: 80 },
  ];

  const accessors = {
    xAccessor: (d) => d.date,
    yAccessor: (d) => d.value,
  };

  return (
    <XYChart xScale={{ type: "band" }} yScale={{ type: "linear" }}>
      <AnimatedAxis orientation={"left"} />
      <AnimatedGrid numTicks={10} />

      <AreaStack offset={"wiggle"} renderLine={true}>
        <AreaSeries
          dataKey='Line 1'
          data={data1}
          {...accessors}
          fillOpacity={0.4}
        />
        <AreaSeries
          dataKey='Line 2'
          data={data2}
          {...accessors}
          fillOpacity={0.4}
        />
      </AreaStack>
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
              {tooltipData.nearestDatum.key}
            </div>
            {accessors.xAccessor(tooltipData.nearestDatum.datum)}
            {", "}
            {accessors.yAccessor(tooltipData.nearestDatum.datum)}
          </div>
        )}
      />
    </XYChart>
  );
}
