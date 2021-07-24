import React, { useState } from "react";
import { Box, Button, Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { CrossDeviceApplication } from "../../shared-application/CrossDeviceApplication";
interface ErrorPageProps {
  message?: string;
  reconnect: boolean;
  toHomePage?: boolean;
  application: CrossDeviceApplication;
}

export function ErrorPage(props: ErrorPageProps) {
  const [timer, setTimer] = useState(5);
  useEffect(() => {
    if (props.reconnect) {
      const time = setTimeout(() => {
        if (timer === 1) {
          console.log(props.toHomePage);
          if (props.toHomePage) {
            window.location.href = props.application.getHomepageURL();
            window.location.replace(props.application.getHomepageURL());
            console.log("Redirecting to" + props.application.getHomepageURL());
          } else {
            window.location.href = props.application.getFullURL();
            window.location.reload();
          }
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
      return () => {
        clearTimeout(time);
      };
    }
  });
  return (
    <Center h={"100vh"}>
      <Box>
        <Heading>Error</Heading>
        <Spinner></Spinner>
        <Text fontSize={"20px"}>Reconnecting in {timer}</Text>
        <Text fontSize={"20px"}>{props.message}</Text>
        <Text fontSize={"20px"}>
          Ensure you are running the Tinylicious Fluid Server\nUse:`npm run
          start:server`
        </Text>
        <Button
          onClick={() => {
            const element = document.createElement("a");
            element.setAttribute("href", "../certificates/host.crt");
            element.setAttribute("download", "host.crt");

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
          }}
        >
          Download Certificate
        </Button>
      </Box>
    </Center>
  );
}
