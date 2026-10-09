export type TitleType =
  | 'SERIES'
  | 'MOVIE'
  | 'DOCUMENTARY'
  | 'REALITY'
  | 'KIDS'
  | 'MUSIC'
  | 'LIVE'
  | 'SHORT'
  | 'EDUCATIONAL';

export interface Title {
  id: string;
  slug?: string;
  name: string;
  type: TitleType;
  genre: string;
  year: number;
  rating: string;
  synopsis?: string;
  cast?: string[];
  runtimeMins?: number;
  isOriginal: boolean;
  isKids: boolean;
  isLive?: boolean;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  accentA?: string;
  accentB?: string;
  seasons?: Season[];
}

export interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  name: string;
  synopsis?: string;
  runtimeMins: number;
  rating: string;
  posterUrl?: string;
}

export interface Profile {
  id: string;
  name: string;
  isKids: boolean;
  avatar: string;
  accentA: string;
  accentB: string;
}

export type Plan = 'AD_SUPPORTED' | 'AD_LESS';
export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';