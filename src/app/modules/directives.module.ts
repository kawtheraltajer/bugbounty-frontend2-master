import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollbarDirective } from '../directives/scroll-bar.directive';
import { DragScrollContainerDirective } from '../directives/drag-scroll-container.directive';
import { MatModule } from './mat.module';



@NgModule({
  declarations: [ScrollbarDirective, DragScrollContainerDirective],
  exports: [ScrollbarDirective, DragScrollContainerDirective],
  imports: [
    CommonModule,
    MatModule
  ]
})
export class DirectivesModule { }
