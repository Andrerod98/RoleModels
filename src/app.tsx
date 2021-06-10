/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-vars */

import React from "react";
import ReactDOM from "react-dom";
import { DesignTool } from "./design-tool/App";
import { CrossDeviceApplication } from "./prototyping-tool/Application";
import { BoxUI } from "./prototyping-tool/shared-object/components/Box";
import { IUIComponent } from "./prototyping-tool/shared-object/components/UIComponent";
import { View } from "./prototyping-tool/shared-object/views/View";
// const _ = require("lodash");
const application = new CrossDeviceApplication("127.0.0.1", "untitled");

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
    if (application.isFirstClient()) {
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
    });

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
    interactions();*/

    ReactDOM.render(
      <DesignTool></DesignTool>,
      // ,
      // React.createElement("button", { className: "sidebar" }, [
      /* <ChakraProvider>
        <MainComponent key={"object"} app={application} />
      </ChakraProvider>,*/

      // ]),
      document.getElementById("content")
    );
  });
