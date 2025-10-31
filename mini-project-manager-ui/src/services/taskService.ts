import api from './api';
import type { Task, CreateTask, UpdateTask } from '../types';

export const taskService = {
  async getTasks(projectId: number): Promise<Task[]> {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  async createTask(projectId: number, data: CreateTask): Promise<Task> {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async updateTask(projectId: number, taskId: number, data: UpdateTask): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(projectId: number, taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },
};
