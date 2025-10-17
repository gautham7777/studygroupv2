
import React from 'react';
import { User } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';
import MessageIcon from './icons/MessageIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import UsersIcon from './icons/UsersIcon';

interface HeaderProps {
  currentUser: User;
  activePage: string;
  setActivePage: (page: string) => void;
  logout: () => void;
}

const NavItem: React.FC<{
  label: string;
  pageName: string;
  activePage: string;
  setActivePage: (page: string) => void;
  icon: React.ReactNode;
}> = ({ label, pageName, activePage, setActivePage, icon }) => {
  const isActive = activePage === pageName;
  return (
    <button
      onClick={() => setActivePage(pageName)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentUser, activePage, setActivePage, logout }) => {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-blue-400" />
              StudySphere
            </h1>
            <nav className="hidden md:flex items-center space-x-2">
              <NavItem label="Dashboard" pageName="dashboard" activePage={activePage} setActivePage={setActivePage} icon={<UsersIcon className="h-5 w-5"/>} />
              <NavItem label="Find Partners" pageName="find" activePage={activePage} setActivePage={setActivePage} icon={<UsersIcon className="h-5 w-5"/>} />
              <NavItem label="Messages" pageName="messages" activePage={activePage} setActivePage={setActivePage} icon={<MessageIcon className="h-5 w-5"/>} />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
             <NavItem label="My Profile" pageName="profile" activePage={activePage} setActivePage={setActivePage} icon={<UserCircleIcon className="h-5 w-5"/>} />
             <button onClick={logout} className="text-sm font-medium text-slate-300 hover:text-white">Logout</button>
             <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-9 w-9 rounded-full"/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
