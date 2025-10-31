using MiniProjectManager.Api.DTOs;

namespace MiniProjectManager.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetProjectTasksAsync(int projectId, int userId);
    Task<TaskDto> CreateTaskAsync(int projectId, CreateTaskDto createTaskDto, int userId);
    Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId);
    Task<bool> DeleteTaskAsync(int taskId, int userId);
}
