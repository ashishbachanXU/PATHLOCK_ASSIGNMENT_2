using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.DTOs;

public class UpdateTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    [Required]
    public bool IsCompleted { get; set; }
}
