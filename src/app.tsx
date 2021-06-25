/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-vars */

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { CrossDeviceApplication } from "./CrossDeviceApplication";
import { ErrorPage } from "./ErrorPage";

import { LandingPage } from "./LandingPage";

import Utils from "./utils/Utils";

const HASH = window.location.hash.substring(1);
const HASH_PARTS = Utils.getURLHashParts(HASH);
const PROJECT_NAME = HASH_PARTS["project"];
const IP = window.location.hostname;

/*
ReactDOM.render(
  <ChakraProvider resetCSS>
    <Decay />
  </ChakraProvider>,

  document.getElementById("content")
);
*/

if (PROJECT_NAME === undefined) {
  ReactDOM.render(
    <ChakraProvider resetCSS>
      <LandingPage
        ip={IP}
        onCreate={(name: string) => {
          const application = new CrossDeviceApplication(IP, name, true);
          application
            .start()
            .catch((e) => {
              console.error(e);

              ReactDOM.render(
                <ChakraProvider resetCSS>
                  <ErrorPage
                    message={"The project already exists! Redirecting..."}
                  />
                </ChakraProvider>,

                document.getElementById("content")
              );
            })
            .then(() => {
              window.location.href = application.getFullHost();
              window.location.reload();
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
    .catch((e: Error) => {
      // The container does not exist
      console.error(e.message);

      ReactDOM.render(
        <ChakraProvider resetCSS>
          <ErrorPage message={e.message} />
        </ChakraProvider>,

        document.getElementById("content")
      );
    })
    .then(() => {
      application.getContainer().on("disconnected", () => {
        ReactDOM.render(
          <ChakraProvider resetCSS>
            <ErrorPage
              message={"The container has been disconnected. Reconnecting..."}
            />
          </ChakraProvider>,

          document.getElementById("content")
        );
      });
      application.getContainer().on("closed", () => {
        ReactDOM.render(
          <ChakraProvider resetCSS>
            <ErrorPage message={"The container has been closed."} />
          </ChakraProvider>,

          document.getElementById("content")
        );
      });

      application.getContainer().on("connected", () => {
        console.log("The container is connected.");
        //application.render(document.getElementById("content"));
      });

      application.getSharedObject().on("connected", () => {
        console.log("The data object is connected.");
        application.render(document.getElementById("content"));
      });
    });
}
