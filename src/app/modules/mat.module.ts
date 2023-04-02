import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_FORMATS, MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CalendarCommonModule, CalendarModule, CalendarMonthModule } from 'angular-calendar';
import { MatTabScrollToCenterDirective } from '../directives/scroll-to-center.directive';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import {MatCardModule} from '@angular/material/card';

@NgModule({
    declarations: [MatTabScrollToCenterDirective],
    imports: [NgxMaterialTimepickerModule,],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatTooltipModule,
        MatDividerModule,
        MatExpansionModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule,
        MaterialFileInputModule,
        MatChipsModule,
        DragDropModule,
        MatNativeDateModule,
        NgxMaterialTimepickerModule,
        CalendarModule,
        CalendarMonthModule,
        CalendarCommonModule,
        MatTabScrollToCenterDirective,
        ScrollingModule,
        CdkScrollableModule,
        MatCardModule
    ],
    providers: [
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'DD.MM.YYYY'
                },
                display: {
                    dateInput: 'DD.MM.YYYY',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'DD.MM.YYYY',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        }
    ]
})
export class MatModule {
    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        // this.matIconRegistry.addSvgIconSet(this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
        // this.matIconRegistry.addSvgIconSetInNamespace(
        //     'matoutline',
        //     this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
        // this.matIconRegistry.addSvgIconSetInNamespace(
        //     'iconsmind',
        //     this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/iconsmind.svg'));
        // this.matIconRegistry.addSvgIconSetInNamespace(
        //     'dripicons',
        //     this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/dripicons.svg'));
        // this.matIconRegistry.addSvgIconSetInNamespace(
        //     'feather',
        //     this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
        // this.matIconRegistry.addSvgIconSetInNamespace(
        //     'heroicons',
        //     this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons.svg'));
        // this.matIconRegistry.addSvgIconSetInNamespace(
        //     'materialTwo',
        //     this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
    }
}