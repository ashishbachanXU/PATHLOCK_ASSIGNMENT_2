using MiniProjectManager.Api.DTOs;

namespace MiniProjectManager.Api.Services;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(int userId);
    Task<ProjectDto?> GetProjectByIdAsync(int projectId, int userId);
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto, int userId);
    Task<bool> DeleteProjectAsync(int projectId, int userId);
}
