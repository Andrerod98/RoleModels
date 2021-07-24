import React from "react";
import { PDFReaderUI } from ".";
import { PDFReaderController } from "./PDFReaderController";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
export function PDFReaderView({
  controller,
}: {
  controller: PDFReaderController;
}) {
  const component = controller.get() as PDFReaderUI;

  return (
    <Document file={component.url}>
      <Page pageNumber={component.page} />
    </Document>
  );
}
