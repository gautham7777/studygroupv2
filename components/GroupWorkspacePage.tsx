
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Group, User, StudyPlan } from '../types';
import { ALL_SUBJECTS, MOCK_USERS } from '../constants';
import { generateStudyPlan } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface GroupWorkspacePageProps {
  group: Group;
  updateGroup: (updatedGroup: Group) => void;
}

const GroupWorkspacePage: React.FC<GroupWorkspacePageProps> = ({ group, updateGroup }) => {
  const [activeTab, setActiveTab] = useState<'scratchpad' | 'whiteboard' | 'plan'>('scratchpad');
  const [scratchpadText, setScratchpadText] = useState(group.workspaceContent.scratchpad);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | undefined>(group.workspaceContent.studyPlan);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const subjectName = ALL_SUBJECTS.find(s => s.id === group.subjectId)?.name || 'Unknown Subject';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    context.lineCap = 'round';
    context.strokeStyle = document.body.classList.contains('dark') ? 'white' : 'black';
    context.lineWidth = 3;
    contextRef.current = context;

    // Load existing whiteboard data
    if (group.workspaceContent.whiteboard) {
      const image = new Image();
      image.src = group.workspaceContent.whiteboard;
      image.onload = () => {
        contextRef.current?.drawImage(image, 0, 0);
      };
    }

  }, [group.workspaceContent.whiteboard]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
    // Save whiteboard state
    const canvas = canvasRef.current;
    if(canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      updateGroup({ ...group, workspaceContent: { ...group.workspaceContent, whiteboard: dataUrl } });
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };
  
  const handleGeneratePlan = async () => {
    setIsLoadingPlan(true);
    const plan = await generateStudyPlan(subjectName, scratchpadText);
    if(plan) {
      setStudyPlan(plan);
      updateGroup({ ...group, workspaceContent: { ...group.workspaceContent, studyPlan: plan } });
      setActiveTab('plan');
    } else {
      alert('Failed to generate study plan. Please check your API key and try again.');
    }
    setIsLoadingPlan(false);
  };
  
  const handleScratchpadBlur = () => {
     updateGroup({ ...group, workspaceContent: { ...group.workspaceContent, scratchpad: scratchpadText } });
  }

  return (
    <div className="p-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{group.name}</h1>
          <p className="text-slate-600 dark:text-slate-400">Workspace for {subjectName}</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
                {group.members.map(id => MOCK_USERS.find(u => u.id === id)).map(member => (
                    member && <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900"/>
                ))}
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={isLoadingPlan}
              className="flex items-center space-x-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SparklesIcon className="h-5 w-5"/>
                <span>{isLoadingPlan ? 'Generating...' : 'AI Study Plan'}</span>
            </button>
        </div>
      </div>

      <div className="mt-6 flex-1 flex flex-col">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('scratchpad')} className={`${activeTab === 'scratchpad' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Scratchpad</button>
            <button onClick={() => setActiveTab('whiteboard')} className={`${activeTab === 'whiteboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Whiteboard</button>
            <button onClick={() => setActiveTab('plan')} className={`${activeTab === 'plan' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Study Plan</button>
          </nav>
        </div>
        <div className="flex-1 mt-4">
            {activeTab === 'scratchpad' && (
                <textarea 
                    value={scratchpadText}
                    onChange={(e) => setScratchpadText(e.target.value)}
                    onBlur={handleScratchpadBlur}
                    className="w-full h-full p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                    placeholder="Type your shared notes here..."
                />
            )}
            {activeTab === 'whiteboard' && (
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
                    <canvas 
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        onMouseLeave={finishDrawing}
                        className="w-full h-full"
                    />
                </div>
            )}
            {activeTab === 'plan' && (
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 p-6 overflow-y-auto">
                    {studyPlan ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">5-Day Study Plan for {subjectName}</h2>
                            {studyPlan.plan.map(day => (
                                <div key={day.day} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">Day {day.day}: {day.goal}</h3>
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-sm">Key Concepts:</h4>
                                            <ul className="list-disc list-inside text-sm mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                                                {day.concepts.map((c, i) => <li key={i}>{c}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Activities:</h4>
                                            <ul className="list-disc list-inside text-sm mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                                                {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400">No study plan generated yet.</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Use the "AI Study Plan" button to create one based on your scratchpad.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GroupWorkspacePage;
