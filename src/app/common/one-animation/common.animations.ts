import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export function fly_ErrorMessage() {
  return trigger('fly_error_message', [
    state('show', style({transform: 'translateX(0)'})),
    transition('void => *', [
      animate(300, keyframes([
        style({opacity: 0, transform: 'translateX(-60px)', offset: 0}),
        style({opacity: 1, transform: 'translateX(15px)', offset: 0.3}),
        style({opacity: 1, transform: 'translateX(0)', offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(300, keyframes([
        style({opacity: 1, transform: 'translateX(0)', offset: 0}),
        style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
        style({opacity: 0, transform: 'translateX(60px)', offset: 1.0})
      ]))
    ])
  ]);
}

export function fly_NotificationMessage() {
  return trigger('fly_notification_message', [
    state('show', style({transform: 'translateY(0)'})),
    transition('void => *', [
      animate(600, keyframes([
        style({opacity: 0, transform: 'translateY(60px)', offset: 0}),
        style({opacity: 1, transform: 'translateY(-15px)', offset: 0.3}),
        style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(600, keyframes([
        style({opacity: 1, transform: 'translateY(0)', offset: 0}),
        style({opacity: 1, transform: 'translateY(15px)', offset: 0.7}),
        style({opacity: 0, transform: 'translateY(-60px)', offset: 1.0})
      ]))
    ])
  ]);
}

export function fly_LocateWidgets() {
  return trigger('fly_locate_widget', [
    state('show', style({right: '50px'})),
    transition('void => *', [
      animate(300, keyframes([
        style({right: '-30px', offset: 0}),
        style({right: '75px', offset: 0.2}),
        style({right: '30px', offset: 0.5}),
        style({right: '50px', offset: 1.0})
      ]))
    ]),
    transition('* => void', [
      animate(300, keyframes([
        style({right: '50px', offset: 0}),
        style({right: '75px', offset: 0.8}),
        style({right: '-30px', offset: 1.0})
      ]))
    ])
  ]);
}

export function thrilling_AlertCircle() {
  return trigger('thrilling_alert_circle', [
    state('one', style({transform: 'translateX(0)'})),
    transition('one => *', [
      animate(300, keyframes([
        style({transform: 'translateX(-7px)', offset: 0}),
        style({transform: 'translateX(7px)', offset: 0.2}),
        style({transform: 'translateX(-7px)', offset: 0.4}),
        style({transform: 'translateX(3px)', offset: 0.6}),
        style({transform: 'translateX(-3px)', offset: 0.8}),
      ]))
    ]),
    transition('* => one', [
      animate(300, keyframes([
        style({transform: 'translateX(-7px)', offset: 0}),
        style({transform: 'translateX(7px)', offset: 0.2}),
        style({transform: 'translateX(-7px)', offset: 0.4}),
        style({transform: 'translateX(3px)', offset: 0.6}),
        style({transform: 'translateX(-3px)', offset: 0.8}),
      ]))
    ])
  ]);
}

export function shrinkInOut() {
  return trigger('shrinkInOut', [
    state('in', style({height: '*'})),
    transition('void => *', [
      style({height: '0'}),
      animate(150, style({height: '*'}))
    ]),
    transition('* => void', [
      style({height: '*'}),
      animate(150, style({height: 0}))
    ])
  ]);
}
