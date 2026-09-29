export type Grade = 6 | 7 | 8 | 9;

export interface NodeInfo {
  id: string; // e.g. "g8-b03-n01" or "phy-g8-b01-n01"
  nodeIndex: number;
  title: string;
  description: string;
  type: 'lesson' | 'theory' | 'checkpoint' | 'chest';
}

export interface Lesson {
  id: string; // e.g. "g8-b03" or "phy-g8-b01"
  lessonNumber: number;
  title: string;
  subtitle: string;
  ready: boolean; // whether content JSON is available
  nodes: NodeInfo[];
}

export interface Chapter {
  id: string; // e.g. "g8-c01" or "phy-g8-c01"
  chapterNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface GradeCurriculum {
  grade: Grade;
  title: string;
  chapters: Chapter[];
}
