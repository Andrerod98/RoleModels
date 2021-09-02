import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AreaClosed, Line, Bar } from "@visx/shape";

import { curveMonotoneX } from "@visx/curve";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { max, extent, bisector } from "d3-array";
import { timeFormat } from "d3-time-format";

import AppleStockData from "../../mocks/apple/stock.json";
import MicrosoftStockData from "../../mocks/microsoft/stock.json";
import AmazonStockData from "../../mocks/amazon/stock.json";
import { AreaChartController, AreaChartModel } from ".";

export const background = "#ffffff";
export const background2 = "#ffffff";

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "black",
};

type Stock = (string | number)[];
// util
const formatDate = timeFormat("%b %d, '%y");

const bisectDate = bisector<(string | number)[], Date>(
  (d) => new Date(d.date)
).left;

export const AreaChartView = withTooltip<
  { controller: AreaChartController },
  Stock
>(
  ({
    showTooltip,
    controller,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: { controller: AreaChartController } & WithTooltipProvidedProps<Stock>) => {
    const component = controller.get() as AreaChartModel;

    const [size, setSize] = useState({ width: 0, height: 0 });
    // accessors
    const getDate = (d: Stock) => new Date(d[0]);
    const getStockValue = (d: Stock) => {
      switch (component.indicator) {
        case "open":
          return d[3] as number;
        default:
          return d[4] as number;
      }
    };
    let stock = [];
    if (component.currentStock === "apple") {
      stock = AppleStockData.dataset.data;
    } else if (component.currentStock === "microsoft") {
      stock = MicrosoftStockData.dataset.data;
    } else if (component.currentStock === "amazon") {
      stock = AmazonStockData.dataset.data;
    }
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const svgEl = useRef<SVGSVGElement>();
    useEffect(() => {
      if (size.width === 0 || size.height === 0) {
        let elem = svgEl.current;

        let rect = elem.getBoundingClientRect();
        setSize({ width: rect["width"], height: rect["height"] });
      }
    });
    // bounds
    const innerWidth = size.width - margin.left - margin.right;
    const innerHeight = size.height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left]
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight]
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(stock, x0, 1);
        const d0 = stock[index - 1];
        const d1 = stock[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale]
    );

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <svg width={"100%"} height={"100%"} ref={svgEl}>
          <rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill='url(#area-background-gradient)'
            rx={14}
          />
          <LinearGradient
            id='area-background-gradient'
            from={background}
            to={background2}
          />
          <LinearGradient
            id='area-gradient-green'
            from={"#11F57E"}
            to={"#d9ffd4"}
            toOpacity={0.7}
          />
          <LinearGradient
            id='area-gradient-yellow'
            from={"#F5E711"}
            to={"#fffed4"}
            toOpacity={0.7}
          />
          <LinearGradient
            id='area-gradient-red'
            from={"#F5112C"}
            to={"#ffd8d4"}
            toOpacity={0.7}
          />
          <AxisBottom top={innerHeight} scale={dateScale} numTicks={5} />
          <AxisLeft scale={stockValueScale} />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray='1,3'
            stroke={"#000000"}
            strokeOpacity={0.2}
            pointerEvents='none'
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray='1,3'
            stroke={"#000000"}
            strokeOpacity={0.2}
            pointerEvents='none'
          />
          <AreaClosed<Stock>
            data={stock}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke={"url(#area-gradient-" + component.color + ")"}
            fill={"url(#area-gradient-" + component.color + ")"}
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill='transparent'
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={component.color}
                strokeWidth={2}
                pointerEvents='none'
                strokeDasharray='5,2'
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill='black'
                fillOpacity={0.1}
                stroke='black'
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents='none'
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={component.color}
                stroke='white'
                strokeWidth={2}
                pointerEvents='none'
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)",
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
