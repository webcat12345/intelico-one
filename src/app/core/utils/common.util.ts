import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export function logReducerError(name, error) {
  console.error(`${name} reducer error: ${error}`);
}

export function logError(error: any) {
  console.group('Detected issue - Log manager');
  if (error) {
    console.error(error);
  }
  console.groupEnd();
}

export function getElapsedTime(seconds: number): string {
  if (!seconds) {
    return '...';
  }

  let interval = Math.floor(seconds / 31536000);

  if (interval > 0) {
    return interval + ' Yrs';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 0) {
    return interval + ' Mth';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 0) {
    return interval + ' D';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 0) {
    return interval + ' Hrs';
  }
  interval = Math.floor(seconds / 60);
  if (interval > 0) {
    return interval + ' Min';
  }

  return Math.floor(seconds) + ' Sec';
}

export async function wait(time: number) {
  await of(0).pipe(delay(time)).toPromise();
}

export function formatNumber(number: number) {
  return ('0' + number).slice(-2);
}

export function removeDuplicates(originalArray, prop) {
  const newArray = [];
  const lookupObject = {};
  // tslint:disable-next-line
  for (const i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  // tslint:disable-next-line
  for (const i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}

export function pushEntries(toArray: any[], fromArray: any[], uniqueId: string, isUnshift = false) {
  if (toArray && fromArray && uniqueId) {
    fromArray.forEach((entry) => {
      if (!isEntryExists(toArray, uniqueId, entry[uniqueId])) {
        if (isUnshift) {
          toArray.unshift(entry);
        } else {
          toArray.push(entry);
        }
      }
    });
  }
}

export function comparer(otherArray: any[], key: string = 'value') {
  return (current) => {
    return otherArray.filter((other) => {
      return other[key] === current[key];
    }).length === 0;
  };
}

export function isEntryExists(fromArray: any[], uniqueId: string, value) {
  if (fromArray && uniqueId) {
    const exists = fromArray.find((element) => element[uniqueId] === value);
    return exists ? true : false;
  }
  return false;
}

export function orderBy(array: Array<any>, args?: any): any {
  if (array) {
    return array.sort((a, b) => {
      if (a !== undefined && b !== undefined && a[args] !== undefined && b[args] !== undefined) {
        const aLower = a[args].toLowerCase();
        const bLower = b[args].toLowerCase();
        return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
      } else {
        // one or both are null!
        if (b !== undefined && b[args] !== undefined) {
          return 1;
        }
        if (a !== undefined && a[args] !== undefined) {
          return -1;
        }
        return 0;
      }
    });
  } else {
    return [];
  }
}
