import { IType } from '@one-core/service/types.service';
import { ResourceActions, ResourceActionTypes } from '../actions/resource.actions';

export interface State {
  identifierTypes: IType[];
  sourceTypes: IType[];
}

export const initialState: State = {
  identifierTypes: [],
  sourceTypes: []
};

export function reducer(state = initialState, action: ResourceActions): State {
  switch (action.type) {
    case ResourceActionTypes.LoadIdentifierTypesSuccess: {
      return {...state, identifierTypes: action.payload};
    }
    case ResourceActionTypes.LoadSourceTypesSuccess: {
      return {...state, sourceTypes: action.payload};
    }
    default:
      return state;
  }
}
