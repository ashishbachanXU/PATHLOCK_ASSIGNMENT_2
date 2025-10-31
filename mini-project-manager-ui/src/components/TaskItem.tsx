import { useState } from 'react';
import { taskService } from '../services/taskService';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updated = await taskService.updateTask(task.id, {
        title: task.title,
        dueDate: task.dueDate,
        isCompleted: !task.isCompleted,
      });
      onUpdate(updated);
    } catch (err) {
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      const updated = await taskService.updateTask(task.id, {
        title,
        dueDate: dueDate || undefined,
        isCompleted: task.isCompleted,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      await taskService.deleteTask(task.id);
      onDelete(task.id);
    } catch (err) {
      alert('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder="Task title"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />
        <div className="task-actions">
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            Save
          </button>
          <button onClick={handleCancel} disabled={loading} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggleComplete}
        disabled={loading}
      />
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.dueDate && (
          <span className="task-due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="task-actions">
        <button onClick={() => setIsEditing(true)} disabled={loading} className="btn-edit">
          Edit
        </button>
        <button onClick={handleDelete} disabled={loading} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}
