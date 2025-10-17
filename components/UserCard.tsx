
import React from 'react';
import { User, SubjectRole } from '../types';
import { ALL_SUBJECTS } from '../constants';

interface UserCardProps {
  user: User;
  currentUser: User;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUser }) => {
  const getSubjectName = (id: number) => ALL_SUBJECTS.find(s => s.id === id)?.name || 'Unknown';

  const needsHelpSubjects = user.profile.subjects.filter(s => s.role === SubjectRole.NeedsHelp);
  const canHelpSubjects = user.profile.subjects.filter(s => s.role === SubjectRole.CanHelp);

  const bestMatch = currentUser.profile.subjects
    .filter(mySub => mySub.role === SubjectRole.NeedsHelp)
    .find(mySub => user.profile.subjects.some(theirSub => theirSub.subjectId === mySub.subjectId && theirSub.role === SubjectRole.CanHelp));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-200">
      {bestMatch && (
        <div className="bg-green-100 dark:bg-green-900 px-4 py-1">
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">
            Great match! Can help with {getSubjectName(bestMatch.subjectId)}.
          </p>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded-full" src={user.avatarUrl} alt={user.name} />
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.profile.learningStyle} Learner</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 h-10 overflow-hidden">{user.profile.bio}</p>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase text-red-500">Needs Help With</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {needsHelpSubjects.length > 0 ? needsHelpSubjects.map(s => (
                <span key={`need-${s.subjectId}`} className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">{getSubjectName(s.subjectId)}</span>
              )) : <span className="text-xs text-slate-400 italic">None specified</span>}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-green-500">Can Help With</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {canHelpSubjects.length > 0 ? canHelpSubjects.map(s => (
                <span key={`help-${s.subjectId}`} className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">{getSubjectName(s.subjectId)}</span>
              )) : <span className="text-xs text-slate-400 italic">None specified</span>}
            </div>
          </div>
        </div>

        <button className="w-full mt-5 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Send Study Request
        </button>
      </div>
    </div>
  );
};

export default UserCard;
