# campus-pulse-hci
HCI-based platform for student issue reporting, feedback, resolution tracking, and campus improvement.

## Staff access

Signup supports student and staff/resolver roles for the local college demo. The backend accepts only those two role values, and protected staff APIs still verify the role from the MongoDB user associated with the JWT.

When the backend starts, it creates the demo account only if the email does not exist:

- Email: `staff@campuspulse.com`
- Password: `Staff@123`

An existing account with that email is never overwritten. Select **Staff/Resolver Login** for it; select **Student Login** for student accounts. Staff accounts created through signup use the `General` department.

## Issue workflow

Student and staff views use the same MongoDB `issues` documents. Staff operations and student reopening are authenticated API actions; status history is stored on the issue, staff comments use the existing `comments` collection, and student notifications use the `notifications` collection. An issue can only be marked resolved from `in_progress` when the staff member provides the action taken.
