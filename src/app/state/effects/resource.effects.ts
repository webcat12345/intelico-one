import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TypeCategory, TypesService } from '@one-core/service/types.service';
import { LoadIdentifierTypesFailure, LoadIdentifierTypesSuccess, LoadSourceTypesFailure, LoadSourceTypesSuccess, ResourceActionTypes } from '../actions/resource.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class ResourceEffects {

  @Effect()
  loadIdentifierTypes$ = this.actions$.pipe(
    ofType(ResourceActionTypes.LoadIdentifierTypes),
    switchMap(action => this.typesService.getTypes(TypeCategory.Identifier).pipe(
      map((data: any) => new LoadIdentifierTypesSuccess(data.data)),
      catchError(error => of(new LoadIdentifierTypesFailure(error)))
    ))
  );

  @Effect()
  loadSourceTypes$ = this.actions$.pipe(
    ofType(ResourceActionTypes.LoadSourceTypes),
    switchMap(action => this.typesService.getTypes(TypeCategory.Sources).pipe(
      map((data: any) => new LoadSourceTypesSuccess(data.data)),
      catchError(error => of(new LoadSourceTypesFailure(error)))
    ))
  );

  constructor(
    private actions$: Actions,
    private typesService: TypesService
  ) {
  }
}
