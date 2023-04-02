import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components.module';
import { PipesModule } from './pipes.module';
import { DirectivesModule } from './directives.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [
    CommonModule,
    PipesModule,
    DirectivesModule
  ]
})
export class CustomModule { }
