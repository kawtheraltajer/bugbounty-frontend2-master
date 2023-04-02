import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Settings } from "luxon";
Settings.defaultZoneName = 'Asia/Riyadh';
enableProdMode();
if (environment.production) {
enableProdMode();
}



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
