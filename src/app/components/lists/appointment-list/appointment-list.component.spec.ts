import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppointmentListComponent } from './appointment-list.component';

import { MatModule } from 'src/app/modules/mat.module';
import { PipesModule } from 'src/app/modules/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentListComponent ],
      imports: [
        IonicModule.forRoot(),     
        MatModule,
        PipesModule,
        TranslateModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
