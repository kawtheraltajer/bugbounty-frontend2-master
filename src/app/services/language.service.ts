import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
​
@Injectable({
    providedIn: 'root'
})
​
export class LanguageService {
    selectedLanguage = new BehaviorSubject('en');
    direction = new BehaviorSubject<'ltr' | 'rtl'>('ltr');
    side = new BehaviorSubject('start');
    selectedLang = 'en';
    selectedCurrency: 'bh' | 'sa' = 'bh';
    englishNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    arabicNumbers = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠'];
    constructor(public menu: MenuController, private translate: TranslateService, private storage: Storage) {
    }
​
    async initializeLanguage() {
        await this.storage.get('SELECTED_LANG').then(x => {
            if (x) {
                this.setLanguage(x, true);
            } else {
                this.setLanguage('en', true);
            }
        })
    }
​
    getAvailableLang() {
        return [
            { langName: 'English', langSnip: 'en' },
            { langName: 'Arabic', langSnip: 'ar' },
        ]
    }

    setLanguage2(ev: any, direct?: boolean) {
        let lang = direct ? ev : ev.detail?.value
        if (!lang) {
            return
        }
        this.selectedLanguage.next(lang)
        this.translate.use(lang);
        this.selectedLang = lang;
        this.storage.set('SELECTED_LANG', lang);
       // let menu: HTMLElement = document.getElementById("mainMenu");
        if (lang == 'ar') {
            document.documentElement.dir = "rtl";
            this.direction.next('rtl');
          //  this.side.next('end');
        //    menu.setAttribute("side", 'start');
        } else {
            document.documentElement.dir = "ltr";
            this.direction.next('ltr');
           // this.side.next('start');
          //  menu.setAttribute("side", 'end');
        }
      
    }
​
​
    setLanguage(ev: any, direct?: boolean) {
        console.log(ev.detail?.value)
        let lang = direct ? ev : ev.detail?.value
        if (!lang) {
            return
        }
        this.selectedLanguage.next(lang)
        this.translate.use(lang);
        this.selectedLang = lang;
        this.storage.set('SELECTED_LANG', lang);
       // let menu: HTMLElement = document.getElementById("mainMenu");
        if (lang == 'ar') {
            document.documentElement.dir = "rtl";
            this.direction.next('rtl');
            
           this.side.next('end');
        //    menu.setAttribute("side", 'start');
        } else {
            document.documentElement.dir = "ltr";
            this.direction.next('ltr');
            this.side.next('start');
          //  menu.setAttribute("side", 'end');
        }
      
    }
​
    toggleLang() {
        if (this.selectedLang == 'en') {
            this.setLanguage('ar', true);
        } else {
            this.setLanguage('en', true);
        }
    }
}