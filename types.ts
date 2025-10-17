
export enum LearningStyle {
  Visual = 'Visual',
  Auditory = 'Auditory',
  Kinesthetic = 'Kinesthetic',
  ReadingWriting = 'Reading/Writing',
}

export enum StudyMethod {
  Discussion = 'Discussion',
  ProblemSolving = 'Problem-Solving',
  QuietReview = 'Quiet Review',
  Flashcards = 'Flashcards',
}

export enum SubjectRole {
  NeedsHelp = 'Needs Help',
  CanHelp = 'Can Help',
}

export interface UserSubject {
  subjectId: number;
  role: SubjectRole;
}

export interface Profile {
  bio: string;
  learningStyle: LearningStyle;
  preferredMethods: StudyMethod[];
  availability: string[];
  subjects: UserSubject[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  profile: Profile;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Message {
  id: string;
  senderId: number;
  receiverId: number; // Can be a user ID or group ID
  text: string;
  timestamp: string;
}

export interface Group {
  id: number;
  name: string;
  subjectId: number;
  members: number[];
  workspaceContent: {
    scratchpad: string;
    whiteboard?: string; // a data URL of the canvas
    studyPlan?: StudyPlan;
  };
}

export interface StudyPlanDay {
    day: number;
    goal: string;
    concepts: string[];
    activities: string[];
}

export interface StudyPlan {
    plan: StudyPlanDay[];
}