
import React, { useState } from 'react';
import { User, SubjectRole, StudyMethod, LearningStyle } from '../types';
import { ALL_SUBJECTS, ALL_LEARNING_STYLES, ALL_STUDY_METHODS, ALL_AVAILABILITY } from '../constants';

interface ProfilePageProps {
  currentUser: User;
  updateUser: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, updateUser }) => {
  const [user, setUser] = useState<User>(currentUser);

  const handleSubjectChange = (subjectId: number, role: SubjectRole) => {
    const existingSubject = user.profile.subjects.find(s => s.subjectId === subjectId);
    let newSubjects;

    if (existingSubject) {
      if (existingSubject.role === role) {
        // Deselect if clicking the same role
        newSubjects = user.profile.subjects.filter(s => s.subjectId !== subjectId);
      } else {
        // Switch role
        newSubjects = user.profile.subjects.map(s => s.subjectId === subjectId ? { ...s, role } : s);
      }
    } else {
      // Add new subject
      newSubjects = [...user.profile.subjects, { subjectId, role }];
    }

    setUser(prev => ({ ...prev, profile: { ...prev.profile, subjects: newSubjects } }));
  };
  
  const handleMultiSelectChange = (
    key: 'preferredMethods' | 'availability',
    value: StudyMethod | string
  ) => {
    const currentValues = user.profile[key] as (StudyMethod | string)[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setUser(prev => ({
      ...prev,
      profile: { ...prev.profile, [key]: newValues },
    }));
  };

  const handleSave = () => {
    updateUser(user);
    alert('Profile saved!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full mb-4 ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-800" />
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
              <textarea
                id="bio"
                rows={3}
                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                value={user.profile.bio}
                onChange={e => setUser(prev => ({ ...prev, profile: { ...prev.profile, bio: e.target.value } }))}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Subjects</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ALL_SUBJECTS.map(subject => (
                  <div key={subject.id} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                    <p className="font-semibold text-sm truncate">{subject.name}</p>
                    <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleSubjectChange(subject.id, SubjectRole.NeedsHelp)}
                          className={`w-full text-xs px-2 py-1 rounded ${user.profile.subjects.some(s => s.subjectId === subject.id && s.role === SubjectRole.NeedsHelp) ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-600 hover:bg-red-200 dark:hover:bg-red-900'}`}
                        >
                          Need
                        </button>
                        <button
                          onClick={() => handleSubjectChange(subject.id, SubjectRole.CanHelp)}
                          className={`w-full text-xs px-2 py-1 rounded ${user.profile.subjects.some(s => s.subjectId === subject.id && s.role === SubjectRole.CanHelp) ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600 hover:bg-green-200 dark:hover:bg-green-900'}`}
                        >
                          Offer
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="learningStyle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Learning Style</label>
                  <select
                    id="learningStyle"
                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700"
                    value={user.profile.learningStyle}
                    onChange={e => setUser(prev => ({ ...prev, profile: { ...prev.profile, learningStyle: e.target.value as LearningStyle } }))}
                  >
                    {ALL_LEARNING_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Availability</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ALL_AVAILABILITY.map(avail => (
                      <button 
                        key={avail}
                        onClick={() => handleMultiSelectChange('availability', avail)}
                        className={`px-3 py-1 text-sm rounded-full ${user.profile.availability.includes(avail) ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300'}`}
                      >{avail}</button>
                    ))}
                  </div>
                </div>
            </div>
            
             <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Study Methods</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {ALL_STUDY_METHODS.map(method => (
                  <button 
                    key={method}
                    onClick={() => handleMultiSelectChange('preferredMethods', method)}
                    className={`px-3 py-1 text-sm rounded-full ${user.profile.preferredMethods.includes(method) ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300'}`}
                  >{method}</button>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <button onClick={handleSave} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
