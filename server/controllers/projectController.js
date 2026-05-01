import prisma from "../configs/prisma.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: { include: { user: true } } },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isAdmin = workspace.members.some(
      (member) => member.userId === userId && member.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only workspace admins can create projects",
      });
    }

    const teamLead = await prisma.user.findUnique({
      where: { email: team_lead },
      select: { id: true },
    });

    if (!teamLead) {
      return res.status(404).json({ message: "Team lead user not found" });
    }

    const project = await prisma.project.create({
      data: {
        workspaceId,
        name,
        description,
        status,
        priority,
        progress,
        team_lead: teamLead.id,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    if (team_members?.length > 0) {
      const membersToAdd = [];
      workspace.members.forEach((member) => {
        if (team_members.includes(member.user.email)) {
          membersToAdd.push(member.user.id);
        }
      });

      if (!membersToAdd.includes(teamLead.id)) {
        membersToAdd.push(teamLead.id);
      }

      await prisma.projectMember.createMany({
        data: membersToAdd.map((memberId) => ({
          projectId: project.id,
          userId: memberId,
        })),
        skipDuplicates: true,
      });
    } else {
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: teamLead.id,
        },
      });
    }

    const projectWithMembers = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        members: { include: { user: true } },
        tasks: {
          include: { assignee: true, comments: { include: { user: true } } },
        },
        owner: true,
        workspace: {
          include: {
            members: { include: { user: true } }
          }
        }
      },
    });

    res.json({
      project: projectWithMembers,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ message: "Server error while creating project" });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      id,
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      progress,
      priority,
    } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isAdmin = workspace.members.some(
      (member) => member.userId === userId && member.role === "ADMIN"
    );

    if (!isAdmin) {
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.team_lead !== userId) {
        return res.status(403).json({
          message: "Only workspace admins or project leads can update this project",
        });
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        workspaceId,
        description,
        name,
        status,
        priority,
        progress,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    res.json({ project: updatedProject, message: "Project updated successfully" });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Server error while updating project" });
  }
};

// Add Member to Project
export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { 
        members: { include: { user: true } },
        workspace: { include: { members: true } }
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isProjectLead = project.team_lead === userId;
    const isWorkspaceAdmin = project.workspace.members.some(
      (m) => m.userId === userId && m.role === "ADMIN"
    );

    if (!isProjectLead && !isWorkspaceAdmin) {
      return res
        .status(403)
        .json({ message: "Only project lead or workspace admin can add members" });
    }

    const existingMember = project.members.find(
      (member) => member.user.email === email
    );

    if (existingMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: project.workspaceId,
        },
      },
    });

    if (!workspaceMember) {
      return res.status(400).json({
        message: "User must be a member of the workspace first",
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
      },
      include: { user: true },
    });

    res.json({ member, message: "Member added successfully" });
  } catch (error) {
    console.error("Add Project Member Error:", error);
    res.status(500).json({ message: "Server error while adding project member" });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { workspace: { include: { members: true } } },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAdmin = project.workspace.members.some(
      (member) => member.userId === userId && member.role === "ADMIN"
    );

    const isProjectLead = project.team_lead === userId;

    if (!isAdmin && !isProjectLead) {
      return res.status(403).json({
        message: "Only workspace admin or project lead can delete this project",
      });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Server error while deleting project" });
  }
};
