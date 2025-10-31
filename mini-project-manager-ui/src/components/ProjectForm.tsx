import { useState, type FormEvent } from 'react';
import { projectService } from '../services/projectService';

interface ProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.length < 3 || title.length > 100) {
      setError('Title must be between 3 and 100 characters');
      return;
    }

    if (description.length > 500) {
      setError('Description cannot exceed 500 characters');
      return;
    }

    setLoading(true);

    try {
      await projectService.createProject({ title, description: description || undefined });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form">
      <h3>Create New Project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={100}
            disabled={loading}
            placeholder="Enter project title"
          />
          <small>{title.length}/100 characters</small>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            disabled={loading}
            placeholder="Enter project description (optional)"
            rows={4}
          />
          <small>{description.length}/500 characters</small>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
