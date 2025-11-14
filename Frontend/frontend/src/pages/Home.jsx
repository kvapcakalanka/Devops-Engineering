import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/home.css';

function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project proposal', priority: 'High', deadline: '2025-11-20', status: 'In Progress', progress: 60 },
    { id: 2, title: 'Review client feedback', priority: 'Medium', deadline: '2025-11-18', status: 'Pending', progress: 0 },
    { id: 3, title: 'Update documentation', priority: 'Low', deadline: '2025-11-25', status: 'In Progress', progress: 40 },
    { id: 4, title: 'Team meeting preparation', priority: 'High', deadline: '2025-11-15', status: 'Completed', progress: 100 },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'Medium',
    deadline: '',
    status: 'Pending'
  });

  const [showAddTask, setShowAddTask] = useState(false);
  const [filter, setFilter] = useState('All');

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  // Handle add task
  const handleAddTask = () => {
    if (newTask.title && newTask.deadline) {
      const task = {
        id: tasks.length + 1,
        ...newTask,
        progress: 0
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', priority: 'Medium', deadline: '', status: 'Pending' });
      setShowAddTask(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle update task status
  const handleUpdateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: newStatus, progress: newStatus === 'Completed' ? 100 : task.progress }
        : task
    ));
  };

  // Check for upcoming deadlines
  const getUpcomingDeadlines = () => {
    const today = new Date();
    const upcoming = tasks.filter(task => {
      const deadline = new Date(task.deadline);
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return daysUntil <= 3 && daysUntil >= 0 && task.status !== 'Completed';
    });
    return upcoming;
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className='home-page'>
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>TaskFlow Dashboard</h1>
          <p>Welcome back! Here's your task overview for today.</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{completedTasks}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{inProgressTasks}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{pendingTasks}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="progress-section">
          <h2>Overall Progress</h2>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${completionRate}%` }}>
              <span>{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Alert */}
        {upcomingDeadlines.length > 0 && (
          <div className="deadline-alert">
            <h3>⚠️ Upcoming Deadlines</h3>
            <ul>
              {upcomingDeadlines.map(task => (
                <li key={task.id}>
                  <strong>{task.title}</strong> - Due: {task.deadline}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Task Management Section */}
        <div className="task-section">
          <div className="task-header">
            <h2>My Tasks</h2>
            <div className="task-controls">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-dropdown"
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button 
                className="add-task-btn"
                onClick={() => setShowAddTask(!showAddTask)}
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Add Task Form */}
          {showAddTask && (
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
              />
              <div className="form-actions">
                <button onClick={handleAddTask} className="save-btn">Save Task</button>
                <button onClick={() => setShowAddTask(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="no-tasks">No tasks found. Start by adding a new task!</p>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task-card ${task.priority.toLowerCase()}-priority`}>
                  <div className="task-main">
                    <div className="task-info">
                      <h3>{task.title}</h3>
                      <div className="task-meta">
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className="deadline">📅 {task.deadline}</span>
                        <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="task-progress">
                    <div className="progress-label">Progress: {task.progress}%</div>
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Home;
