import prisma from "../configs/prisma.js";
import { inngest } from "../inngest/index.js";

// Create task
export const createTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      projectId,
      title,
      description,
      type,
      status,
      priority,
      assigneeId,
      due_date,
    } = req.body;
    const origin = req.get("origin");

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (project.team_lead !== userId) {
      return res.status(403).json({ message: "Only the project lead can create tasks" });
    }

    if (assigneeId && !project.members.find((member) => member.userId === assigneeId)) {
      const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: assigneeId,
            workspaceId: project.workspaceId,
          },
        },
      });

      if (!workspaceMember) {
        return res.status(403).json({ message: "Assignee must be a member of the workspace" });
      }
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        priority,
        assigneeId,
        status,
        type,
        due_date: new Date(due_date),
      },
    });

    const taskWithAssignee = await prisma.task.findUnique({
      where: { id: task.id },
      include: { 
        assignee: true,
        project: {
          include: {
            workspace: {
              include: { owner: true }
            }
          }
        }
      },
    });

    const teamLead = project.members.find(m => m.userId === project.team_lead);

    await inngest.send({
      name: "app/task.assigned",
      data: {
        taskId: task.id,
        origin,
        adminName: taskWithAssignee.project.workspace.owner.name,
        teamLeadName: teamLead?.user?.name || "Project Lead"
      },
    });

    res.json({ task: taskWithAssignee, message: "Task created successfully" });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const { userId } = await req.auth();
    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      include: { members: { include: { user: true } } },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isTeamLead = project.team_lead === userId;
    const isAssignee = task.assigneeId === userId;

    if (!isTeamLead && !isAssignee) {
      return res.status(403).json({ message: "Only project lead or assignee can update this task" });
    }

    let dataToUpdate = req.body;
    if (!isTeamLead && isAssignee) {
      dataToUpdate = { status: req.body.status };
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });

    res.json({ task: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      include: { workspace: { include: { members: true } } }
    });

    const isAdmin = project.workspace.members.some(m => m.userId === userId && m.role === "ADMIN");
    const isProjectLead = project.team_lead === userId;

    if (!isAdmin && !isProjectLead) {
      return res.status(403).json({ message: "Insufficient permissions to delete this task" });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// Delete tasks (bulk)
export const deleteTasks = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { tasksIds } = req.body;
    
    if (!tasksIds?.length) return res.status(400).json({ message: "No task IDs provided" });

    const tasks = await prisma.task.findMany({
      where: { id: { in: tasksIds } },
    });

    if (tasks.length === 0) return res.status(404).json({ message: "Tasks not found" });

    const project = await prisma.project.findUnique({
      where: { id: tasks[0].projectId },
      include: { workspace: { include: { members: true } } },
    });

    const isAdmin = project.workspace.members.some(m => m.userId === userId && m.role === "ADMIN");
    const isProjectLead = project.team_lead === userId;

    if (!isAdmin && !isProjectLead) {
      return res.status(403).json({ message: "Insufficient permissions for bulk deletion" });
    }

    await prisma.task.deleteMany({
      where: { id: { in: tasksIds } },
    });

    res.json({ message: "Tasks deleted successfully" });
  } catch (error) {
    console.error("Bulk Delete Tasks Error:", error);
    res.status(500).json({ message: "Failed to delete tasks" });
  }
};
