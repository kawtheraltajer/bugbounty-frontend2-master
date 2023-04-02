import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scape',
  pure: false,
})
export class ScapePipe implements PipeTransform {
  transform(value: any, key?: string, scapeValue?: any,): any {
    if (value == null || value == undefined || value == 'null' || value == 'undefined') {
      return scapeValue ? scapeValue : '-';
    } else {
      let res = key ? value[key] : value;
      if (res == '' || res == null || res == undefined) { return scapeValue ? scapeValue : '-' };
      return res;
    }
  }

}
