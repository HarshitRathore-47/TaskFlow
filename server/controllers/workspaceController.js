import prisma from "../configs/prisma.js";
import { inngest } from "../inngest/index.js";

// Get all workspaces for user
export const getWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: { some: { userId: userId } },
      },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            members: { include: { user: true } },
            workspace: {
              include: {
                members: { include: { user: true } }
              }
            }
          },
        },
        owner: true,
      },
    });

    res.json({ workspaces });
  } catch (error) {
    console.error("Fetch Workspaces Error:", error);
    res.status(500).json({ message: "Failed to load workspaces" });
  }
};

// Create Workspace
export const createWorkspace = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { name, slug, description } = req.body;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        members: { include: { user: true } },
        projects: true,
      },
    });

    res.status(201).json({ workspace, message: "Workspace created successfully" });
  } catch (error) {
    console.error("Create Workspace Error:", error);
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

// Update Workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id, name, description } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const isAdmin = workspace.members.some(m => m.userId === userId && m.role === "ADMIN");
    if (!isAdmin) return res.status(403).json({ message: "Only admins can update workspace" });

    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: { name, description },
    });

    res.json({ workspace: updatedWorkspace, message: "Workspace updated successfully" });
  } catch (error) {
    console.error("Update Workspace Error:", error);
    res.status(500).json({ message: "Failed to update workspace" });
  }
};

// Delete Workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (workspace.ownerId !== userId) return res.status(403).json({ message: "Only the owner can delete a workspace" });

    await prisma.workspace.delete({ where: { id } });
    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Delete Workspace Error:", error);
    res.status(500).json({ message: "Failed to delete workspace" });
  }
};

// Add member to workspace
export const addWorkspaceMember = async (req, res) => {
  try {
    const { userId: currentUserId } = await req.auth();
    const { email, role, workspaceId } = req.body;

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ message: "User not found" });

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const isAdmin = workspace.members.some(m => m.userId === currentUserId && m.role === "ADMIN");
    if (!isAdmin) return res.status(403).json({ message: "Only workspace admins can add members" });

    if (role === "ADMIN" && workspace.ownerId !== currentUserId) {
      return res.status(403).json({ message: "Only the workspace owner can promote someone to ADMIN" });
    }

    const existingMember = workspace.members.find(m => m.userId === userToAdd.id);
    if (existingMember) return res.status(400).json({ message: "User is already a member of this workspace" });

    const member = await prisma.workspaceMember.create({
      data: {
        userId: userToAdd.id,
        workspaceId,
        role: role || "MEMBER",
      },
      include: { 
        user: true,
        workspace: true
      }
    });

    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    });

    await inngest.send({
      name: "app/workspace.invited",
      data: {
        email: userToAdd.email,
        workspaceName: member.workspace.name,
        inviterName: currentUser.name,
        inviterEmail: currentUser.email,
        origin: req.get("origin")
      }
    });

    res.json({ member, message: "Member added successfully" });
  } catch (error) {
    console.error("Add Workspace Member Error:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};
