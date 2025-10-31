import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import type { Project, Task, CreateTask } from '../types';
import TaskItem from './TaskItem';
import MobileMenu from './MobileMenu';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjectAndTasks();
  }, [id]);

  const loadProjectAndTasks = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const projectData = await projectService.getProject(parseInt(id));
      setProject(projectData);
      // Tasks are loaded separately via the project
      // For now, we'll fetch them when creating/updating
      setTasks([]);
      setError('');
    } catch (err: any) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newTaskTitle.trim()) return;

    setCreating(true);
    try {
      const taskData: CreateTask = {
        title: newTaskTitle,
        dueDate: newTaskDueDate || undefined,
      };
      const newTask = await taskService.createTask(parseInt(id), taskData);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
    } catch (err: any) {
      alert('Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (error || !project) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Project not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const email = authService.getEmail();
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="project-details">
      <MobileMenu userEmail={email || undefined} onLogout={handleLogout} />
      <header className="project-details-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back
        </button>
        <div>
          <h1>{project.title}</h1>
          {project.description && <p className="project-description">{project.description}</p>}
        </div>
      </header>

      <div className="tasks-section">
        <h2>Tasks</h2>
        
        <form onSubmit={handleCreateTask} className="task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New task title"
            required
            disabled={creating}
          />
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            disabled={creating}
          />
          <button type="submit" disabled={creating} className="btn-primary">
            {creating ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add your first task!</p>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
