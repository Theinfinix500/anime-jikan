import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.component.html',
  styleUrls: ['./anime-details.component.scss'],
})
export class AnimeDetailsComponent implements OnInit {
  segment: string = 'episodes';
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  segmentChanged(event) {
    console.log(event);
    this.segment = event.detail.value;
  }

  close() {
    this.modalController.dismiss();
  }
}
