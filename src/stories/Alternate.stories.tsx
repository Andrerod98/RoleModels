import React from "react";
import { Story, Meta } from "@storybook/react";

import { PrototypingToolInstantiationFactory } from "../shared-object/PrototypingToolDataObject";
import { FluidLoader } from "../utils/fluidRendering/fluidLoader";
import { MainComponent } from "../components/MainComponent";
import { PrototypingToolContainerFactory } from "../shared-object";

export default {
  title: "CombinedViews/Alternate",
  component: FluidLoader,
} as Meta;

export const Demo: Story<any> = (args) => (
  <FluidLoader
    factory={PrototypingToolContainerFactory}
    title={PrototypingToolInstantiationFactory.type}
    view={MainComponent}
    viewType={"react"}
  ></FluidLoader>
);
