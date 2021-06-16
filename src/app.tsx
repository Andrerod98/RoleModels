/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-vars */

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { LandingPage } from "./design-tool/components/LandingPage";
import { Project } from "./design-tool/Project";
import { CrossDeviceApplication } from "./prototyping-tool/Application";
// const _ = require("lodash");

const hash = window.location.hash.substring(1);

const result = hash.split("&").reduce(function (res, item) {
  const parts = item.split("=");
  res[parts[0]] = parts[1];
  return res;
}, {});

const projectName = result["project"];

console.log(projectName);

if (projectName === undefined) {
  ReactDOM.render(
    <ChakraProvider>
      <LandingPage
        ip={"192.168.1.72"}
        onCreate={(name: string) => {
          const application = new CrossDeviceApplication(
            "192.168.1.72",
            name,
            true
          );
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
  const application = new CrossDeviceApplication(
    "192.168.1.72",
    projectName,
    false
  );

  application
    .start()
    .catch((e) => {
      console.error(e);
      console.log(
        "%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`",
        "font-size:30px"
      );
    })
    .then(async () => {
      application.getSharedObject().once("connected", () => {
        const project = new Project(projectName, application);

        application.render(document.getElementById("content"), project);
        /*ReactDOM.render(
          <ChakraProvider>
            <MainComponent key={"object"} app={application} project={project} />
          </ChakraProvider>,

          document.getElementById("content")
        );*/
      });
    });
}

/*if (application.isFirstClient()) {
      const presenter = application.addRole("presenter");
      application.addRole("assistant");
      // const remote = application.addRole("remote");

      const root: IUIComponent = {
        id: "test",
        name: "center",
        value: "Teste2",
        children: [
          {
            id: "box",
            name: "box",
            value: "Teste",
            bg: "black",
            w: "200px",
            children: [
              {
                id: "test2",
                name: "button",
                value: "Teste",
                children: [],
              },
            ],
          } as BoxUI,
        ],
      };

      const remoteView = new View("remote-view", 12, 1, "", root);

      presenter.addView(remoteView);
    }

    const view = application.getViewOrCombinedView("presenter", "remote-view");

    view.getComponentByID("test2").addEventListener({
      onClick: () => {
        alert("LETS GO");
      },
    });*/

/* const interactions = () => {
      // const assistant = application.getRole("assistant");

      const view = application.getViewOrCombinedView(
        "assistant",
        "overview-view"
      );
      const slides = [];
      for (let i = 0; i < 10; i++) {
        slides.push(view.getComponent("slide-image-" + i));
      }

      slides.forEach((slide, index) => {
        slide.addEventListener({
          onClick: () => {
            console.log("clicked");
            const presenterView = application.getViewOrCombinedView(
              "assistant",
              "presenter-view"
            );

            const bigSlide = presenterView.getComponent("current-slide");
            const bigSlideComp = bigSlide.component as SlideModel;

            console.log(bigSlideComp);

            slides.forEach((s, index) => {
              s.component.style = {
                cursor: "pointer",
              };
            });

            slide.component.style = {
              ...slide.component.style,
              border: "5px solid red",
            };

            bigSlideComp.slide = index + 1;
            bigSlideComp.src = "public/ppt/slide" + bigSlideComp.slide + ".png";
            application
              .getSharedObject()
              .updateViewOrCombinedView("assistant", presenterView);
            application
              .getSharedObject()
              .updateViewOrCombinedView("assistant", view);
          },
        });
      });
    };

    application.defineInteractions(interactions);
    interactions();


    if (documentId === undefined) {
      const project = new Project("untitled", application);
      ReactDOM.render(
        <DesignTool project={project}></DesignTool>,
        // ,
        // React.createElement("button", { className: "sidebar" }, [
        /* <ChakraProvider>
        <MainComponent key={"object"} app={application} />
      </ChakraProvider>,

        // ]),
        document.getElementById("content")
      );
    } else {
      ReactDOM.render(
        <ChakraProvider>
          <MainComponent key={"object"} app={application} />
        </ChakraProvider>,

        document.getElementById("content")
      );
    }
  });*/
