import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { IdentifierType } from '@one-core/model';
import { environment } from '../../../environments/environment';
import * as fromNotification from './notification.reducer';
import * as fromResource from './resource.reducer';

export interface State {
  notification: fromNotification.State;
  resource: fromResource.State;
}

export const reducers: ActionReducerMap<State> = {
  notification: fromNotification.reducer,
  resource: fromResource.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectNotificationFeature = createFeatureSelector('notification');
export const getNotifications = createSelector(selectNotificationFeature, (state: fromNotification.State) => state.notifications);
export const getNotificationCount = createSelector(selectNotificationFeature, (state: fromNotification.State) => state.totalCount);
export const getNotificationShowList = createSelector(selectNotificationFeature, (state: fromNotification.State) => state.showList);

export const selectResourceFeature = createFeatureSelector('resource');
export const getIdentifierTypes = createSelector(selectResourceFeature, (state: fromResource.State) => state.identifierTypes);
export const getIdentifierTypesNotVideo = createSelector(selectResourceFeature, (state: fromResource.State) => state.identifierTypes.filter(x => x.id !== IdentifierType.Video));
export const getSourceTypes = createSelector(selectResourceFeature, (state: fromResource.State) => state.sourceTypes);
