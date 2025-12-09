export type WorkflowType = 'plan' | 'surprise';

export interface DayItinerary {
  dayNumber: number;
  theme?: string;
  summary: string;
  activitiesSummary: string;
  localStory: string;
  planB: string;
}

export interface Itinerary {
  destination: string;
  duration: number;
  workflowType: WorkflowType;
  days: DayItinerary[];
  generatedAt?: string;
}
