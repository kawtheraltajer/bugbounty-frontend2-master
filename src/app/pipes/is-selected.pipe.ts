import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'isSelected',
  pure: false
})
export class IsSelectedPipe implements PipeTransform {
  constructor(private translate: TranslateService) { }

  transform(value: string, type: 'lang' | 'dir'): boolean {
    switch (type) {
      case 'lang':
        return this.translate.currentLang == value
        break;
      case 'dir':
        return this.translate.currentLang == 'ar' ? (value == 'rtl') : (value == 'ltr')
        break;
      default:
        return false;
        break;
    }
    return false;
  }

}
