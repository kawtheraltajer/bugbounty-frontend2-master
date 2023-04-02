import { LanguageService } from 'src/app/services/language.service';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth/auth.service';
import { appInitializer } from './auth/app.initializer';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { ErrorInterceptor } from './auth/interceptors/error.interceptor';
import { MatModule } from './modules/mat.module';
import { ComponentsModule } from './modules/components.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { PipesModule } from './modules/pipes.module';
import { AuthzService } from './services/authz.service';
import { AppService } from './services/app.service';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DirectivesModule } from './modules/directives.module';
import { Settings } from "luxon";
import { ScrollingModule } from '@angular/cdk/scrolling';

Settings.defaultZoneName = 'Asia/Riyadh';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({ mode: 'md' }),
    HttpClientModule,
    ScrollingModule,
    MatModule,
    MaterialFileInputModule,
    EditorModule,
    ComponentsModule,
    
    IonicStorageModule.forRoot({
      name: '__LERP',
      driverOrder: ['indexeddb', 'sqlite', 'localstorage', 'websql']
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      
    }),

    PipesModule,
    DirectivesModule,
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AppService,
    LanguageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService, AuthzService] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {



 }
