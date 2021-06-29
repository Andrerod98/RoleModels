/* eslint-disable prettier/prettier */
/* eslint-disable no-unreachable */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Text,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { IDevice } from "../../shared-object/devices/IDevice";
import { Header } from "../header/Header";
import { LayoutsTable } from "./LayoutsTable";
import { RolesTable } from "./RolesTable";

const QRCode = require("qrcode.react");

interface DevicesIndicatorProps {
  // device: IDevice;
  deviceCount: number;
}

export const DevicesIndicator: FC<DevicesIndicatorProps> = (props) => (
  <div className='deviceName'>
    <span className='deviceCount'>
      Connected: {props.deviceCount}
      {props.deviceCount > 1 ? " devices" : " device"}
    </span>
  </div>
);

interface RoleChangerProps {
  onPrevious: () => void;
  onNext: () => void;
  onSet: () => void;
}

export const RoleChanger: FC<RoleChangerProps> = (props) => (
  <div></div>
  /* <ButtonGroup aria-label='Basic example'>
    <Button variant='dark' onClick={props.onPrevious}>
      {"	\u2190"}
    </Button>
    <Button variant='primary' onClick={props.onSet}>
      {" \u2713 "}
    </Button>
    <Button variant='dark' onClick={props.onNext}>
      {"\u2192"}
    </Button>
  </ButtonGroup>*/
);

interface ManagerComponentProps {
  devices: IDevice[];
  readonly app: CrossDeviceApplication;
}

/*
const DeviceRoleItem = (props: { roles: IRole[] }) => (
  <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      Select a role
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {props.roles.map((role) => (
        <Dropdown.Item>{role.name}</Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);
*/
export const ManagerComponent: FC<ManagerComponentProps> = (props) => {
  const model = props.app.getSharedObject();
  return (
    <div>
      <div>
        <Header
          app={props.app}
          myRole={model.getDeviceRole()}
          roles={Array.from(model.getRoles()).map((role) => role.getName())}
          onManagerClick={async () => {
            // props.model.promoteToManager();
          }}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            // setUI(props.model.getCombinedUI());
          }}
          onDesignClick={() => {
            model.promoteToDesigner();
          }}
          onLoggingOpen={() => {}}
          onViewChange={() => {}}
        />
        <Stack
          m='40px'
          boxShadow={"xs"}
          p='20px'
          align='center'
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "column", "row", "row"]}
        >
          <QRCode
            key='qr'
            value={
              "https://" +
              props.app.getServerUrl() +
              ":8080#project=" +
              model.getId()
            }
          />

          <Link
            target={"_blank"}
            href={
              "https://" +
              props.app.getServerUrl() +
              ":8080#project=" +
              model.getId()
            }
            rel='noreferrer'
            isExternal
          >
            <Text fontSize={{ base: "10px", md: "16px", lg: "24px" }}>
              https://{props.app.getServerUrl()}:8080#project=
              {model.getId()}
            </Text>
          </Link>
          <Button
            onClick={() => {
              const element = document.createElement("a");
              element.setAttribute("href", "../../../host.crt");
              element.setAttribute("download", "host.crt");

              element.style.display = "none";
              document.body.appendChild(element);

              element.click();

              document.body.removeChild(element);
            }}
          >
            Download Certificate
          </Button>
          <Spacer />
          <Stat key='stat'>
            <StatLabel>Connected Devices</StatLabel>
            <StatNumber>{props.devices.length}</StatNumber>
          </Stat>
        </Stack>
      </div>
      <div>
        <Tabs variant='enclosed'>
          <TabList pl={"20px"}>
            <Tab>Roles</Tab>
            <Tab>Configurations</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RolesTable app={props.app} devices={props.devices} />
            </TabPanel>
            <TabPanel>
              <LayoutsTable app={props.app} devices={props.devices} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};
