import React, { useState, useEffect } from 'react';
import { Button, Input, Card } from '../components/UI';
import { ArrowLeft, Moon, Plus, Trash2, Clock } from 'lucide-react';
import { getProfile, saveProfile } from '../services/storage';
import { Task, UserProfile } from '../types';

interface NightRoutineProps {
  onBack: () => void;
}

export const NightRoutine: React.FC<NightRoutineProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('06:00');

  useEffect(() => {
    const profile = getProfile();
    // Migration: Handle case where tasks might be strings from old version
    const loadedTasks = profile.nextDayTasks || [];
    const formattedTasks: Task[] = loadedTasks.map((t: any) => {
      if (typeof t === 'string') {
        return { id: Math.random().toString(), title: t, time: '08:00' };
      }
      return t;
    });
    setTasks(formattedTasks);
  }, []);

  const addTask = () => {
    if (newTaskTitle.trim() && tasks.length < 5) {
      const newTask: Task = {
        id: Math.random().toString(),
        title: newTaskTitle.trim(),
        time: newTaskTime
      };
      
      // Sort tasks by time
      const updated = [...tasks, newTask].sort((a, b) => a.time.localeCompare(b.time));
      
      setTasks(updated);
      setNewTaskTitle('');
      saveTasks(updated);
    }
  };

  const removeTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const saveTasks = (newTasks: Task[]) => {
    const profile = getProfile();
    profile.nextDayTasks = newTasks;
    saveProfile(profile);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-gray-900 text-white">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"><ArrowLeft /></button>
        <h1 className="text-2xl font-bold ml-2">Night Protocol</h1>
      </div>

      <Card className="bg-gray-800 border border-gray-700 text-white mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-400 rounded-xl text-black">
            <Moon size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Sleep Mode</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Target: 22:00</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          The battle for tomorrow is won tonight. Disconnect. Visualize. Rest.
        </p>
      </Card>

      <div className="mb-6 flex-1 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
           <span className="w-2 h-6 bg-yellow-400 rounded-sm"></span>
           Tomorrow's Mission
        </h3>
        <p className="text-sm text-gray-500 mb-6">Schedule your critical objectives.</p>
        
        <div className="flex flex-col gap-3 mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
          <div className="flex gap-3">
            <div className="w-1/3">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Time</label>
              <Input 
                type="time"
                dark
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="text-center px-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Objective</label>
              <Input 
                dark
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Gym, Deep Work..."
                disabled={tasks.length >= 5}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
          </div>
          <button 
            onClick={addTask}
            disabled={!newTaskTitle || tasks.length >= 5}
            className="w-full py-3 bg-yellow-400 text-black rounded-lg disabled:opacity-30 disabled:bg-gray-700 hover:bg-yellow-500 font-bold transition-colors uppercase text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add to Schedule
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 group">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 bg-black/30 rounded-lg border border-gray-700 text-yellow-400 font-mono text-sm font-bold flex items-center gap-2">
                  <Clock size={12} />
                  {task.time}
                </div>
                <span className="font-bold text-gray-200">{task.title}</span>
              </div>
              <button onClick={() => removeTask(task.id)} className="text-gray-600 hover:text-red-400 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-10 text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-xl font-medium">
              NO OBJECTIVES SET
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button onClick={onBack} variant="outline" className="border-gray-700 text-white hover:bg-gray-800 hover:border-white">
          Commit & Sleep
        </Button>
      </div>
    </div>
  );
};