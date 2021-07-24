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
