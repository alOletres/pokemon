import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appImage]',
})
export class ImageDirective {
  @Input() appImage: any;
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    let el = this.el.nativeElement;
    let data = this.appImage;
    console.log(data[0]);
    el.innerHTML =`<img [src]="${data[0]}" height="50" width="50" alt="">`
  }
}
