import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';

export function sliderQue() {
  return trigger('slider_que', [
    transition('* => *', [
      query(':leave', [
        stagger(100, [
          animate(0, keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: 0, transform: 'translateY(0)', offset: 1}),
          ]))
        ])
      ], {optional: true}),
      query(':enter', [
        style({opacity: 0}),
        stagger(100, [
          animate(300, keyframes([
            style({opacity: 0, transform: 'translateY(-30px)', offset: 0}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1}),
          ]))
        ])
      ], {optional: true})
    ])
  ]);
}
