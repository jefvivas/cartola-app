export interface TeamScore {
  teamId: string;
  team_name: string;
  team_owner: string;
  award: number[];
  score: number[];
  netWorth: number;
  cupAward: number[];
  halfChampionship: number;
  totalAward?: number;
  totalScore?: number;
}

export interface GetTeamsScoresResponse {
  scores: TeamScore[];
}

export type SortCriterion = keyof TeamScore;

export interface PartialSortedData {
  teamOwner: string;
  teamName: string;
  score: number;
}
