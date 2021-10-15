import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { RoleModelsInstantiationFactory } from "./shared-object/RoleModelsDataObject";

export const RoleModelsContainerFactory =
  new ContainerRuntimeFactoryWithDefaultDataStore(
    RoleModelsInstantiationFactory,
    new Map([RoleModelsInstantiationFactory.registryEntry]),
    [],
    []
  );
