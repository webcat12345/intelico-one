import { NotificationActions, NotificationActionTypes } from '../actions/notification.actions';
import { logReducerError } from '../../core/utils/common.util';
import { Notification } from '@one-core/model';


export interface State {
  pending: boolean;
  notifications: Notification[];
  totalCount: number;
  showList: Notification[];
}

export const initialState: State = {
  notifications: [],
  pending: false,
  totalCount: 0,
  showList: []
};

export function reducer(state = initialState, action: NotificationActions): State {
  switch (action.type) {
    case NotificationActionTypes.LoadNotifications: {
      return {...state, pending: true};
    }
    case NotificationActionTypes.LoadNotificationsSuccess: {
      return {...state, notifications: action.payload.notifications, pending: false, totalCount: action.payload.count};
    }
    case NotificationActionTypes.ToggleNotifications: {
      const newState = {...state};
      try {
        if (state.showList.length > 0) {
          newState.showList = [];
        } else {
          // newState.showList = [{}].concat(state.notifications.slice(0, 10));
        }
      } catch (e) {
        logReducerError('ShowNotification', e);
      }
      return newState;
    }
    case NotificationActionTypes.ReceiveNotification: {
      state.notifications = [action.payload].concat(state.notifications);
      const newState = {...state};
      // if (state.showList.length > 0) {
      //   newState.showList = [{}].concat(new Array(...state.notifications.slice(0, 10)));
      // }
      return newState;
    }
    default:
      return state;
  }
}
