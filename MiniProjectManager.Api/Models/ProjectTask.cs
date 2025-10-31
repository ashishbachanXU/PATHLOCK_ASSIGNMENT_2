namespace MiniProjectManager.Api.Models;

public class ProjectTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    
    // Foreign key
    public int ProjectId { get; set; }
    
    // Navigation property
    public Project Project { get; set; } = null!;
}
