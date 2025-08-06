# 🤖 Discord Forum Ticket Bot

A **simple** and **efficient** ticket system bot that works with Discord forum channels —  
allowing users to open **one ticket at a time** via DM and get support from admins smoothly.

---

## ⚙️ How It Works

- Users open tickets by sending a **DM to the bot**.  
- The bot creates a **forum thread** (ticket) in a specified channel on your Discord server.  
- Each user can have **only one open ticket at a time** — no duplicate tickets allowed.  
- Tickets are tagged as **Open** or **Closed** to track status within the forum.  
- Admins with the right permissions can reply directly in the forum thread.  
- Users receive responses **via DM**, keeping the conversation private.  
- Admins can communicate privately by starting a message with a `.` (dot) — these messages are **hidden from users**.  
- Admins can **blacklist users** by their ID using `/blacklist user_id`, preventing them from creating new tickets.  
- Blacklisted users can be removed from the blacklist with `/unblacklist user_id`.  
- Blacklisted users **cannot open tickets** until removed.

---

## 🛠 Installation & Setup

1. Clone the repository or download the bot code.

2. Install dependencies:  
   ```bash
   npm install
