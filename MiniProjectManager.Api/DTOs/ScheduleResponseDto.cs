namespace MiniProjectManager.Api.DTOs;

public class ScheduleResponseDto
{
    public List<string> RecommendedOrder { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}
