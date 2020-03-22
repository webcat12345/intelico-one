import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export function flyIn(duration, size, fromRight, opacityStart = 0, index = 0) {

  return trigger(index > 0 ? 'flyInOut' + index : 'flyInOut', [
    state('show', style({transform: 'translateX(0)'})),
    transition('void => *', [
      animate(duration, keyframes([
        style({opacity: opacityStart, transform: 'translateX(' + (fromRight ? size : -1 * size) + 'px)', offset: 0}),
        style({opacity: 1, transform: 'translateX(0)', offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(duration, keyframes([
        style({opacity: 1, transform: 'translateX(0)', offset: 0}),
        style({opacity: opacityStart, transform: 'translateX(' + (fromRight ? size : -1 * size) + 'px)', offset: 1.0})
      ]))
    ])
  ]);
}

export function dropIn(duration, size, fromBottom, opacityStart = 0, index = 0) {

  return trigger(index > 0 ? 'dropInOut' + index : 'dropInOut', [
    state('show', style({transform: 'translateY(0)'})),
    transition('void => *', [
      animate(duration, keyframes([
        style({opacity: opacityStart, transform: 'translateY(' + (fromBottom ? size : -1 * size) + 'px)', offset: 0}),
        style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(duration, keyframes([
        style({opacity: 1, transform: 'translateY(0)', offset: 0}),
        style({opacity: opacityStart, transform: 'translateY(' + (fromBottom ? size : -1 * size) + 'px)', offset: 1.0})
      ]))
    ])
  ]);
}
