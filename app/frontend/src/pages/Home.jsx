import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Circle, Clock, Plus, X, Trash2, Edit2, LogOut,
  Calendar, Filter, Search, TrendingUp, AlertCircle, CheckCheck
} from 'lucide-react';
import '../css/home.css';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    status: 'Pending',
    category: 'Work'
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load sample tasks (replace with API call later)
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: 1, title: 'Review project document', description: 'Update API docs with new endpoints', priority: 'High', deadline: '2026-02-15', status: 'In Progress', category: 'Work', createdAt: new Date().toISOString() },
        { id: 2, title: 'Prepare presentation slides', description: 'Create slides for team meeting', priority: 'Medium', deadline: '2026-02-18', status: 'Pending', category: 'Work', createdAt: new Date().toISOString() },
        { id: 3, title: 'Code review', description: 'Review pull requests from team members', priority: 'High', deadline: '2026-02-14', status: 'Completed', category: 'Development', createdAt: new Date().toISOString() },
      ]);
    }
  }, [navigate]);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.deadline) {
      const task = {
        id: Date.now(),
        ...newTask,
        createdAt: new Date().toISOString()
      };
      setTasks([task, ...tasks]);
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
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' }
        : task
    ));
  };

  const getDaysUntil = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and search tasks
  const filteredTasks = tasks
    .filter(task => filter === 'All' || task.status === filter)
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <CheckCheck size={32} />
              TaskFlow
            </h1>
            <p className="welcome-text">Welcome back, {user?.fullName || 'User'}!</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Tasks</p>
              <h3 className="stat-value">{totalTasks}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
              <CheckCheck size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Completed</p>
              <h3 className="stat-value">{completedTasks}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">In Progress</p>
              <h3 className="stat-value">{inProgressTasks}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'}}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Completion Rate</p>
              <h3 className="stat-value">{completionRate}%</h3>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <button className="btn-add" onClick={() => setShowAddTask(true)}>
            <Plus size={20} />
            ADD Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="tasks-section">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <Circle size={64} strokeWidth={1} />
              <h3>No tasks found</h3>
              <p>Create your first task to get started!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => {
                const daysUntil = getDaysUntil(task.deadline);
                const isOverdue = daysUntil < 0 && task.status !== 'Completed';
                const isDueSoon = daysUntil >= 0 && daysUntil <= 2 && task.status !== 'Completed';

                return (
                  <div key={task.id} className={`task-card ${task.status === 'Completed' ? 'completed' : ''}`}>
                    <div className="task-header">
                      <button 
                        className="task-checkbox"
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        {task.status === 'Completed' ? (
                          <CheckCircle2 size={24} color="#10b981" />
                        ) : (
                          <Circle size={24} color="#94a3b8" />
                        )}
                      </button>
                      <div className="task-main">
                        <h3 className="task-title">{task.title}</h3>
                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}
                      </div>
                      <div className="task-actions">
                        <button 
                          className="btn-icon"
                          onClick={() => setEditingTask(task)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="task-meta">
                      <span 
                        className="task-priority"
                        style={{
                          background: `${getPriorityColor(task.priority)}15`,
                          color: getPriorityColor(task.priority),
                          border: `1px solid ${getPriorityColor(task.priority)}30`
                        }}
                      >
                        {task.priority}
                      </span>
                      <span className="task-category">{task.category}</span>
                      <span className={`task-deadline ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
                        <Calendar size={14} />
                        {new Date(task.deadline).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                        {isDueSoon && ` (${daysUntil} days left)`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="btn-close" onClick={() => setShowAddTask(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    placeholder="e.g., Work, Personal"
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddTask(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddTask}>
                New Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="btn-close" onClick={() => setEditingTask(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    value={editingTask.deadline}
                    onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingTask(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdateTask}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
