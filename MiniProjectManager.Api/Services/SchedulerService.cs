using MiniProjectManager.Api.DTOs;

namespace MiniProjectManager.Api.Services;

public class SchedulerService
{
    public ScheduleResponseDto GenerateSchedule(ScheduleRequestDto request)
    {
        var tasks = request.Tasks;
        
        // Validate for circular dependencies
        if (HasCircularDependency(tasks))
        {
            return new ScheduleResponseDto
            {
                Message = "Error: Circular dependency detected in tasks"
            };
        }

        // Perform topological sort
        var sortedTasks = TopologicalSort(tasks);
        
        // Sort by due date within dependency groups
        var finalOrder = SortByDueDate(sortedTasks, tasks);

        return new ScheduleResponseDto
        {
            RecommendedOrder = finalOrder,
            Message = "Schedule generated successfully"
        };
    }

    private bool HasCircularDependency(List<TaskScheduleDto> tasks)
    {
        var visited = new HashSet<string>();
        var recursionStack = new HashSet<string>();

        foreach (var task in tasks)
        {
            if (HasCycleUtil(task.Title, tasks, visited, recursionStack))
            {
                return true;
            }
        }

        return false;
    }

    private bool HasCycleUtil(string taskTitle, List<TaskScheduleDto> tasks, 
        HashSet<string> visited, HashSet<string> recursionStack)
    {
        if (recursionStack.Contains(taskTitle))
        {
            return true;
        }

        if (visited.Contains(taskTitle))
        {
            return false;
        }

        visited.Add(taskTitle);
        recursionStack.Add(taskTitle);

        var task = tasks.FirstOrDefault(t => t.Title == taskTitle);
        if (task != null)
        {
            foreach (var dependency in task.Dependencies)
            {
                if (HasCycleUtil(dependency, tasks, visited, recursionStack))
                {
                    return true;
                }
            }
        }

        recursionStack.Remove(taskTitle);
        return false;
    }

    private List<string> TopologicalSort(List<TaskScheduleDto> tasks)
    {
        var result = new List<string>();
        var visited = new HashSet<string>();
        var taskDict = tasks.ToDictionary(t => t.Title, t => t);

        foreach (var task in tasks)
        {
            if (!visited.Contains(task.Title))
            {
                TopologicalSortUtil(task.Title, taskDict, visited, result);
            }
        }

        result.Reverse();
        return result;
    }

    private void TopologicalSortUtil(string taskTitle, Dictionary<string, TaskScheduleDto> taskDict,
        HashSet<string> visited, List<string> result)
    {
        visited.Add(taskTitle);

        if (taskDict.TryGetValue(taskTitle, out var task))
        {
            foreach (var dependency in task.Dependencies)
            {
                if (!visited.Contains(dependency) && taskDict.ContainsKey(dependency))
                {
                    TopologicalSortUtil(dependency, taskDict, visited, result);
                }
            }
        }

        result.Add(taskTitle);
    }

    private List<string> SortByDueDate(List<string> sortedTasks, List<TaskScheduleDto> tasks)
    {
        var taskDict = tasks.ToDictionary(t => t.Title, t => t);
        var dependencyLevels = new Dictionary<string, int>();

        // Calculate dependency levels
        foreach (var taskTitle in sortedTasks)
        {
            if (taskDict.TryGetValue(taskTitle, out var task))
            {
                var maxDepLevel = 0;
                foreach (var dep in task.Dependencies)
                {
                    if (dependencyLevels.ContainsKey(dep))
                    {
                        maxDepLevel = Math.Max(maxDepLevel, dependencyLevels[dep] + 1);
                    }
                }
                dependencyLevels[taskTitle] = maxDepLevel;
            }
        }

        // Group by dependency level and sort by due date within each level
        var grouped = sortedTasks
            .GroupBy(t => dependencyLevels.GetValueOrDefault(t, 0))
            .OrderBy(g => g.Key);

        var result = new List<string>();
        foreach (var group in grouped)
        {
            var tasksInGroup = group
                .Select(title => taskDict.GetValueOrDefault(title))
                .Where(t => t != null)
                .OrderBy(t => t!.DueDate ?? DateTime.MaxValue)
                .ThenBy(t => t!.EstimatedHours)
                .Select(t => t!.Title);

            result.AddRange(tasksInGroup);
        }

        return result;
    }
}
