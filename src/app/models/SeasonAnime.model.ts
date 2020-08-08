export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  title: string;
  image_url: string;
  synopsis: string;
  type: string;
  airing_start: Date;
  episodes: number;
  members: number;
  genres: Genre[];
  source: string;
  producers: Producer[];
  score: number;
  licensors: any[];
  r18: boolean;
  kids: boolean;
  continuing: boolean;
}

export interface SeasonAnime {
  request_hash: string;
  request_cached: boolean;
  request_cache_expiry: number;
  season_name: string;
  season_year: number;
  anime: Anime[];
}
