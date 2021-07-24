/* eslint-disable no-undef */
import React from "react";
import { PDFReaderUI, PDFReaderView } from ".";
import { GenericController } from "../UIComponent";

export class PDFReaderController extends GenericController<PDFReaderUI> {
  generateWidget(): JSX.Element {
    return <PDFReaderView controller={this} />;
  }
}
