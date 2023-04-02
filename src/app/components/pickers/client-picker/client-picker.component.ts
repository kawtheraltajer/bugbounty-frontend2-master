import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Client } from 'src/app/interfaces/types';
import { CourtService } from 'src/app/services/court.service';
@Component({
  selector: 'app-client-picker',
  templateUrl: './client-picker.component.html',
  styleUrls: ['./client-picker.component.scss'],
})
export class ClientPickerComponent implements OnInit {
  Clients: Client[] = [];
  constructor(public court: CourtService,) { }

  async ngOnInit() {
    this.Clients= await this.court.getClientForList()
  }
  close(){
    
  }
}
