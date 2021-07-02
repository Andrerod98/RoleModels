import React from "react";
import { Story, Meta } from "@storybook/react";

import { FluidLoader } from "../utils/fluidRendering/fluidLoader";
import { CrossDeviceApplicationView } from "../shared-application/CrossDeviceApplicationView";
import { PrototypingToolContainerFactory } from "../shared-application";
import { PrototypingToolInstantiationFactory } from "../shared-application/shared-object/PrototypingToolDataObject";

export default {
  title: "CombinedViews/Alternate",
  component: FluidLoader,
} as Meta;

export const Demo: Story<any> = (args) => (
  <FluidLoader
    factory={PrototypingToolContainerFactory}
    title={PrototypingToolInstantiationFactory.type}
    view={CrossDeviceApplicationView}
    viewType={"react"}
  ></FluidLoader>
);
