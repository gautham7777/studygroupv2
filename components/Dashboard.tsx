
import React from 'react';
// Fix: MOCK_USERS is exported from constants, not types.
import { User, Group } from '../types';
import { ALL_SUBJECTS, MOCK_USERS } from '../constants';

interface DashboardProps {
  currentUser: User;
  groups: Group[];
  setActivePage: (page: string) => void;
  setSelectedGroup: (group: Group) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, groups, setActivePage, setSelectedGroup }) => {
  const userGroups = groups.filter(g => g.members.includes(currentUser.id));

  const getSubjectName = (id: number) => ALL_SUBJECTS.find(s => s.id === id)?.name || 'Unknown Subject';
  const getGroupMembers = (memberIds: number[]) => MOCK_USERS.filter(u => memberIds.includes(u.id));

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setActivePage('workspace');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Here's a look at your study sphere.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* My Groups Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">My Study Groups</h2>
          {userGroups.length > 0 ? (
            <div className="space-y-4">
              {userGroups.map(group => (
                <div key={group.id} onClick={() => handleGroupClick(group)} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent dark:border-slate-700 hover:border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{group.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400">{getSubjectName(group.subjectId)}</p>
                    </div>
                    <div className="flex -space-x-2">
                        {getGroupMembers(group.members).map(member => (
                            <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-800"/>
                        ))}
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 truncate">
                    <span className="font-semibold">Latest in scratchpad:</span> {group.workspaceContent.scratchpad.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't joined any study groups yet.</p>
              <button onClick={() => setActivePage('find')} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Find a Partner
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Find a New Partner</h3>
              <p className="text-slate-600 dark:text-slate-400 my-2">Search for students based on subjects and learning style.</p>
              <button onClick={() => setActivePage('find')} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Search Now
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Update Your Profile</h3>
              <p className="text-slate-600 dark:text-slate-400 my-2">Keep your subjects and availability up-to-date for better matches.</p>
              <button onClick={() => setActivePage('profile')} className="w-full bg-slate-600 text-white font-semibold py-2 rounded-lg hover:bg-slate-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
