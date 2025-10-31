namespace MiniProjectManager.Api.DTOs;

public class ScheduleRequestDto
{
    public List<TaskScheduleDto> Tasks { get; set; } = new();
}

public class TaskScheduleDto
{
    public string Title { get; set; } = string.Empty;
    public int EstimatedHours { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string> Dependencies { get; set; } = new();
}
