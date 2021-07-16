import { Center, Box } from "@chakra-ui/react";
import React from "react";
import QrReader from "react-qr-reader";
import Utils from "../utils/Utils";
interface CustomQRReaderProps {
  onScan: (view: string, qr: string, from: string) => void;
  onClose: () => void;
}
export function CustomQRReader({ onScan, onClose }: CustomQRReaderProps) {
  return (
    <Center h={"100%"} onClick={onClose}>
      <Box
        borderWidth={"10px"}
        borderColor={"black"}
        width={"400px"}
        height={"400px"}
        position={"relative"}
      >
        <QrReader
          showViewFinder={false}
          style={{
            width: "100%",
          }}
          delay={300}
          onError={() => {
            return console.log("Error");
          }}
          onScan={(data: string) => {
            console.log(data);
            if (data !== null) {
              if (Utils.validURL(data)) {
                window.location.href = data;
                window.location.reload();
              } else {
                if (data.startsWith("view/")) {
                  const subStr = data.substr(5).split("#from=");
                  const value = subStr[0];
                  const from = subStr[1];

                  //const view = props.app.getSharedObject().getView(value);

                  onScan(value, "", from);
                } else if (data.startsWith("qr/")) {
                  const subStr = data.substr(3).split("#from=");
                  const value = subStr[0];
                  const from = subStr[1];
                  //props.app.getSharedObject().getQRCode(value).scan();
                  onScan("", value, from);
                }
              }
            }
          }}
        />
        <Box
          position={"absolute"}
          left={0}
          right={0}
          top={0}
          bottom={0}
          m={"auto"}
        >
          <Center h={"100%"}>
            <Box
              w={"300px"}
              h={"300px"}
              bg={"transparent"}
              backgroundRepeat={"no-repeat"}
              backgroundSize={"20px 20px"}
              background={`
            linear-gradient(to right, white 4px, transparent 4px) 0 0,
            linear-gradient(to right, white 4px, transparent 4px) 0 100%,
            linear-gradient(to left, white 4px, transparent 4px) 100% 0,
            linear-gradient(to left, white 4px, transparent 4px) 100% 100%,
            linear-gradient(to bottom, white 4px, transparent 4px) 0 0,
            linear-gradient(to bottom, white 4px, transparent 4px) 100% 0,
            linear-gradient(to top, white 4px, transparent 4px) 0 100%,
            linear-gradient(to top, white 4px, transparent 4px) 100% 100%;`}
            ></Box>
          </Center>
        </Box>
      </Box>
    </Center>
  );
}
