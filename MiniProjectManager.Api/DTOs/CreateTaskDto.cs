using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.DTOs;

public class CreateTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }
}
