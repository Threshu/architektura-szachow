import type { GroupId, GroupConfig } from '../types';

export const defaultGroupConfigs: Record<GroupId, GroupConfig>={
  A: {
    id: 'A',
    name: 'Grupa A',
    entryFee: 80,
    pzszachFee: 30,
    prizes: [
      { place: 'I miejsce', amount: 700, enabled: true },
      { place: 'II miejsce', amount: 400, enabled: true },
      { place: 'III miejsce', amount: 200, enabled: true },
    ],
    specialPrizes: [
      { category: 'kobieta', label: 'Najlepsza kobieta', amount: 80, enabled: true, minPlayers: 3 },
      { category: 'u18', label: 'Do lat 18', amount: 80, enabled: true, minPlayers: 3 },
      { category: 'u14', label: 'Do lat 14', amount: 80, enabled: true, minPlayers: 3 },
      { category: 'u12', label: 'Do lat 12', amount: 80, enabled: true, minPlayers: 3 },
    ],
    autoClassification: true,
  },
  B: {
    id: 'B',
    name: 'Grupa B',
    entryFee: 70,
    pzszachFee: 25,
    prizes: [
      { place: 'I miejsce', amount: 200, enabled: true },
      { place: 'II miejsce', amount: 100, enabled: true },
      { place: 'III miejsce', amount: 70, enabled: true },
    ],
    specialPrizes: [
      { category: 'kobieta', label: 'Najlepsza kobieta', amount: 50, enabled: true, minPlayers: 3 },
      { category: 'u18', label: 'Do lat 18', amount: 50, enabled: true, minPlayers: 3 },
      { category: 'u14', label: 'Do lat 14', amount: 50, enabled: true, minPlayers: 3 },
      { category: 'u12', label: 'Do lat 12', amount: 50, enabled: true, minPlayers: 3 },
    ],
    autoClassification: true,
  },
  C: {
    id: 'C',
    name: 'Grupa C',
    entryFee: 50,
    pzszachFee: 0,
    prizes: [
      { place: 'I miejsce (nagroda rzeczowa)', amount: 200, enabled: true },
      { place: 'II miejsce (nagroda rzeczowa)', amount: 200, enabled: true },
      { place: 'III miejsce (nagroda rzeczowa)', amount: 200, enabled: true },
    ],
    specialPrizes: [
      { category: 'kobieta', label: 'Najlepsza kobieta', amount: 0, enabled: true, minPlayers: 3 },
      { category: 'u18', label: 'Do lat 18', amount: 0, enabled: true, minPlayers: 3 },
      { category: 'u14', label: 'Do lat 14', amount: 0, enabled: true, minPlayers: 3 },
      { category: 'u12', label: 'Do lat 12', amount: 0, enabled: true, minPlayers: 3 },
    ],
    autoClassification: true,
  },
  D: {
    id: 'D',
    name: 'Grupa D',
    entryFee: 50,
    pzszachFee: 0,
    prizes: [
      { place: 'I miejsce (nagroda rzeczowa)', amount: 200, enabled: true },
      { place: 'II miejsce (nagroda rzeczowa)', amount: 200, enabled: true },
      { place: 'III miejsce (nagroda rzeczowa)', amount: 200, enabled: true },
    ],
    specialPrizes: [
      { category: 'kobieta', label: 'Najlepsza kobieta', amount: 0, enabled: true, minPlayers: 3 },
      { category: 'u18', label: 'Do lat 18', amount: 0, enabled: true, minPlayers: 3 },
      { category: 'u14', label: 'Do lat 14', amount: 0, enabled: true, minPlayers: 3 },
      { category: 'u12', label: 'Do lat 12', amount: 0, enabled: true, minPlayers: 3 },
    ],
    autoClassification: true,
  },
};
