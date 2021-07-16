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
import { LayoutsTable } from "./components/LayoutsTable";
import { DevicesTable } from "./components/DevicesTable";
import { RolesTable } from "./components/RolesTable";

const QRCode = require("qrcode.react");

interface ManagerPageProps {}

export function ManagerPage(props: ManagerPageProps) {
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
        <QRCode key='qr' value={app.getFullHost()} />

        <Link
          target={"_blank"}
          href={app.getFullHost()}
          rel='noreferrer'
          isExternal
        >
          <Text fontSize={{ base: "10px", md: "16px", lg: "24px" }}>
            {app.getFullHost()}
          </Text>
        </Link>
        <Button
          onClick={() => {
            app.downloadCertificate();
          }}
        >
          Download Certificate
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
            <DevicesTable app={app} devices={devices} />
          </TabPanel>
          <TabPanel>
            <RolesTable app={app} />
          </TabPanel>
          <TabPanel>
            <LayoutsTable app={app} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
