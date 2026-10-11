# campus-pulse-hci
HCI-based platform for student issue reporting, feedback, resolution tracking, and campus improvement.

## Staff access

Signup supports student and staff/resolver roles for the local college demo. The backend accepts only those two role values, and protected staff APIs still verify the role from the MongoDB user associated with the JWT.

When the backend starts, it creates the demo account only if the email does not exist:

- Email: `staff@campuspulse.com`
- Password: `Staff@123`

An existing account with that email is never overwritten. Select **Staff/Resolver Login** for it; select **Student Login** for student accounts. Staff accounts created through signup use the `General` department.

## Staff and resolver portal

The staff portal includes a command center, split-view issue queue, assigned and resolved worklists, escalations watch, and campus insights. Staff can assign issues, post student-facing updates, and escalate an issue for administrator review.

Resolution is a two-step workflow: the resolver submits mandatory remarks and at least one JPEG, PNG, WebP, or PDF proof file (1 MB total limit), then the reporting student reviews the evidence and verifies the fix or asks staff to continue work. The reporter and students who supported the issue are notified of staff updates and verification requests.

No institutional SLA policy is configured yet. The escalations watch uses a clearly labeled seven-day review-age indicator alongside safety and manually escalated issues; it is not represented as an official SLA deadline. Analytics are calculated from available issue records. Satisfaction scores and SLA compliance metrics are not collected.

## Issue workflow

Student and staff views use the same MongoDB `issues` documents. Staff operations and student reopening are authenticated API actions; status history is stored on the issue, staff comments use the existing `comments` collection, and student notifications use the `notifications` collection. Resolution proof and remarks are required before requesting student verification; a report is marked resolved only after the reporting student confirms it.
