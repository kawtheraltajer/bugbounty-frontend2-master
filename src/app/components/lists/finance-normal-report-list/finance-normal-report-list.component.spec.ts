import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinanceNormalReportListComponent } from './finance-normal-report-list.component';

describe('FinanceNormalReportListComponent', () => {
  let component: FinanceNormalReportListComponent;
  let fixture: ComponentFixture<FinanceNormalReportListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceNormalReportListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceNormalReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
