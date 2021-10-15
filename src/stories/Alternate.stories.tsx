import React from "react";
import { Story, Meta } from "@storybook/react";

import { FluidLoader } from "../utils/fluidRendering/fluidLoader";
import { CrossDeviceApplicationView } from "../shared-application/CrossDeviceApplicationView";
import { RoleModelsContainerFactory } from "../shared-application";
import { RoleModelsInstantiationFactory } from "../shared-application/shared-object/RoleModelsDataObject";

export default {
  title: "CombinedViews/Alternate",
  component: FluidLoader,
} as Meta;

export const Demo: Story<any> = (args) => (
  <FluidLoader
    factory={RoleModelsContainerFactory}
    title={RoleModelsInstantiationFactory.type}
    view={CrossDeviceApplicationView}
    viewType={"react"}
  ></FluidLoader>
);
