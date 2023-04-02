import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../services/app.service';
import n2words from 'n2words';
import { SUPPORTED_LANGUAGE } from '../interfaces/enums';
@Pipe({
  name: 'num2words'
})
export class Num2WordsPipe implements PipeTransform {
  constructor(private app: AppService) { }

  transform(value: number, language: SUPPORTED_LANGUAGE): string {
    return n2words(value, { lang: language });
  }

}
