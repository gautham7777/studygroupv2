
import React, { useState, useMemo } from 'react';
import { User, Subject, SubjectRole, StudyMethod, LearningStyle } from '../types';
import { ALL_SUBJECTS, ALL_STUDY_METHODS, ALL_LEARNING_STYLES } from '../constants';
import UserCard from './UserCard';

interface FindPartnersPageProps {
  currentUser: User;
  users: User[];
}

interface Filters {
  subject: string;
  role: SubjectRole | 'any';
  studyMethod: StudyMethod | 'any';
  learningStyle: LearningStyle | 'any';
}

const FindPartnersPage: React.FC<FindPartnersPageProps> = ({ currentUser, users }) => {
  const [filters, setFilters] = useState<Filters>({
    subject: 'any',
    role: 'any',
    studyMethod: 'any',
    learningStyle: 'any',
  });

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const filteredUsers = useMemo(() => {
    return otherUsers.filter(user => {
      const subjectMatch = filters.subject === 'any' || user.profile.subjects.some(s => s.subjectId === parseInt(filters.subject));
      const roleMatch = filters.role === 'any' || user.profile.subjects.some(s => s.subjectId === parseInt(filters.subject) && s.role === filters.role);
      const studyMethodMatch = filters.studyMethod === 'any' || user.profile.preferredMethods.includes(filters.studyMethod);
      const learningStyleMatch = filters.learningStyle === 'any' || user.profile.learningStyle === filters.learningStyle;
      
      return subjectMatch && (filters.subject === 'any' ? true : roleMatch) && studyMethodMatch && learningStyleMatch;
    });
  }, [filters, otherUsers]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Basic Matching Algorithm
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      const currentUserNeeds = currentUser.profile.subjects.filter(s => s.role === SubjectRole.NeedsHelp).map(s => s.subjectId);
      const currentUserOffers = currentUser.profile.subjects.filter(s => s.role === SubjectRole.CanHelp).map(s => s.subjectId);

      // Priority 1: User A can help with what I need
      a.profile.subjects.forEach(s => {
        if (s.role === SubjectRole.CanHelp && currentUserNeeds.includes(s.subjectId)) {
          scoreA += 10;
        }
      });
      b.profile.subjects.forEach(s => {
        if (s.role === SubjectRole.CanHelp && currentUserNeeds.includes(s.subjectId)) {
          scoreB += 10;
        }
      });
      
      // Priority 2: I can help User A with what they need
      a.profile.subjects.forEach(s => {
        if (s.role === SubjectRole.NeedsHelp && currentUserOffers.includes(s.subjectId)) {
          scoreA += 5;
        }
      });
       b.profile.subjects.forEach(s => {
        if (s.role === SubjectRole.NeedsHelp && currentUserOffers.includes(s.subjectId)) {
          scoreB += 5;
        }
      });
      
      // Priority 3: Shared availability
      const sharedAvailabilityA = a.profile.availability.filter(avail => currentUser.profile.availability.includes(avail));
      scoreA += sharedAvailabilityA.length * 2;
      const sharedAvailabilityB = b.profile.availability.filter(avail => currentUser.profile.availability.includes(avail));
      scoreB += sharedAvailabilityB.length * 2;
      
      // Priority 4: Shared study methods
      const sharedMethodsA = a.profile.preferredMethods.filter(method => currentUser.profile.preferredMethods.includes(method));
      scoreA += sharedMethodsA.length;
      const sharedMethodsB = b.profile.preferredMethods.filter(method => currentUser.profile.preferredMethods.includes(method));
      scoreB += sharedMethodsB.length;
      
      return scoreB - scoreA;
    });
  }, [filteredUsers, currentUser]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Find Study Partners</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">Discover students who match your study needs and preferences.</p>
      
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
            <select name="subject" id="subject" value={filters.subject} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700">
              <option value="any">Any Subject</option>
              {ALL_SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select name="role" id="role" value={filters.role} onChange={handleFilterChange} disabled={filters.subject === 'any'} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 disabled:opacity-50">
              <option value="any">Any Role</option>
              <option value={SubjectRole.NeedsHelp}>Needs Help</option>
              <option value={SubjectRole.CanHelp}>Can Help</option>
            </select>
          </div>
          <div>
            <label htmlFor="studyMethod" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Study Method</label>
            <select name="studyMethod" id="studyMethod" value={filters.studyMethod} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700">
              <option value="any">Any Method</option>
              {ALL_STUDY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="learningStyle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Learning Style</label>
            <select name="learningStyle" id="learningStyle" value={filters.learningStyle} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700">
              <option value="any">Any Style</option>
              {ALL_LEARNING_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedUsers.length > 0 ? (
          sortedUsers.map(user => <UserCard key={user.id} user={user} currentUser={currentUser} />)
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No users match your criteria. Try broadening your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartnersPage;
