export interface Player {
  id: string;
  name: string;
  club: string;
  ranking: number;
  birthYear: number|null;
  category: string;
  isFemale: boolean;
  paidCM: boolean;
  paidManual: boolean;
  withdrawn: boolean;
}

export interface Prize {
  place: string;
  amount: number;
  enabled: boolean;
}

export interface SpecialPrize {
  category: 'kobieta'|'u18'|'u14'|'u12';
  label: string;
  amount: number;
  enabled: boolean;
  minPlayers: number;
}

export type GroupId='A'|'B'|'C'|'D';

export interface GroupConfig {
  id: GroupId;
  name: string;
  entryFee: number;
  pzszachFee: number;
  prizes: Prize[];
  specialPrizes: SpecialPrize[];
  autoClassification: boolean;
}

export interface ScrapeStatus {
  timestamp: number|null;
  loading: boolean;
  error: string|null;
  newPlayers: number;
  updatedPlayers: number;
}

export function isPlayerPaid (player: Player): boolean {
  return player.paidCM||player.paidManual;
}
