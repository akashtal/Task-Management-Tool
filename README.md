# 🚀 Todo Management Application

A modern, full-stack todo management application built with Next.js, featuring role-based access control, admin approval workflows, and dark mode support.

## 📋 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### 🔐 Authentication & Authorization
- **NextAuth.js** integration for secure authentication
- **Role-based access control** (User/Admin)
- **Admin approval workflow** for new user registrations
- **Session management** with JWT tokens

### 📝 Todo Management
- **Create, Read, Update, Delete** todos
- **Mark todos as complete/incomplete**
- **Edit todo details** (title, description)
- **Real-time updates** with toast notifications
- **Pending todo notifications**

### 🎨 User Interface
- **Dark/Light mode** toggle with system preference support
- **Responsive design** for all devices
- **Modern UI** with Tailwind CSS and shadcn/ui
- **Smooth animations** and transitions
- **Toast notifications** for user feedback

### 👥 Admin Features
- **User management** dashboard
- **Approve/reject** new user registrations
- **View all user todos** (read-only)
- **User status tracking**

## 🛠️ Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication solution
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **next-themes** - Dark mode support
- **react-hot-toast** - Toast notifications

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
NEXTAUTH_URL="https://your-domain.com"
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `NEXTAUTH_URL` | Your application URL | ✅ Yes |

## 🗄️ Database Setup

### 1. Install PostgreSQL
- **Windows**: Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create Database
```sql
CREATE DATABASE todo_app;
```

### 3. Run Database Migrations
```bash
npm run db:generate
npm run db:migrate
```

### 4. Seed Admin User
```bash
npm run db:seed
```

This creates an admin user with:
- **Email**: `admin@admin.com`
- **Password**: `admin123`

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📖 Usage Guide

### 👤 For New Users

#### 1. Registration
1. Visit the home page
2. Click "Create Account"
3. Fill in your email and password
4. Submit the registration form
5. **Wait for admin approval** (unless you're the admin)

#### 2. Login
1. Go to `/auth/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your dashboard

#### 3. Using the Dashboard
- **Create Todos**: Use the form at the top
- **Mark Complete**: Click the checkbox next to a todo
- **Edit Todo**: Click the edit icon (pencil)
- **Delete Todo**: Click the delete button
- **Toggle Theme**: Click the sun/moon icon in the header

### 👨‍💼 For New Admins

#### 1. First Admin Setup
The application comes with a default admin account:
- **Email**: `admin@admin.com`
- **Password**: `admin123`

#### 2. Admin Dashboard Access
1. Login with admin credentials
2. You'll be redirected to `/admin/dashboard`

#### 3. Admin Features
- **User Management**: View all registered users
- **Approve Users**: Click "Approve" for pending users
- **Reject Users**: Click "Reject" to deny access
- **View Todos**: See all user todos (read-only)

#### 4. Creating Additional Admins
1. Register a new user account
2. Login as the default admin
3. Go to the admin dashboard
4. Approve the new user
5. **Manually update the database** to change their role to 'admin'

```sql
UPDATE users SET role = 'admin' WHERE email = 'newadmin@example.com';
```

### 🎨 Dark Mode Usage

The application supports three theme modes:

1. **Light Mode**: Bright, clean interface
2. **Dark Mode**: Easy on the eyes
3. **System Mode**: Follows your device preference

**To change themes:**
1. Click the sun/moon icon in the top right
2. Select your preferred theme
3. Your choice is automatically saved

## 🔌 API Documentation

### Authentication Endpoints

#### `POST /api/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please wait for admin approval.",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### `POST /api/auth/[...nextauth]`
NextAuth.js authentication endpoint.

### Todo Endpoints

#### `GET /api/todos`
Get all todos for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the todo app",
    "completed": false,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `POST /api/todos/create`
Create a new todo.

**Request Body:**
```json
{
  "title": "New todo",
  "description": "Optional description"
}
```

#### `PUT /api/todos/[id]`
Update todo completion status.

**Request Body:**
```json
{
  "completed": true
}
```

#### `PATCH /api/todos/[id]`
Edit todo details.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

#### `DELETE /api/todos/[id]`
Delete a todo.

### Admin Endpoints

#### `GET /api/admin/users`
Get all users (admin only).

#### `GET /api/admin/todos`
Get all todos with user information (admin only).

#### `PATCH /api/admin/user-status`
Update user approval status (admin only).

**Request Body:**
```json
{
  "userId": 1,
  "status": "approved"
}
```

## 📁 Project Structure

```
todo-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin endpoints
│   │   │   ├── auth/          # Authentication
│   │   │   └── todos/         # Todo endpoints
│   │   ├── auth/              # Auth pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── dashboard/         # User dashboard
│   │   └── admin/             # Admin dashboard
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── ModeToggle.tsx    # Dark mode toggle
│   │   ├── TodoForm.tsx      # Todo creation form
│   │   └── EditTodoModal.tsx # Todo editing modal
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── drizzle.ts        # Database connection
│   │   ├── schema.ts         # Database schema
│   │   └── actions.ts        # Server actions
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── drizzle.config.ts         # Drizzle configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
**Error**: `Connection to database failed`

**Solution**:
1. Check your `DATABASE_URL` in `.env.local`
2. Ensure PostgreSQL is running
3. Verify database exists: `psql -d todo_app`

#### 2. Authentication Issues
**Error**: `Unauthorized` responses

**Solution**:
1. Check `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your domain
3. Clear browser cookies and try again

#### 3. Dark Mode Not Working
**Issue**: Theme toggle doesn't work

**Solution**:
1. Ensure `next-themes` is installed
2. Check `ThemeProvider` is wrapping the app
3. Verify `suppressHydrationWarning` is set

#### 4. API Routes Returning 404
**Issue**: API endpoints not found

**Solution**:
1. Check file naming (`route.ts`, not `router.ts`)
2. Verify Next.js 15+ params awaiting
3. Restart development server

### Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate migrations
npm run db:migrate     # Run migrations
npm run db:seed        # Seed admin user

# Linting and formatting
npm run lint           # Run ESLint
npm run format         # Run Prettier
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Happy coding! 🎉**
