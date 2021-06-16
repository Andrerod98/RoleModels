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
} from "@chakra-ui/react";
import React, { FC } from "react";
import { CrossDeviceApplication } from "../../Application";
import { IDevice } from "../../shared-object/devices/IDevice";
import { Header } from "../header/Header";

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
          roles={model.getRoles().map((role) => role.getName())}
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
              https://{props.app.getServerUrl()}:8080#documentId=
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
        <hr></hr>
      </div>
      <div>
        <Table variant='simple'>
          <TableCaption>Roles - Devices Mapping</TableCaption>
          <Thead>
            <Tr>
              <Th>Device Id</Th>
              <Th>Device Type</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>

          <Tbody key={"table-body"}>
            {props.devices.map((device, index) => {
              return (
                <Tr key={"table-tr-" + index}>
                  <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                    {device.id}
                  </Td>
                  <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                    {device.type}
                  </Td>
                  <Td>
                    <Menu key={"menu-" + index}>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        fontSize={{ base: "10px", md: "16px", lg: "16px" }}
                      >
                        {device.role}
                      </MenuButton>
                      <MenuList key={"menu-list-" + index}>
                        {model.getRoles().map((role, index2) => (
                          <MenuItem
                            key={"menu-item-" + index2}
                            onClick={(srole) =>
                              model.promoteToRole(role.getName(), device.id)
                            }
                          >
                            {role.getName()}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}

            {/*
                  <div
                style={{
                  position: "absolute",
                  overflow: "hidden",
                  top: device.y + "px",
                  left: device.x + "px",
                  float: "none",
                }}
              >
                <Card
                  style={{
                    width: device.capabilities.width * 0.25 + "px",
                    height: device.capabilities.height * 0.25 + "px",

                    padding: "0px",
                  }}
                ></Card>
                
                <p>{role}</p>
              </div>*/}

            {/* <div>
          <Row className="justify-content-md-center">
            <Col className="text-center">{device.id}</Col>
            <Col className="text-center">{device.role}</Col>
            <Col className="text-center">
              width:{device.capabilities.width} , height:
              {device.capabilities.height}, touch:
              {device.capabilities.touch.toString()}
            </Col>
          </Row>
           </div>*/}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
