import { Component, OnInit } from '@angular/core';
import { AnimeService } from 'src/app/services/anime.service';
import { SeasonEnum } from 'src/app/enums/Season';
import { Anime } from 'src/app/models/SeasonAnime.model';

@Component({
  selector: 'app-season',
  templateUrl: './season.page.html',
  styleUrls: ['./season.page.scss'],
})
export class SeasonPage implements OnInit {
  public animeList: Array<Anime> = [];

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.animeService
      .getAnimeBySeason(2018, SeasonEnum.WINTER)
      .subscribe((animes) => (this.animeList = animes));
  }
}
