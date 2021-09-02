/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-vars */

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { CrossDeviceApplication } from "./shared-application/CrossDeviceApplication";
import { ErrorPage } from "./pages/error-page/ErrorPage";
import Utils from "./utils/Utils";
import { LandingPage } from "./pages/landing-page/LandingPage";

const HASH = window.location.hash.substring(1);
const HASH_PARTS = Utils.getURLHashParts(HASH);
const PROJECT_NAME = HASH_PARTS["project"];
const IP = window.location.hostname;
let dataObjectStarted = false;

/*} <Grid
      h={"100vh"}
      w={"100vw"}
      templateRows='repeat(3, 1fr)'
      templateColumns='repeat(3, 1fr)'
      gap={0}
    >
      <GridItem rowSpan={1} colSpan={1}>
        <Heading>Stocks</Heading>

        <Flex>
          <Input placeholder='Basic usage' />
          <Button>Search</Button>
        </Flex>
        <StatGroup>
          <Stat>
            <StatLabel>Current Stock:</StatLabel>
            <StatNumber>AAPL</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Current Value:</StatLabel>
            <StatNumber>295$</StatNumber>
          </Stat>
        </StatGroup>
        <StatGroup>
          <Stat>
            <StatLabel>Volume</StatLabel>
            <StatNumber>£0.00</StatNumber>
            <StatHelpText>Feb 12 - Feb 28</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Previous Close</StatLabel>
            <StatNumber>345,670</StatNumber>
            <StatHelpText>
              <StatArrow type='increase' />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Open</StatLabel>
            <StatNumber>45</StatNumber>
            <StatHelpText>
              <StatArrow type='decrease' />
              9.05%
            </StatHelpText>
          </Stat>
        </StatGroup>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Box w={WIDTH} h={HEIGHT}>
          <MapPlot />
        </Box>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Box w={WIDTH} h={400}>
          <BarStack />
        </Box>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Box w={WIDTH} h={HEIGHT}>
          <PieChart />
        </Box>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Box w={WIDTH} h={HEIGHT}>
          <ScatterPlot />
        </Box>
      </GridItem>

      <GridItem rowSpan={1} colSpan={1}>
        <Box w={WIDTH} h={HEIGHT}>
          <Box w={WIDTH} h={HEIGHT / 3}>
            <BarChart currentStock={"apple"} accentColor={"green"} />
          </Box>
          <Box w={WIDTH} h={HEIGHT / 3}>
            <BarChart currentStock={"amazon"} accentColor={"yellow"} />
          </Box>
          <Box w={WIDTH} h={HEIGHT / 3}>
            <BarChart currentStock={"microsoft"} accentColor={"red"} />
          </Box>
        </Box>
      </GridItem>
      <GridItem rowSpan={1} colSpan={3}>
        <Box w={"100%"} h={HEIGHT}>
          <XYChartGraph />
        </Box>
      </GridItem>
      <GridItem>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Currency</Th>
              <Th>Buy</Th>
              <Th>Sell</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </GridItem>
      <GridItem>
        <Box w={WIDTH} h={HEIGHT}>
          <Image
            w={"100%"}
            objectFit='cover'
            h={"100%"}
            src='/public/chart.png'
          ></Image>
        </Box>
      </GridItem>
      <GridItem>
        <Box w={WIDTH} h={HEIGHT}>
          <Image
            w={"100%"}
            objectFit='cover'
            h={"100%"}
            src='/public/date.png'
          ></Image>
        </Box>
      </GridItem>
</Grid>
  </ChakraProvider>,

  document.getElementById("content")
);

}

}
*/

if (PROJECT_NAME === undefined) {
  ReactDOM.render(
    <ChakraProvider resetCSS>
      <LandingPage
        ip={IP}
        onCreate={(name: string) => {
          const application = new CrossDeviceApplication(IP, name);
          application
            .start(true)
            .catch((e) => {
              console.error(e);

              ReactDOM.render(
                <ChakraProvider resetCSS>
                  <ErrorPage
                    application={application}
                    reconnect={true}
                    message={"The project already exists! Redirecting..."}
                  />
                </ChakraProvider>,

                document.getElementById("content")
              );
            })
            .then(() => {
              window.location.href = application.getFullURL();
              window.location.reload();
            });
        }}
      />
    </ChakraProvider>,

    document.getElementById("content")
  );
} else {
  const application = new CrossDeviceApplication(IP, PROJECT_NAME);

  application
    .start(false)
    .catch((e: Error) => {
      // The container does not exist
      console.error(e.message);

      ReactDOM.render(
        <ChakraProvider resetCSS>
          <ErrorPage
            application={application}
            reconnect={true}
            message={e.message}
          />
        </ChakraProvider>,

        document.getElementById("content")
      );
    })
    .then(() => {
      application.getContainer().on("disconnected", () => {
        ReactDOM.render(
          <ChakraProvider resetCSS>
            <ErrorPage
              application={application}
              reconnect={true}
              message={"The container has been disconnected. Reconnecting..."}
            />
          </ChakraProvider>,

          document.getElementById("content")
        );
      });
      application.getContainer().on("closed", () => {
        ReactDOM.render(
          <ChakraProvider resetCSS>
            <ErrorPage
              application={application}
              reconnect={true}
              toHomePage={true}
              message={"The container has been closed."}
            />
          </ChakraProvider>,

          document.getElementById("content")
        );
      });

      application.getContainer().on("connected", () => {
        if (dataObjectStarted) {
          return;
        }
        console.log("The container is connected.");
        window.location.href = application.getFullURL();
        window.location.reload();
        //application.render(document.getElementById("content"));
      });

      application.getSharedObject().on("connected", () => {
        console.log("The data object is connected.");
        dataObjectStarted = true;
        application.render(document.getElementById("content"));
      });
    });
}
