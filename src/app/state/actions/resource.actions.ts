import { Action } from '@ngrx/store';
import { IType } from '@one-core/service/types.service';

export enum ResourceActionTypes {
  LoadIdentifierTypes = '[Resource] Load IdentifierTypes',
  LoadIdentifierTypesSuccess = '[Resource] Load IdentifierTypes Success',
  LoadIdentifierTypesFailure = '[Resource] Load IdentifierTypes Failure',
  LoadSourceTypes = '[Resource] Load SourceTypes',
  LoadSourceTypesSuccess = '[Resource] Load SourceTypes Success',
  LoadSourceTypesFailure = '[Resource] Load SourceTypes Failure',
}

export class LoadIdentifierTypes implements Action {
  readonly type = ResourceActionTypes.LoadIdentifierTypes;
}

export class LoadIdentifierTypesSuccess implements Action {
  readonly type = ResourceActionTypes.LoadIdentifierTypesSuccess;

  constructor(public payload: IType[]) {
  }
}

export class LoadIdentifierTypesFailure implements Action {
  readonly type = ResourceActionTypes.LoadIdentifierTypesFailure;

  constructor(public payload: any) {
  }
}

export class LoadSourceTypes implements Action {
  readonly type = ResourceActionTypes.LoadSourceTypes;
}

export class LoadSourceTypesSuccess implements Action {
  readonly type = ResourceActionTypes.LoadSourceTypesSuccess;

  constructor(public payload: IType[]) {
  }
}

export class LoadSourceTypesFailure implements Action {
  readonly type = ResourceActionTypes.LoadSourceTypesFailure;

  constructor(public payload: IType[]) {
  }
}

export type ResourceActions = LoadIdentifierTypes
  | LoadIdentifierTypesSuccess
  | LoadIdentifierTypesFailure
  | LoadSourceTypes
  | LoadSourceTypesSuccess
  | LoadSourceTypesFailure;
