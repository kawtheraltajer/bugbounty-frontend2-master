import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService } from '../services/language.service';
@Pipe({
  name: 'direction',
  pure: false
})
export class DirectionPipe implements PipeTransform {
  constructor(private lang: LanguageService) { }
  transform(value: 'ltr' | 'rtl'): Observable<boolean> {
    return this.lang.direction.pipe(map(val => val == value));
  }

}
