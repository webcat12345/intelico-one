import { Pipe, PipeTransform } from '@angular/core';
import { LocationDetails } from '@one-core/model';

@Pipe({
  name: 'locationDetailAddress'
})
export class LocationDetailAddressPipe implements PipeTransform {

  transform(location: LocationDetails, args?: any): any {
    if (location && location.area && location.site && location.zone) {
      const address = this.buildAddress(location, [args]);
      if (address) {
        return address;
      } else {
        return null;
      }
    } else {
      return null;
    }

    /*  if (location && location.latitude && location.longitude) {
        let address = this.buildAddress(location, ['line1', 'line2', 'city', 'county', 'country']);
        if (address) {
          address += location.postCode ? ` - ${location.postCode}` : '';
          return address;
        } else {
          return null;
        }
      } else {
        return null;
      }*/
  }

  private buildAddress(source, keys: string[]): string {
    const address = [];
    keys.forEach(key => {
      if (source[key]) {
        address.push(`${key.toUpperCase()}: ` + source[key]);
      }
    });
    if (address.length > 0) {
      return address.join('\r\n');
    } else {
      return null;
    }
  }

}
