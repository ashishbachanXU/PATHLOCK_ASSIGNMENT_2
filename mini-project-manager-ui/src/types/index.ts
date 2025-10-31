export interface User {
  email: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  taskCount: number;
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
}

export interface CreateProject {
  title: string;
  description?: string;
}

export interface CreateTask {
  title: string;
  dueDate?: string;
}

export interface UpdateTask {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
