
import React, { useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_GROUPS, MOCK_MESSAGES } from './constants';
import { User, Group, Message } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FindPartnersPage from './components/FindPartnersPage';
import ProfilePage from './components/ProfilePage';
import MessagingPage from './components/MessagingPage';
import GroupWorkspacePage from './components/GroupWorkspacePage';
import BookOpenIcon from './components/icons/BookOpenIcon';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInAnonymously, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDocs, onSnapshot, setDoc, writeBatch, addDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Firebase Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (!user) {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Real-time Listeners ---
  useEffect(() => {
    if (!fbUser) {
      setUsers([]);
      setGroups([]);
      setMessages([]);
      return;
    };
    
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() } as User));
      setUsers(usersData);
      // For demo purpose, set current user to the first user profile
      if (usersData.length > 0 && !currentUser) {
        setCurrentUser(usersData[0]);
      }
    });

    const unsubGroups = onSnapshot(collection(db, "groups"), (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() } as Group));
      setGroups(groupsData);
    });

    const unsubMessages = onSnapshot(collection(db, "messages"), (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(messagesData);
    });

    return () => {
      unsubUsers();
      unsubGroups();
      unsubMessages();
    };
  }, [fbUser, currentUser]);


  // --- State Updaters (writing to Firestore) ---
  const updateUser = async (updatedUser: User) => {
    const userRef = doc(db, 'users', updatedUser.id.toString());
    // Clean the object to remove any non-serializable fields or circular refs from the SDK
    const cleanUser = JSON.parse(JSON.stringify(updatedUser));
    await setDoc(userRef, cleanUser, { merge: true });
    // Local state will be updated by the onSnapshot listener
  };

  const updateGroup = async (updatedGroup: Group) => {
    const groupRef = doc(db, 'groups', updatedGroup.id.toString());
    // Clean the object to remove any non-serializable fields or circular refs from the SDK
    const cleanGroup = JSON.parse(JSON.stringify(updatedGroup));
    await setDoc(groupRef, cleanGroup, { merge: true });
  };
  
  const addMessage = async (newMessage: Omit<Message, 'id' | 'timestamp'>) => {
    await addDoc(collection(db, 'messages'), {
      ...newMessage,
      timestamp: new Date().toISOString()
    });
  }

  // --- Auth Actions ---
  const login = async () => {
    try {
      setLoading(true);
      // Check if data exists. If not, seed it.
      const usersCollection = collection(db, 'users');
      const collectionSnapshot = await getDocs(usersCollection);
      if (collectionSnapshot.empty) {
        console.log('Database is empty. Seeding with mock data...');
        const batch = writeBatch(db);
        
        MOCK_USERS.forEach(user => {
          const userRef = doc(db, 'users', user.id.toString());
          batch.set(userRef, user);
        });
        MOCK_GROUPS.forEach(group => {
            const groupRef = doc(db, 'groups', group.id.toString());
            batch.set(groupRef, group);
        });
        MOCK_MESSAGES.forEach((msg) => {
            const msgRef = doc(collection(db, 'messages')); // Auto-generate ID
             // Omit id from mock message as firestore will add it
            const {id, ...msgData} = msg;
            batch.set(msgRef, msgData);
        });

        await batch.commit();
        console.log('Seeding complete.');
      }
      
      await signInAnonymously(auth);
      setActivePage('dashboard');
    } catch (error) {
      console.error("Error during login or seeding:", error);
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  // --- Render Logic ---
  const renderPage = () => {
    if (!currentUser) return <div className="flex items-center justify-center h-full"><p>Loading user data...</p></div>;
    switch (activePage) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} groups={groups} setActivePage={setActivePage} setSelectedGroup={setSelectedGroup} />;
      case 'find':
        return <FindPartnersPage currentUser={currentUser} users={users} />;
      case 'messages':
        return <MessagingPage currentUser={currentUser} users={users} messages={messages} addMessage={addMessage} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} updateUser={updateUser} />;
      case 'workspace':
        if (selectedGroup) {
          const currentGroupState = groups.find(g => g.id === selectedGroup.id) || selectedGroup;
          return <GroupWorkspacePage group={currentGroupState} updateGroup={updateGroup} />;
        }
        setActivePage('dashboard');
        return null;
      default:
        return <Dashboard currentUser={currentUser} groups={groups} setActivePage={setActivePage} setSelectedGroup={setSelectedGroup} />;
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
         <div className="text-center">
            <BookOpenIcon className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 animate-pulse" />
            <p className="text-slate-600 dark:text-slate-400 mt-4">Initializing StudySphere...</p>
         </div>
       </div>
     )
  }

  if (!fbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
          <BookOpenIcon className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold mt-4 text-slate-800 dark:text-slate-100">Welcome to StudySphere</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8">Find your perfect study group and collaborate like never before.</p>
          <button
            onClick={login}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform hover:scale-105"
          >
            Login as Demo User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      {currentUser && <Header currentUser={currentUser} activePage={activePage} setActivePage={setActivePage} logout={logout} />}
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;