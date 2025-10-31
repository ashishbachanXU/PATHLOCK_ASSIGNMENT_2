using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Api.Data;
using MiniProjectManager.Api.DTOs;
using MiniProjectManager.Api.Models;

namespace MiniProjectManager.Api.Services;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TaskService> _logger;

    public TaskService(ApplicationDbContext context, ILogger<TaskService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskDto>> GetProjectTasksAsync(int projectId, int userId)
    {
        // Verify user owns the project
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project == null)
        {
            throw new UnauthorizedAccessException("Project not found or access denied");
        }

        var tasks = await _context.Tasks
            .Where(t => t.ProjectId == projectId)
            .OrderBy(t => t.Id)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                ProjectId = t.ProjectId
            })
            .ToListAsync();

        return tasks;
    }

    public async Task<TaskDto> CreateTaskAsync(int projectId, CreateTaskDto createTaskDto, int userId)
    {
        // Verify user owns the project
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project == null)
        {
            throw new UnauthorizedAccessException("Project not found or access denied");
        }

        var task = new ProjectTask
        {
            Title = createTaskDto.Title,
            DueDate = createTaskDto.DueDate,
            IsCompleted = false,
            ProjectId = projectId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task created with ID {TaskId} for project {ProjectId}", task.Id, projectId);

        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted,
            ProjectId = task.ProjectId
        };
    }

    public async Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId)
    {
        // Get task and verify user owns the parent project
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null || task.Project.UserId != userId)
        {
            return null;
        }

        task.Title = updateTaskDto.Title;
        task.DueDate = updateTaskDto.DueDate;
        task.IsCompleted = updateTaskDto.IsCompleted;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Task {TaskId} updated by user {UserId}", taskId, userId);

        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted,
            ProjectId = task.ProjectId
        };
    }

    public async Task<bool> DeleteTaskAsync(int taskId, int userId)
    {
        // Get task and verify user owns the parent project
        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null || task.Project.UserId != userId)
        {
            return false;
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Task {TaskId} deleted by user {UserId}", taskId, userId);

        return true;
    }
}
