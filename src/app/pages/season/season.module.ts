import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeasonPageRoutingModule } from './season-routing.module';

import { SeasonPage } from './season.page';
import { AnimeDetailsComponent } from './anime-details/anime-details.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SeasonPageRoutingModule],
  declarations: [SeasonPage, AnimeDetailsComponent],
})
export class SeasonPageModule {}
