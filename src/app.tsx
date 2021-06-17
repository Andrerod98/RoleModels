/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-vars */

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { LandingPage } from "./design-tool/components/LandingPage";
import { CrossDeviceApplication } from "./prototyping-tool/Application";
import Utils from "./prototyping-tool/utils/utils";

const HASH = window.location.hash.substring(1);
const HASH_PARTS = Utils.getURLHashParts(HASH);
const PROJECT_NAME = HASH_PARTS["project"];
const IP = window.location.hostname;

if (PROJECT_NAME === undefined) {
  ReactDOM.render(
    <ChakraProvider>
      <LandingPage
        ip={IP}
        onCreate={(name: string) => {
          const application = new CrossDeviceApplication(IP, name, true);
          application
            .start()
            .catch((e) => {
              console.error(e);
              console.log(
                "%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`",
                "font-size:30px"
              );
            })
            .then(() => {
              //window.location.href = application.getFullHost();
              //window.location.reload();
            });
        }}
      />
    </ChakraProvider>,

    document.getElementById("content")
  );
} else {
  const application = new CrossDeviceApplication(IP, PROJECT_NAME, false);

  application
    .start()
    .catch((e) => {
      console.error(e);
      console.log(
        "%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`",
        "font-size:30px"
      );
    })
    .then(() => {
      console.log("started");

      console.log(application.getContainer().attachState);
      application.getContainer().on("connected", () => {
        console.log("Container connected");
      });
      application.getContainer().on("disconnected", () => {
        console.log("Container disconnected");
      });
      application.getContainer().on("closed", () => {
        console.log("Container closed");
      });
      application.getSharedObject().on("connected", () => {
        console.log("Data object connected");
      });
      /* application.getSharedObject().once("connected", () => {
        application.render(document.getElementById("content"));
      }); */
    });
}
