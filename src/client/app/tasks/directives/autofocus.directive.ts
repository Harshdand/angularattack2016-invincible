import {Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective {
  constructor(private el:ElementRef, private renderer:Renderer) {
    setTimeout(function () {
      el.nativeElement.focus();
    }, 0);
  }
}