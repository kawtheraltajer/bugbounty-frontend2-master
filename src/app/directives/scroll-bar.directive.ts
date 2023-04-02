import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'ion-content'
})
export class ScrollbarDirective implements OnInit {

  @Input() scrollbar: string
  @Input() allowAllScreens: boolean | string

  hostElement: HTMLElement

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
    this.hostElement = this.elementRef.nativeElement
    let el = document.createElement('style')
    el.innerText = this.getCustomStyle();
    this.hostElement.shadowRoot.appendChild(el)
  }

  getCustomStyle() {
    return `
    @media(pointer: fine) {
    ::-webkit-scrollbar {
      border-radius: 8px;
      width: 10px;
      height: 10px;
      background: white !important;
    }
    
    ::-webkit-scrollbar-thumb {
      height: 6px;
      border-radius: 8px;
      background-clip: padding-box;
    background: #d1d1e1;
      padding: 1px;
    }
    ::-webkit-scrollbar-button {
      width: 0;
      height: 0;
      display: none;
    }
    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }}`
  }

}