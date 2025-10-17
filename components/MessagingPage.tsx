import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Message } from '../types';

interface MessagingPageProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

const MessagingPage: React.FC<MessagingPageProps> = ({ currentUser, users, messages, addMessage }) => {
  const conversations = useMemo(() => {
    const userIds = new Set<number>();
    messages.forEach(msg => {
      if (msg.senderId === currentUser.id) userIds.add(msg.receiverId);
      if (msg.receiverId === currentUser.id) userIds.add(msg.senderId);
    });
    return Array.from(userIds).map(id => users.find(u => u.id === id)).filter(Boolean) as User[];
  }, [messages, currentUser, users]);

  const [selectedUser, setSelectedUser] = useState<User | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');

  const conversationMessages = useMemo(() => {
    if (!selectedUser) return [];
    return messages
      .filter(
        msg =>
          (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
          (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedUser, messages, currentUser]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversations.length > 0 && !selectedUser) {
      setSelectedUser(conversations[0]);
    }
  }, [conversations, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUser) return;
    addMessage({
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar with conversations */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        <div className="overflow-y-auto">
          {conversations.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 ${selectedUser?.id === user.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {messages.filter(m => m.senderId === user.id || m.receiverId === user.id).pop()?.text || 'No messages yet'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat window */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center space-x-3">
              <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100 dark:bg-slate-900">
              <div className="space-y-4">
                {conversationMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700"
              />
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
