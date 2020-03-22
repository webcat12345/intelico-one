import { Pipe, PipeTransform } from '@angular/core';
import { IdentifierType } from '@one-core/model';

@Pipe({
  name: 'identifierTypeIcon'
})
export class IdentifierTypeIconPipe implements PipeTransform {

  transform(identifierType: number, isClass?: any): any {
    let iconPath = '';
    switch (identifierType) {
      case IdentifierType.Numberplate: {
        iconPath = isClass ? 'numberplate-alert' : 'assets/images/vehicle-icon.svg';
        break;
      }
      case IdentifierType.Bluetooth: {
        iconPath = isClass ? 'bluetooth-alert' : 'assets/images/bluetooth-alert-icon.svg';
        break;
      }
      case IdentifierType.Container: {
        iconPath = isClass ? 'container-alert' : 'assets/images/container-alert-icon.svg';
        break;
      }
      case IdentifierType.Face: {
        iconPath = isClass ? 'face-alert' : 'assets/images/face-alert-icon.svg';
        break;
      }
      case IdentifierType.Video: {
        iconPath = isClass ? 'video-alert' : 'assets/images/video-alert-icon.svg';
        break;
      }
      case IdentifierType.Device: {
        iconPath = isClass ? 'hierarchy' : 'assets/images/hierarchy-alert-icon.svg';
        break;
      }
      case IdentifierType.RFID: {
        iconPath = isClass ? 'RFID' : 'assets/images/RFID-alert-icon.svg';
        break;
      }
      /*  case IdentifierType.InputSwitched: {
          iconPath = isClass ? 'input-switched' : 'assets/images/unknown-alert-icon.svg';
          break;
        }*/
      case IdentifierType.Barcode: {
        iconPath = isClass ? 'barcode' : 'assets/images/barcode-alert-icon.svg';
        break;
      }
      case IdentifierType.QRCode: {
        iconPath = isClass ? 'qr-code' : 'assets/images/qr-code-alert-icon.svg';
        break;
      }
      case IdentifierType.Temperature: {
        iconPath = isClass ? 'temperature' : 'assets/images/temperature-thermometer-low-alert-icon.svg';
        break;
      }
      default: {
        iconPath = isClass ? 'unknown-alert' : 'assets/images/unknown-alert-icon.svg';
        break;
      }
    }
    return iconPath;
  }

}
