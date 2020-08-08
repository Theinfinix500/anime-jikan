import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeasonEnum } from '../enums/Season';
import { SeasonAnime, Anime } from '../models/SeasonAnime.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  constructor(private http: HttpClient) {}

  getAnimeBySeason(
    year: number,
    season: SeasonEnum
  ): Observable<{ leftSideData: Array<Anime>; rightSideData: Array<Anime> }> {
    console.log(environment);
    return this.http
      .get<SeasonAnime>(`${environment.apiUrl}/season/${year}/${season}`)
      .pipe(
        map((res) => res.anime),
        map((animes) => animes.filter((anime) => anime.type === 'TV')),
        map(this.divideData)
      );
  }

  divideData(
    animes: Array<Anime>
  ): { leftSideData: Array<Anime>; rightSideData: Array<Anime> } {
    let leftSideData = [];
    let rightSideData = [];
    const halfSize = Math.round(animes.length / 2);

    for (let i = 0; i < animes.length; i++) {
      if (i <= halfSize) {
        leftSideData.push(animes[i]);
      } else {
        rightSideData.push(animes[i]);
      }
    }

    return {
      leftSideData,
      rightSideData,
    };
  }
}
