import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, CheckCircle, Circle, AlertCircle, Plus, X, Trash2, Edit2, Save, Filter } from 'lucide-react';

function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project proposal', description: 'Finalize and submit Q4 proposal', priority: 'High', deadline: '2025-11-20', status: 'In Progress', progress: 60, category: 'Work' },
    { id: 2, title: 'Review client feedback', description: 'Go through client comments on deliverables', priority: 'Medium', deadline: '2025-11-18', status: 'Pending', progress: 0, category: 'Work' },
    { id: 3, title: 'Update documentation', description: 'Update API documentation with new endpoints', priority: 'Low', deadline: '2025-11-25', status: 'In Progress', progress: 40, category: 'Development' },
    { id: 4, title: 'Team meeting preparation', description: 'Prepare slides for weekly sync', priority: 'High', deadline: '2025-11-15', status: 'Completed', progress: 100, category: 'Work' },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    status: 'Pending',
    category: 'Work'
  });

  const [editingTask, setEditingTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter and search tasks
  const filteredTasks = tasks
    .filter(task => filter === 'All' || task.status === filter)
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const handleAddTask = () => {
    if (newTask.title && newTask.deadline) {
      const task = {
        id: Date.now(),
        ...newTask,
        progress: 0
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', priority: 'Medium', deadline: '', status: 'Pending', category: 'Work' });
      setShowAddTask(false);
    }
  };

  const handleUpdateTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleUpdateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: newStatus, progress: newStatus === 'Completed' ? 100 : task.progress }
        : task
    ));
  };

  const handleProgressUpdate = (id, newProgress) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, progress: newProgress, status: newProgress === 100 ? 'Completed' : task.status === 'Pending' ? 'In Progress' : task.status }
        : task
    ));
  };

  const getDaysUntil = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpcomingDeadlines = () => {
    return tasks.filter(task => {
      const daysUntil = getDaysUntil(task.deadline);
      return daysUntil <= 3 && daysUntil >= 0 && task.status !== 'Completed';
    });
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's your task overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Today</p>
              <p className="text-lg font-semibold text-slate-700">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completedTasks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{inProgressTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingTasks}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 10 && <span className="text-xs text-white font-semibold">{completionRate}%</span>}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Alert */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Upcoming Deadlines</h3>
                <div className="space-y-2">
                  {upcomingDeadlines.map(task => (
                    <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div>
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-sm text-slate-600">Due: {task.deadline}</p>
                      </div>
                      <span className="text-sm font-semibold text-amber-600">
                        {getDaysUntil(task.deadline)} days left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">My Tasks</h2>
            <button 
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>

          {/* Add Task Modal */}
          {showAddTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900">Add New Task</h3>
                  <button onClick={() => setShowAddTask(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={handleAddTask}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Task
                    </button>
                    <button 
                      onClick={() => setShowAddTask(false)}
                      className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tasks found. Start by adding a new task!</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingTask?.id === task.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      />
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={handleUpdateTask}
                          className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingTask(null)}
                          className="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.priority === 'High' ? 'bg-red-100 text-red-700' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {task.status}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.deadline}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              {task.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Progress: {task.progress}%</span>
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => handleProgressUpdate(task.id, parseInt(e.target.value))}
                            className="w-24"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-600 text-sm">
            © 2025 TaskFlow. Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;