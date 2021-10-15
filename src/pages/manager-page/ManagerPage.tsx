/* eslint-disable prettier/prettier */
/* eslint-disable no-unreachable */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  Button,
  Link,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { CrossAppContext, CrossAppState } from "../../context/AppContext";
import { WorkspacesTable } from "./components/WorkspacesTable";
import { DevicesTable } from "./components/DevicesTable";
import { RolesTable } from "./components/RolesTable";

const QRCode = require("qrcode.react");

export function ManagerPage() {
  const { devices, app } = useContext<CrossAppState>(CrossAppContext);
  return (
    <Box>
      <Stack
        m='40px'
        boxShadow={"xs"}
        p='20px'
        align='center'
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "column", "row", "row"]}
      >
        <QRCode key='qr' value={app.getFullURL()} />

        <Link
          target={"_blank"}
          href={app.getFullURL()}
          rel='noreferrer'
          isExternal
        >
          <Text fontSize={{ base: "10px", md: "16px", lg: "24px" }}>
            {app.getFullURL()}
          </Text>
        </Link>
        <Button
          onClick={() => {
            window.location.href = "https://" + app.getServerURL() + ":8080/#";
            window.location.replace(
              "https://" + app.getServerURL() + ":8080/#"
            );
            window.location.reload();
          }}
        >
          Create new project
        </Button>
        <Spacer />
        <Stat key='stat'>
          <StatLabel>Connected Devices</StatLabel>
          <StatNumber>{devices.length}</StatNumber>
        </Stat>
      </Stack>

      <Tabs variant='enclosed'>
        <TabList pl={"20px"}>
          <Tab>Devices</Tab>
          <Tab>Roles</Tab>
          <Tab>Workspaces</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DevicesTable />
          </TabPanel>
          <TabPanel>
            <RolesTable />
          </TabPanel>
          <TabPanel>
            <WorkspacesTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
