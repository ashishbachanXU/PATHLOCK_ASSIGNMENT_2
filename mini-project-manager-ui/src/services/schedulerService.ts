import api from './api';

export interface TaskSchedule {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

export interface ScheduleRequest {
  tasks: TaskSchedule[];
}

export interface ScheduleResponse {
  recommendedOrder: string[];
  message: string;
}

export const schedulerService = {
  async generateSchedule(projectId: number, request: ScheduleRequest): Promise<ScheduleResponse> {
    const response = await api.post(`/projects/${projectId}/schedule`, request);
    return response.data;
  }
};
