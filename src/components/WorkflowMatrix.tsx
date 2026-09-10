import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Plus, 
  AlertCircle, 
  Clock, 
  ArrowUpDown, 
  CheckCircle2, 
  Check, 
  Flame,
  Zap
} from 'lucide-react';
import { WorkflowTask } from '../types';

interface WorkflowMatrixProps {
  tasks: WorkflowTask[];
  onToggleTaskComplete: (taskId: string) => void;
  onAddTask: (newTask: Omit<WorkflowTask, 'id'>) => void;
  onReprioritize: () => void;
}

export const WorkflowMatrix: React.FC<WorkflowMatrixProps> = ({
  tasks,
  onToggleTaskComplete,
  onAddTask,
  onReprioritize,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<WorkflowTask['category']>('Marketing');
  const [taskUrgency, setTaskUrgency] = useState<WorkflowTask['urgency']>('High');
  const [taskMinutes, setTaskMinutes] = useState('15');

  // Sorted by priority score descending
  const sortedTasks = [...tasks].sort((a, b) => b.priorityScore - a.priorityScore);

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    onAddTask({
      title: taskTitle,
      category: taskCategory,
      priorityScore: taskUrgency === 'Critical' ? 95 : taskUrgency === 'High' ? 88 : 70,
      urgency: taskUrgency,
      estimatedMinutes: Number(taskMinutes) || 15,
      completed: false,
      dueDate: 'Today, EOD',
      reasoning: 'Prioritized via Jack Daily Optimizer based on pipeline velocity impact.'
    });

    setTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div id="workflow-matrix-module" className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Daily Workflow Prioritization Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jack dynamically prioritizes your tasks according to revenue impact, buying intent signals, and SLA deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onReprioritize}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Jack Smart Re-Rank</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map((task, index) => (
          <div
            key={task.id}
            id={`workflow-task-${task.id}`}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              task.completed
                ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                : task.urgency === 'Critical'
                ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <button
                type="button"
                onClick={() => onToggleTaskComplete(task.id)}
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'border-slate-600 hover:border-cyan-400'
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-xs font-bold font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Rank #{index + 1}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    task.urgency === 'Critical'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : task.urgency === 'High'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                  }`}>
                    {task.urgency}
                  </span>
                  <span className="text-xs text-slate-500">({task.category})</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" /> ~{task.estimatedMinutes}m
                  </span>
                </div>

                <h4 className={`text-sm font-semibold text-slate-100 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h4>

                <p className="text-xs text-slate-400">
                  <span className="text-cyan-400/90 font-medium">Jack Reasoning:</span> {task.reasoning}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Priority Score</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {task.priorityScore}/100
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Add Daily Workflow Task
            </h3>
            <form onSubmit={handleTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Task Description</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Call CFO regarding contract redlines"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Executive">Executive</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Urgency</label>
                  <select
                    value={taskUrgency}
                    onChange={(e) => setTaskUrgency(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Est. Minutes</label>
                <input
                  type="number"
                  value={taskMinutes}
                  onChange={(e) => setTaskMinutes(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
