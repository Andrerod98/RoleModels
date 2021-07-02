import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { PrototypingToolInstantiationFactory } from "./shared-object/PrototypingToolDataObject";

export const PrototypingToolContainerFactory =
  new ContainerRuntimeFactoryWithDefaultDataStore(
    PrototypingToolInstantiationFactory,
    new Map([PrototypingToolInstantiationFactory.registryEntry]),
    [],
    []
  );
