# 🏫 CIMP - Club Information Management Portal

CIMP (Club Information Management Portal) is a full-stack web application designed to manage student clubs in an academic institution. It provides dashboards and features tailored for Admins, Club Presidents, and Faculty to streamline club creation, member management, and role-based access control.

---

## 📸 Project Screenshots

### 🧑‍💼 Admin Dashboard
<img src="/screenshots/admin-dashboard.png" width="100%" />

- View total clubs, active clubs, and members at a glance.
- Manage and edit club details.
- Filter clubs by category and status.

---

### 🔐 Login Page
<img src="/screenshots/login.png" width="100%" />

- Simple login interface.
- Role-based login support: Admin, Club President, Faculty.

---

### 📝 Sign-Up Page
<img src="/screenshots/signup.png" width="100%" />

- Easy onboarding for new users.
- Users must choose their role upon registration.

---

### 🧑‍🎓 Club President Dashboard
<img src="/screenshots/president-dashboard.png" width="100%" />

- View current club members.
- Send requests to add new members to the Admin.
- Manage roles of existing members.
- Seamless and intuitive user interface.

---

## 📚 Key Features

- 🔐 **Role-based Authentication**: Admin, Faculty, Club President
- 🏷️ **Club Creation & Management**: Only Admins can approve club requests
- 👥 **Member Requests**: Presidents can send member addition requests
- 📩 **Status Notifications**: Admin handles approvals or rejections
- 📊 **Dashboard Analytics**: Member counts, club activity, and more
- 🎨 **Modern UI**: Built with React, TailwindCSS/CSS Modules, and fully responsive

---

## ⚙️ Tech Stack

### Frontend
- **React.js** with Vite
- CSS Modules for scoped styling
- Axios for API requests
- JS-Cookie for session tracking

### Backend
- Node.js + Express.js
- MongoDB (with Mongoose ORM)
- JWT-based Authentication
- RESTful API Design

---

## 🚀 How It Works

1. **Sign Up**: User selects role → registers with basic info.
2. **Login**: Authenticated using credentials.
3. **Dashboard Rendering**:
   - Admin: Manage all clubs and user approvals.
   - President: View club members, request additions.
   - Faculty: View clubs they’re associated with.
4. **Admin Actions**:
   - Approve or reject club creation or member requests.
5. **Member Management**:
   - Presidents can dynamically add new members via a form.

---

## 🛠️ How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/cimp.git
cd cimp

# 2. Install dependencies
npm install

# 3. Start Frontend (Vite)
cd client
npm install
npm run dev

# 4. Start Backend (Express)
cd server
npm install
npm run dev
