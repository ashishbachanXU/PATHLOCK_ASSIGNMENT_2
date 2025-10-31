import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import type { Project, Task } from '../types';
import ProjectForm from './ProjectForm';
import MobileMenu from './MobileMenu';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<number, Task[]>>({});
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitles, setNewTaskTitles] = useState<Record<number, string>>({});
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [loadingTasks, setLoadingTasks] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const email = authService.getEmail();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete project');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleProjectCreated = () => {
    setShowForm(false);
    loadProjects();
  };

  const toggleProject = async (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
      // Load tasks if not already loaded
      if (!projectTasks[projectId]) {
        await loadProjectTasks(projectId);
      }
    }
    setExpandedProjects(newExpanded);
  };

  const loadProjectTasks = async (projectId: number) => {
    setLoadingTasks(prev => new Set(prev).add(projectId));
    try {
      const tasks = await taskService.getTasks(projectId);
      setProjectTasks(prev => ({ ...prev, [projectId]: tasks }));
    } catch (err) {
      console.error('Failed to load tasks:', err);
      alert('Failed to load tasks. Please try again.');
    } finally {
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const handleAddTask = async (projectId: number) => {
    const title = newTaskTitles[projectId]?.trim();
    if (!title) {
      alert('Please enter a task title');
      return;
    }

    // Clear input immediately for better UX
    setNewTaskTitles(prev => ({ ...prev, [projectId]: '' }));

    try {
      const newTask = await taskService.createTask(projectId, { title });
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), newTask]
      }));
      // Reload projects to update task count
      loadProjects();
    } catch (err: any) {
      // Restore input on error
      setNewTaskTitles(prev => ({ ...prev, [projectId]: title }));
      alert('Failed to add task. Please try again.');
      console.error('Add task error:', err);
    }
  };

  const handleToggleTask = async (projectId: number, taskId: number) => {
    const task = projectTasks[projectId]?.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: prev[projectId].map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    }));

    try {
      await taskService.updateTask(projectId, taskId, {
        title: task.title,
        isCompleted: !task.isCompleted,
        dueDate: task.dueDate
      });
    } catch (err) {
      // Revert on error
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: prev[projectId].map(t => 
          t.id === taskId ? task : t
        )
      }));
      alert('Failed to update task. Please try again.');
      console.error('Toggle task error:', err);
    }
  };

  const handleDeleteTask = async (projectId: number, taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const task = projectTasks[projectId]?.find(t => t.id === taskId);
    
    // Optimistic delete
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: prev[projectId].filter(t => t.id !== taskId)
    }));

    try {
      await taskService.deleteTask(projectId, taskId);
      // Reload projects to update task count
      loadProjects();
    } catch (err: any) {
      // Revert on error
      if (task) {
        setProjectTasks(prev => ({
          ...prev,
          [projectId]: [...prev[projectId], task].sort((a, b) => a.id - b.id)
        }));
      }
      alert('Failed to delete task. Please try again.');
      console.error('Delete task error:', err);
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const handleEditTask = async (projectId: number, taskId: number) => {
    const title = editTitle.trim();
    if (!title) {
      alert('Task title cannot be empty');
      return;
    }

    const task = projectTasks[projectId]?.find(t => t.id === taskId);
    if (!task) {
      alert('Task not found');
      return;
    }

    // Optimistic update
    const updatedTask = { ...task, title };
    setProjectTasks(prev => ({
      ...prev,
      [projectId]: prev[projectId].map(t => t.id === taskId ? updatedTask : t)
    }));
    setEditingTask(null);
    setEditTitle('');

    try {
      await taskService.updateTask(projectId, taskId, {
        title,
        isCompleted: task.isCompleted,
        dueDate: task.dueDate
      });
    } catch (err: any) {
      // Revert on error
      setProjectTasks(prev => ({
        ...prev,
        [projectId]: prev[projectId].map(t => t.id === taskId ? task : t)
      }));
      alert('Failed to update task. Please try again.');
      console.error('Edit task error:', err);
      // Re-open edit mode
      setEditingTask(taskId);
      setEditTitle(title);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="dashboard">
      <MobileMenu userEmail={email || undefined} onLogout={handleLogout} />
      <header className="dashboard-header">
        <h1>My Projects</h1>
        <div className="header-actions">
          <span className="user-email">{email}</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Project'}
        </button>

        {showForm && (
          <ProjectForm
            onSuccess={handleProjectCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="empty-state">No projects yet. Create your first project!</p>
          ) : (
            projects.map(project => (
              <div key={project.id} className="project-card-expanded">
                <div className="project-header">
                  <h3 onClick={() => toggleProject(project.id)} style={{ cursor: 'pointer' }}>
                    {expandedProjects.has(project.id) ? '▼' : '▶'} {project.title}
                  </h3>
                  <div className="project-header-actions">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="btn-add-task-header"
                      title="Add task"
                    >
                      + Add Task
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-delete"
                      title="Delete project"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
                
                {expandedProjects.has(project.id) && (
                  <div className="project-tasks-section">
                    {/* Add Task Form */}
                    <div className="dashboard-task-form">
                      <input
                        type="text"
                        placeholder="New task..."
                        value={newTaskTitles[project.id] || ''}
                        onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [project.id]: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask(project.id)}
                      />
                      <button 
                        onClick={() => handleAddTask(project.id)} 
                        className="btn-add-task"
                      >
                        + Add
                      </button>
                    </div>

                    {/* Tasks List */}
                    <div className="dashboard-tasks-list">
                      {loadingTasks.has(project.id) ? (
                        <p className="loading-tasks">Loading tasks...</p>
                      ) : projectTasks[project.id]?.length === 0 ? (
                        <p className="empty-tasks">No tasks yet. Add your first task!</p>
                      ) : (
                        projectTasks[project.id]?.map(task => (
                          <div key={task.id} className={`dashboard-task-item ${task.isCompleted ? 'completed' : ''}`}>
                            {editingTask === task.id ? (
                              <>
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleEditTask(project.id, task.id)}
                                  autoFocus
                                  className="edit-task-input"
                                />
                                <div className="task-edit-actions">
                                  <button onClick={() => handleEditTask(project.id, task.id)} className="btn-save">
                                    ✓
                                  </button>
                                  <button onClick={cancelEdit} className="btn-cancel">
                                    ✕
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <input
                                  type="checkbox"
                                  checked={task.isCompleted}
                                  onChange={() => handleToggleTask(project.id, task.id)}
                                />
                                <span className="task-title" onClick={() => startEditTask(task)}>
                                  {task.title}
                                </span>
                                <div className="task-actions">
                                  <button onClick={() => startEditTask(task)} className="btn-edit-small" title="Edit">
                                    ✎
                                  </button>
                                  <button onClick={() => handleDeleteTask(project.id, task.id)} className="btn-delete-small" title="Delete">
                                    ×
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="project-footer">
                  <span className="task-count">{project.taskCount} tasks</span>
                  <span className="project-date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
