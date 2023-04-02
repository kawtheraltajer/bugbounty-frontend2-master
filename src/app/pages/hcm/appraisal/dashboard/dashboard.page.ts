import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DateTime } from 'luxon';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, ChartType } from 'ng-apexcharts';
import { AppraisalStatus, AppraisalStatusEnum, Employee } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { LanguageService } from 'src/app/services/language.service';
export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  stroke?: ApexStroke;
  title?: ApexTitleSubtitle;
  tooltip?: ApexTooltip;
  fill?: ApexFill;
  legend?: ApexLegend;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
 @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  overview: { year: number, count: number, statuses: { status: AppraisalStatus, count: number }[], chart?: { labels?: string[], series?: number[] } }[] = []

  isLoading = true;
 bar: ChartType = "bar"
 chartConfig: ApexChart = {
   type: "pie",

  }
  statuses = Object.keys(AppraisalStatusEnum)
  dataLabels = {
    formatter: (val, opts) => {
      console.log(opts);
      return opts.w.config.series[opts.seriesIndex]
    },
  }
  keys: number[] = [];
  byYearStatus: {
    year: number,
    count: number,
    maxAppraiser: number,
    maxCount: number,
    statuses: { status: string, count: number }[],
    appraisers: {
      appraiserID: number,
      count: number,
    }
  }[] = [];
  appraisers: Employee[] = [];
 yearsChart: ChartOptions;
  selectedYear: any;
  mappedStatuses: {} = []
  constructor(public app: AppService, public lang: LanguageService, public appraisalService: AppraisalService,) { }

  ngOnInit() {
    let procData: any = {}
    this.isLoading = true;
    let currentYear = DateTime.local().year;
    this.appraisalService.getDashboard().then(dt => {
      this.byYearStatus = dt.byYearStatus;
      dt.appraisers.forEach(emp => {
        this.appraisers[emp.id] = emp;
      });
      let mappedStatus: { name: string, data: number[] }[] = []
      this.statuses.forEach(sta => {
        let data: number[] = [];
        dt.byYearStatus.forEach(yr => {
          if (yr.year == currentYear) {
            this.selectedYear = yr;
          }
          let dataIndex = yr.statuses.findIndex(dt => dt.status === sta);
          if (dataIndex == -1) {
            yr.statuses.push({ status: sta, count: 0 })
          }
        })
        mappedStatus.push({ name: sta, data })
      })
     this.chartOptions = {
        series: [{
          name: 'basic',
          data: dt.byYearStatus.map(dt => dt.count),
        }],
        chart: {
          type: "bar",
          // height: '100%',
          width: '100%',
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        title: {
          text: "Years"
        },
        xaxis: {
          categories: dt.byYearStatus.map(yr => String(yr.year)),
          labels: {
            formatter: (val) => {
              return val;
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          }
        },
        tooltip: {
          y: {
            formatter: (val) => {
              return val + "K";
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: "top",
          horizontalAlign: "center",
          offsetX: 40
        }
      };
      this.isLoading = false;
    });



  }
  ngAfterViewInit() {

  }

  selectYear(index: number) {
    this.selectedYear = this.byYearStatus[index];
    console.log('Change Year');
  }

}
