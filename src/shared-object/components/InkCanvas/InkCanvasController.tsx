/* eslint-disable no-undef */
import { IColor, IInk } from "@fluidframework/ink";
import React from "react";
import { InkCanvasUI, InkCanvasView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { InkCanvas } from "./inkCanvas";

export class InkCanvasController extends UIComponentController {
  private inkCanvas: InkCanvas;

  constructor(
    protected model: InkCanvasUI,
    private readonly ink: IInk,
    readonly factoriesManager
  ) {
    super(model, factoriesManager);
  }

  getInk(): IInk {
    return this.ink;
  }

  setColor(color: IColor): void {
    this.inkCanvas.setPenColor(color);
  }

  setStroke(thickness: number): void {
    this.inkCanvas.setPenThickness(thickness);
  }

  public setInkCanvas(canvasElement: HTMLCanvasElement) {
    this.inkCanvas = new InkCanvas(canvasElement, this.getInk());
  }

  public replay() {
    this.inkCanvas.replay();
  }

  public clear() {
    this.inkCanvas.clear();
  }

  /* private createColorPicker() {
    const inkColorPicker = document.createElement("div");
    inkColorPicker.classList.add("ink-color-picker");

    for (const color of colorPickerColors) {
      inkColorPicker.appendChild(this.createColorOption(color));
    }

    return inkColorPicker;
  }*/

  /* private createColorOption(color: IColor) {
    const inkColorOption = document.createElement("button");
    inkColorOption.classList.add("ink-color-option");
    inkColorOption.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

    inkColorOption.addEventListener("click", () => {
      this.inkCanvas.setPenColor(color);
      this.toggleColorPicker();
    });

    return inkColorOption;
  }

  private toggleColorPicker() {
    this.inkColorPicker.classList.toggle("show");
  }*/

  public sizeCanvas(width?: number, height?: number) {
    this.inkCanvas.sizeCanvasBackingStore(width, height);
  }

  generateWidget(): JSX.Element {
    return <InkCanvasView controller={this} />;
  }
}
