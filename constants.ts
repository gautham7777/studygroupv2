
import { LearningStyle, StudyMethod, SubjectRole, User, Subject, Group, Message } from './types';

export const ALL_SUBJECTS: Subject[] = [
  { id: 1, name: 'Physics' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'Maths' },
  { id: 4, name: 'Biology' },
  { id: 5, name: 'Computer Science' },
  { id: 6, name: 'English' },
  { id: 7, name: 'Commerce' },
  { id: 8, name: 'Business Studies' },
];

export const ALL_LEARNING_STYLES = Object.values(LearningStyle);
export const ALL_STUDY_METHODS = Object.values(StudyMethod);
export const ALL_AVAILABILITY = ['Mornings', 'Afternoons', 'Evenings', 'Weekends'];

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Aisha Sharma',
    email: 'aisha@school.edu',
    avatarUrl: 'https://picsum.photos/seed/aisha/200',
    profile: {
      bio: 'Physics enthusiast, aiming for IIT. Looking for a serious study group for Maths.',
      learningStyle: LearningStyle.Visual,
      preferredMethods: [StudyMethod.ProblemSolving, StudyMethod.Discussion],
      availability: ['Evenings', 'Weekends'],
      subjects: [
        { subjectId: 3, role: SubjectRole.NeedsHelp },
        { subjectId: 1, role: SubjectRole.CanHelp },
        { subjectId: 2, role: SubjectRole.CanHelp },
      ],
    },
  },
  {
    id: 2,
    name: 'Rohan Verma',
    email: 'rohan@school.edu',
    avatarUrl: 'https://picsum.photos/seed/rohan/200',
    profile: {
      bio: 'Future software engineer. I learn best by coding and explaining concepts to others.',
      learningStyle: LearningStyle.Kinesthetic,
      preferredMethods: [StudyMethod.ProblemSolving, StudyMethod.QuietReview],
      availability: ['Afternoons', 'Weekends'],
      subjects: [
        { subjectId: 5, role: SubjectRole.NeedsHelp },
        { subjectId: 1, role: SubjectRole.CanHelp },
        { subjectId: 8, role: SubjectRole.NeedsHelp },
      ],
    },
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya@school.edu',
    avatarUrl: 'https://picsum.photos/seed/priya/200',
    profile: {
      bio: 'Commerce student who enjoys debates. I can help with theory subjects.',
      learningStyle: LearningStyle.ReadingWriting,
      preferredMethods: [StudyMethod.Discussion, StudyMethod.Flashcards],
      availability: ['Mornings', 'Evenings'],
      subjects: [
        { subjectId: 7, role: SubjectRole.CanHelp },
        { subjectId: 6, role: SubjectRole.CanHelp },
        { subjectId: 2, role: SubjectRole.NeedsHelp },
      ],
    },
  },
  {
    id: 4,
    name: 'Vikram Singh',
    email: 'vikram@school.edu',
    avatarUrl: 'https://picsum.photos/seed/vikram/200',
    profile: {
      bio: 'Science & Math whiz. I believe in grinding through problems until they make sense. Trying to get into coding.',
      learningStyle: LearningStyle.Visual,
      preferredMethods: [StudyMethod.ProblemSolving],
      availability: ['Afternoons', 'Evenings', 'Weekends'],
      subjects: [
        { subjectId: 1, role: SubjectRole.CanHelp },
        { subjectId: 2, role: SubjectRole.CanHelp },
        { subjectId: 3, role: SubjectRole.CanHelp },
        { subjectId: 5, role: SubjectRole.NeedsHelp },
      ],
    },
  },
];

export const MOCK_GROUPS: Group[] = [
    {
        id: 101,
        name: 'Maths Masters',
        subjectId: 3,
        members: [1, 4],
        workspaceContent: {
            scratchpad: 'Trigonometry Formulas:\n\nsin(A + B) = sinA cosB + cosA sinB\ncos(A + B) = cosA cosB - sinA sinB\n\nKey areas to review:\n- Integration by parts\n- Probability theorems\n- 3D Geometry',
        }
    },
    {
        id: 102,
        name: 'English Lit Circle',
        subjectId: 6,
        members: [2, 3],
        workspaceContent: {
            scratchpad: 'Figure of Speech practice:\n\n- Metaphor vs Simile\n- Alliteration examples\n- Personification in "The Brook"\n\nNext topic: Shakespeare\'s Sonnets',
        }
    }
];

export const MOCK_MESSAGES: Message[] = [
    { id: '1', senderId: 3, receiverId: 4, text: 'Hey Vikram! I saw you can help with Chemistry. I\'m struggling with reaction mechanisms. Want to form a study group?', timestamp: '2023-10-27T10:00:00Z'},
    { id: '2', senderId: 4, receiverId: 3, text: 'Hi Priya! Absolutely. I\'m always down to solve some chem problems. When are you free?', timestamp: '2023-10-27T10:05:00Z'},
    { id: '3', senderId: 1, receiverId: 4, text: 'Hi Vikram, I saw you\'re a whiz at Maths. I could use a partner for tackling some tough integration problems. Interested?', timestamp: '2023-10-27T10:06:00Z'},
    { id: '4', senderId: 2, receiverId: 1, text: 'Hey Aisha, great notes on electromagnetism! We should totally form a group to solve physics problems faster.', timestamp: '2023-10-27T11:00:00Z'},
];