import { Pipe, PipeTransform } from '@angular/core';
import { Layer } from '@one-core/model';

@Pipe({
  name: 'layerParent'
})
export class LayerParentPipe implements PipeTransform {

  transform(layers: Layer[], parentId: string): any {
    const filteredLayers = layers.filter(x => x.parentId === parseInt(parentId, 10));
    return filteredLayers || [];
  }

}
