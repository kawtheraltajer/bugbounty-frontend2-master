import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as tinycolor from 'tinycolor2';
@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
  @Input() currentColor: string = '#fff';
  constructor(public popoverController: PopoverController) { }

  ngOnInit() { }

  close(isDataBack: boolean) {
    if (isDataBack) {
      this.popoverController.dismiss({
        isDataBack,
        color: tinycolor(this.currentColor).toHex()
      });
    } else {
      this.popoverController.dismiss({
        isDataBack,
        color: tinycolor(this.currentColor).toHex()
      });
    }
  }

}
