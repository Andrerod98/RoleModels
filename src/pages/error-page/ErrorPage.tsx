import React, { useState } from "react";
import { Box, Button, Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { CrossDeviceApplication } from "../../shared-application/CrossDeviceApplication";
import { GrCertificate } from "react-icons/gr";
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
          if (props.toHomePage) {
            window.location.href = props.application.getHomepageURL();
            window.location.replace(props.application.getHomepageURL());
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
    <Box
      w={"100vw"}
      h={"100vh"}
      bg={"rgba(0,0,0, 0.75)"}
      position={"absolute"}
      left={0}
      top={0}
    >
      <Center h={"100%"} w={"100%"}>
        <Box>
          <Heading color={"white"} w={"100%"} textAlign={"center"}>
            {"Connecting..."}
          </Heading>
          <Center w={"100%"}>
            <Spinner size={"xl"} color={"white"} borderWidth={"5px"} my={5} />
          </Center>
          <Text
            fontSize={"20px"}
            w={"100%"}
            textAlign={"center"}
            color={"white"}
          >
            {props.message}
          </Text>
          <Center w={"100%"}>
            <Button
              rightIcon={<GrCertificate />}
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
          </Center>
        </Box>
      </Center>
    </Box>
  );
  /*<Center h={"100vh"}>
      <Box>
        <Heading>Redirecting...</Heading>
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
        </Center>*/
}
