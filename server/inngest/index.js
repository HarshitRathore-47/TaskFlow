import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

/**
 * Initialize Inngest client for handling background jobs and scheduled events.
 */
export const inngest = new Inngest({ id: "project-management" });

/**
 * Background function to send an email when a new task is assigned.
 * It also schedules a reminder email for the due date if the task isn't completed.
 */
const sendTaskAssignmentEmail = inngest.createFunction(
  { id: "send-task-assignment-email" },
  { event: "app/task.assigned" },
  async ({ event, step }) => {
    const { taskId, origin, adminName, teamLeadName } = event.data;

    if (!taskId) {
      console.error("No taskId provided in event data");
      return;
    }

    // Fetch full task details for the email content
    const task = await step.run("fetch-task", async () => {
      return await prisma.task.findUnique({
        where: { id: taskId },
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
    });

    if (!task || !task.assignee) {
      console.error("Task or Assignee not found for ID:", taskId);
      return;
    }

    // Send the initial assignment email with professional UI
    await step.run("send-email", async () => {
      const currentYear = new Date().getFullYear();
      await sendEmail({
        to: task.assignee.email,
        subject: `[New Task] ${task.title} | ${task.project.workspace.name}`,
        replyTo: task.project.workspace.owner?.email,
        body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Taskflow - New Task Assigned</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="background-color: #f8fafc; padding: 2rem;"> 
    <div style="max-width: 560px; margin: 0 auto;"> 
  
      <!-- Header --> 
              <div style="background: #1a1d27; border-radius: 14px 14px 0 0; padding: 36px 32px; text-align: center; border: 0.5px solid #2a2d3e;"> 
                <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="padding-right: 12px; vertical-align: middle;">
                      <div style="width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center;"> 
                        <img src="https://img.icons8.com/ios-filled/50/ffffff/flash-on.png" width="18" height="18" style="display: block; border: 0;" alt="logo" />
                      </div>
                    </td>
                    <td style="vertical-align: middle;">
                      <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.04em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1;">Taskflow</span>
                    </td>
                  </tr>
                </table>
                <p style="color: #94a3b8; font-size: 13px; margin: 16px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing: 0.02em;">${task.project.workspace.name}</p> 
              </div> 
          
              <!-- Body --> 
              <div style="background: #ffffff; border: 0.5px solid #e2e8f0; border-top: none; border-radius: 0 0 14px 14px; padding: 32px;"> 
          
                <div style="margin-bottom: 24px;"> 
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                      <td width="36" style="vertical-align: top; padding: 0;">
                        <div style="width: 36px; height: 36px; background: #f0fdf4; border-radius: 8px; text-align: center;"> 
                          <img src="https://img.icons8.com/ios-filled/50/16a34a/ok.png" width="20" height="20" style="display: inline-block; padding-top: 8px; border: 0;" alt="check" />
                        </div> 
                      </td>
                      <td style="padding-left: 12px; vertical-align: top; text-align: left;">
                        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b; font-family: sans-serif; line-height: 1.2;">New task assigned to you</p> 
                        <p style="margin: 4px 0 0; font-size: 13px; color: #64748b; font-family: sans-serif; line-height: 1.4;">Hello <strong>${task.assignee.name}</strong> — you have a new task in <strong>${task.project.name}</strong></p> 
                      </td>
                    </tr>
                  </table>
                </div> 
          
                <!-- Task card --> 
                <div style="background: #f8fafc; border: 0.5px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;"> 
                  
                  <!-- Priority + Type badges --> 
                  <table cellpadding="0" cellspacing="0" style="margin-bottom: 14px; border-collapse: collapse;">
                    <tr>
                      <td style="padding-right: 8px;">
                        <span style="font-size: 11px; font-weight: 600; background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; display: inline-block;">${task.priority} Priority</span>
                      </td>
                      <td>
                        <span style="font-size: 11px; font-weight: 500; background: #ffffff; color: #64748b; padding: 4px 12px; border-radius: 99px; border: 0.5px solid #e2e8f0; white-space: nowrap; display: inline-block;">${task.type}</span>
                      </td>
                    </tr>
                  </table>
          
                  <p style="margin: 0 0 6px; font-size: 17px; font-weight: 600; color: #1e293b; font-family: sans-serif; text-align: left;">${task.title}</p> 
                  <p style="margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.6; font-family: sans-serif; text-align: left;">${task.description || "No description provided for this task."}</p> 
          
                  <!-- Divider --> 
                  <div style="border-top: 0.5px solid #e2e8f0; margin-bottom: 16px;"></div> 
          
                  <!-- Info grid --> 
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                      <td width="50%" style="padding-bottom: 18px; vertical-align: top; text-align: left;">
                        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: sans-serif;">Due Date</p> 
                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #ef4444; font-family: sans-serif;">${new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p> 
                      </td>
                      <td width="50%" style="padding-bottom: 18px; vertical-align: top; text-align: left;">
                        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: sans-serif;">Task Type</p> 
                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1e293b; font-family: sans-serif;">${task.type}</p> 
                      </td>
                    </tr>
                    <tr>
                      <td width="50%" style="vertical-align: top; text-align: left;">
                        <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: sans-serif;">Project Lead</p> 
                        <table cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding-right: 8px;">
                              <div style="width: 24px; height: 24px; border-radius: 50%; background: #ede9fe; text-align: center;">
                                <span style="font-size: 10px; font-weight: 700; color: #6c63ff; line-height: 24px; font-family: sans-serif;">${teamLeadName ? teamLeadName.split(' ').map(w => w[0]).join('').toUpperCase() : 'NA'}</span>
                              </div>
                            </td>
                            <td>
                              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1e293b; font-family: sans-serif;">${teamLeadName || "N/A"}</p> 
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td width="50%" style="vertical-align: top; text-align: left;">
                        <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-family: sans-serif;">Workspace Admin</p> 
                        <table cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding-right: 8px;">
                              <div style="width: 24px; height: 24px; border-radius: 50%; background: #dcfce7; text-align: center;">
                                <span style="font-size: 10px; font-weight: 700; color: #16a34a; line-height: 24px; font-family: sans-serif;">${adminName ? adminName.split(' ').map(w => w[0]).join('').toUpperCase() : 'NA'}</span>
                              </div>
                            </td>
                            <td>
                              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1e293b; font-family: sans-serif;">${adminName || "N/A"}</p> 
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div> 
  
        <!-- CTA Button --> 
        <div style="text-align: center; margin-bottom: 8px;"> 
          <a href="${origin}" style="display: inline-block; background: #6c63ff; color: #ffffff; text-decoration: none; padding: 13px 36px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.01em;">View Task Details</a> 
        </div> 
        <p style="text-align: center; font-size: 12px; color: #64748b; margin: 12px 0 0;">You can also reply to this email to comment on the task</p> 
      </div> 
  
      <!-- Footer --> 
      <p style="text-align: center; font-size: 11px; color: #64748b; margin-top: 20px;">Automated notification from Taskflow &nbsp;·&nbsp; &copy; ${currentYear} Taskflow</p> 
    </div> 
  </div>
</body>
</html>`,
      });
    });

    // Schedule a reminder only if the due date is in the future
    if (new Date(task.due_date).toLocaleDateString() !== new Date().toDateString()) {
      await step.sleepUntil("wait-for-the-due-date", new Date(task.due_date));

      await step.run("check-if-task-is-completed", async () => {
        const updatedTask = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            assignee: true,
            project: {
              include: { workspace: true }
            }
          },
        });

        if (!updatedTask || !updatedTask.assignee) return;

        // Only send reminder if the task isn't finished yet
        if (updatedTask.status !== "DONE") {
          await sendEmail({
            to: updatedTask.assignee.email,
            subject: `[REMINDER] Task Overdue: ${updatedTask.title}`,
            replyTo: updatedTask.project.workspace.owner?.email,
            body: `<div style="max-width: 600px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; border: 1px solid #fee2e2; border-radius: 12px; padding: 30px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #ef4444; margin: 0; font-size: 24px;">Task Reminder</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Project: <strong>${updatedTask.project.name}</strong></p>
              </div>
              
              <h2 style="font-size: 20px;">Hi ${updatedTask.assignee.name}, 👋</h2>
              <p>This is a friendly reminder that your task is due today and is still marked as <strong>${updatedTask.status}</strong>.</p>
              
              <div style="background-color: #fff1f2; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #ef4444;">
                <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #991b1b;">${updatedTask.title}</p>
                <p style="margin: 0; color: #b91c1c; font-size: 14px;">Status: ${updatedTask.status}</p>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${origin}" style="background-color: #ef4444; color: #ffffff; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block;">
                  Update Task Status
                </a>
              </div>
              
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px;">
                Please complete this task to keep the project on track.
              </p>
            </div>`,
          });
        }
      });
    }
  }
);

/**
 * Background function to send a workspace invitation email.
 */
const sendWorkspaceInviteEmail = inngest.createFunction(
  { id: "send-workspace-invite-email" },
  { event: "app/workspace.invited" },
  async ({ event, step }) => {
    const { email, workspaceName, inviterName, inviterEmail, origin } = event.data;

    await sendEmail({
      to: email,
      subject: `[Invitation] Join ${workspaceName} on Taskflow`,
      replyTo: inviterEmail,
      body: `<div style="max-width: 600px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 12px; padding: 30px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 24px;">Workspace Invitation</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">You've been invited to collaborate on Taskflow!</p>
        </div>
        
        <h2 style="font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Hello! 👋</h2>
        <p><strong>${inviterName}</strong> has invited you to join the workspace <strong>${workspaceName}</strong> as a team member.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #2563eb;">
          <p style="margin: 0; color: #475569;">In this workspace, you can collaborate on projects, track your tasks, and communicate with your team in real-time.</p>
        </div>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${origin}/login" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Accept Invitation & Join
          </a>
        </div>
        
        <p style="font-size: 13px; color: #64748b;">
          If you don't have an account yet, you can sign up using this email address.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          This is an automated invitation from Taskflow.<br>
          If you weren't expecting this invitation, you can safely ignore this email.
        </p>
      </div>`,
    });
  }
);

/**
 * Export all background functions for Inngest to handle.
 */
export const functions = [
  sendTaskAssignmentEmail,
  sendWorkspaceInviteEmail,
];
