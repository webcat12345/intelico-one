import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventService } from '@one-core/service/event.service';
import { map } from 'rxjs/operators';
import { EventListItem, Pagination } from '@one-core/model';
import { ExpansionTableItem, parseExpansionTableItem } from '../../../../core/utils/expansion-table.util';

export interface Locate {
  identifier?: string;
  history?: ExpansionTableItem<EventListItem>[];
  count?: number;
  lat?: number;
  long?: number;
}

@Injectable()
export class LocateService {

  isLoading = false;
  locate: Locate = {};
  locate$: BehaviorSubject<Locate> = new BehaviorSubject<Locate>(this.locate);

  totalCount = 0;
  currentPage = 1;

  constructor(
    private eventService: EventService
  ) {
  }

  async search(key, filterString) {
    this.isLoading = true;
    try {
      this.locate = await this.searchEventByIdentifier(key, filterString).toPromise();
    } catch (e) {
      this.locate = {};
    } finally {
      this.isLoading = false;
      this.locate$.next(this.locate);
    }
  }

  private searchEventByIdentifier(identifier: string, filterString: string): Observable<Locate> {
    return this.eventService.searchEventByIdentifier(identifier, filterString, this.currentPage).pipe(
      map((events: Pagination<EventListItem>) => {
        this.totalCount = events.count;
        if (events) {
          return {
            identifier: events.results[0].identifier,
            count: events.count,
            history: events.results.map(x => parseExpansionTableItem<EventListItem>(x))
          };
        } else {
          return {};
        }
      })
    );
  }

}
