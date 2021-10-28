import React, { useEffect, useRef, useState } from "react";
import * as Curve from "@visx/curve";
import {
  AreaSeries,
  XYChart,
  AreaStack,
  BarSeries,
  AnimatedAxis,
  AnimatedGrid,
  GlyphSeries,
  LineSeries,
} from "@visx/xychart";

type Stock = (string | number)[];
import AppleStockData from "./mocks/apple/stock.json";
import AmazonStockData from "./mocks/amazon/stock.json";
import MicrosoftStockData from "./mocks/microsoft/stock.json";

export function XYChartView(props: {
  type: string;
  stock: string;
  xVariable: string;
  yVariable: string;
  xDomain: [string, string];
  yDomain: [string, string];
  color: string[];
}) {
  const xAccessor = (d: Stock) => {
    switch (props.xVariable) {
      case "Date":
        return new Date(d[0]);
      case "Open":
        return new Number(d[1]);
      case "High":
        return new Number(d[2]);
      case "Low":
        return new Number(d[3]);
      case "Close":
        return new Number(d[4]);
      case "Volume":
        return new Number(d[5]);
      case "Ex-Dividend":
        return new Number(d[6]);
      case "Split Ratio":
        return new Number(d[7]);
      case "Adj. Open":
        return new Number(d[8]);
      case "Adj. High":
        return new Number(d[9]);
      case "Adj. Low":
        return new Number(d[10]);
      case "Adj. Close":
        return new Number(d[11]);
      case "Adj. Volume":
        return new Number(d[12]);
      default:
        return 0;
    }
  };
  const yAccesor = (d: Stock) => {
    switch (props.yVariable) {
      case "Date":
        return new Date(d[0]);
      case "Open":
        return new Number(d[1]);
      case "High":
        return new Number(d[2]);
      case "Low":
        return new Number(d[3]);
      case "Close":
        return new Number(d[4]);
      case "Volume":
        return new Number(d[5]);
      case "Ex-Dividend":
        return new Number(d[6]);
      case "Split Ratio":
        return new Number(d[7]);
      case "Adj. Open":
        return new Number(d[8]);
      case "Adj. High":
        return new Number(d[9]);
      case "Adj. Low":
        return new Number(d[10]);
      case "Adj. Close":
        return new Number(d[11]);
      case "Adj. Volume":
        return new Number(d[12]);
      default:
        return 0;
    }
  };

  const filterFunction = (s) => {
    if (!s) return false;
    const xRaw = xAccessor(s);
    let x, minX, maxX;
    let y, minY, maxY;
    if (!props.xDomain || !props.yDomain) return true;

    const [minXRaw, maxXRaw] = props.xDomain;
    const [minYRaw, maxYRaw] = props.yDomain;
    if (minXRaw === "" || maxXRaw === "" || minYRaw === "" || maxYRaw === "")
      return true;

    if (xRaw instanceof Date) {
      x = xRaw.getTime();
      minX = new Date(minXRaw).getTime();
      maxX = new Date(maxXRaw).getTime();
    } else {
      x = xRaw.valueOf();
      minX = new Number(minXRaw).valueOf();
      maxX = new Number(maxXRaw).valueOf();
    }

    const yRaw = yAccesor(s);
    if (yRaw instanceof Date) {
      y = yRaw.getTime();
      minY = new Date(minYRaw).getTime();
      maxY = new Date(maxYRaw).getTime();
    } else {
      y = yRaw.valueOf();
      minY = new Number(minYRaw).valueOf();
      maxY = new Number(maxYRaw).valueOf();
    }

    return x > minX && x < maxX && y > minY && y < maxY;
  };

  const data1 = AppleStockData.dataset.data.filter(filterFunction);
  const data2 = AmazonStockData.dataset.data.filter(filterFunction);
  const data3 = MicrosoftStockData.dataset.data.filter(filterFunction);

  const dataMapping = {
    apple: data1,
    amazon: data2,
    microsoft: data3,
  };

  const [size, setSize] = useState({ width: 0, height: 0 });

  const divRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (size.width === 0 || size.height === 0) {
      let elem = divRef.current;

      let rect = elem.getBoundingClientRect();
      setSize({ width: rect["width"], height: rect["height"] });
    }
  });

  const numTicks = 10;
  const curve = Curve.curveBasis;

  const colorAccessor1 = (d: Stock, index: number) => props.color[0];
  const colorAccessor2 = (d: Stock, index: number) => props.color[1];
  const colorAccessor3 = (d: Stock, index: number) => props.color[2];

  return (
    <div ref={divRef} style={{ width: "100%", height: "100%" }}>
      <XYChart
        height={size.height}
        xScale={{ type: props.xVariable === "Date" ? "time" : "linear" }}
        yScale={{ type: props.yVariable === "Date" ? "time" : "linear" }}
        margin={{ top: 5, bottom: 35, right: 10, left: 65 }}
      >
        <AnimatedAxis
          orientation='left'
          label={props.yVariable}
          labelProps={{ fill: "white", fontSize: "12px", fontWeight: "bold" }}
          labelOffset={40}
          stroke={"white"}
          tickStroke={"white"}
          tickLabelProps={() => ({
            fill: "white",
            fontSize: "12px",
            fontWeight: "regular",
          })}
        />
        <AnimatedAxis
          orientation='bottom'
          label={props.xVariable}
          labelProps={{ fill: "white", fontSize: "12px", fontWeight: "bold" }}
          tickLabelProps={() => ({
            fill: "white",
            fontWeight: "regular",
          })}
        />
        <AnimatedGrid columns={true} numTicks={numTicks} stroke={"white"} />

        {props.type === "barSeries" && (
          <BarSeries
            dataKey='New York'
            data={dataMapping[props.stock]}
            xAccessor={xAccessor}
            yAccessor={yAccesor}
            colorAccessor={colorAccessor1}
          />
        )}
        {props.type === "areaSeries" &&
          (props.stock === "all" ? (
            <>
              {" "}
              <AreaSeries
                dataKey='Austin'
                data={data1}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                dataKey='New York'
                data={data2}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                fillOpacity={0.4}
                curve={curve}
              />
              <AreaSeries
                dataKey='San Francisco'
                data={data3}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                fillOpacity={0.4}
                curve={curve}
              />{" "}
            </>
          ) : (
            <AreaSeries
              dataKey='Austin'
              data={data1}
              xAccessor={xAccessor}
              yAccessor={yAccesor}
              fill={props.color[0]}
              lineProps={{ fill: props.color[0] }}
              fillOpacity={0.4}
              curve={curve}
            />
          ))}
        {props.type === "glyphSeries" &&
          (props.stock === "all" ? (
            <>
              <GlyphSeries
                dataKey='San Francisco'
                data={data1}
                size={1}
                colorAccessor={colorAccessor1}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
              />
              <GlyphSeries
                dataKey='San Francisco2'
                data={data2}
                size={1}
                colorAccessor={colorAccessor2}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
              />
              <GlyphSeries
                dataKey='San Francisco3'
                data={data3}
                size={1}
                colorAccessor={colorAccessor3}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
              />
            </>
          ) : (
            <GlyphSeries
              dataKey='San Francisco'
              data={dataMapping[props.stock]}
              size={1}
              colorAccessor={colorAccessor1}
              xAccessor={xAccessor}
              yAccessor={yAccesor}
            />
          ))}
        {props.type === "areaStack" &&
          (props.stock === "all" ? (
            <AreaStack curve={curve} offset={"expand"} renderLine={true}>
              <AreaSeries
                dataKey='Austin'
                data={data1}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                fillOpacity={0.4}
              />
              <AreaSeries
                dataKey='New York'
                data={data2}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                fillOpacity={0.4}
              />
              <AreaSeries
                dataKey='San Francisco'
                data={data3}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                fillOpacity={0.4}
              />
            </AreaStack>
          ) : (
            <AreaStack curve={curve} offset={"expand"} renderLine={true}>
              <AreaSeries
                dataKey='Austin'
                data={dataMapping[props.stock]}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                color={props.color[0]}
                fill={props.color[0]}
                lineProps={{ fill: props.color[0] }}
                fillOpacity={0.4}
              />
            </AreaStack>
          ))}
        {props.type === "lineSeries" &&
          (props.stock === "all" ? (
            <>
              <LineSeries
                dataKey='Austin'
                data={data1}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                curve={curve}
              />
              <LineSeries
                dataKey='New York'
                data={data2}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                curve={curve}
              />
              )
              <LineSeries
                dataKey='San Francisco'
                data={data3}
                xAccessor={xAccessor}
                yAccessor={yAccesor}
                curve={curve}
              />
            </>
          ) : (
            <LineSeries
              dataKey='San Francisco'
              data={dataMapping[props.stock]}
              xAccessor={xAccessor}
              yAccessor={yAccesor}
              stroke={props.color[0]}
              curve={curve}
            />
          ))}
      </XYChart>
    </div>
  );
}
