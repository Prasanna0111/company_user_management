# Company & User Management System

Live Demo: [https://company-user-management-jade.vercel.app/](https://company-user-management-jade.vercel.app/)

A comprehensive full-stack application for managing companies and their associated users. This system provides a modern dashboard for data visualization, location mapping, and robust user management.

## 🚀 Features

- **Company Dashboard**: View, create, update, and delete companies with integrated Maps for company location and infinite scrolling with pagination.
- **User Management**: Full CRUD operations for users, including pagination, multi-column sorting, and advanced filtering.
- **User Migration**: Easily move users from one company to another via a custom migration interface.
- **Analytics**: At-a-glance statistics showing active users, unassigned users, and company distribution.
- **Custom UI Components**: Built with performance and aesthetics in mind, featuring custom-styled input, select, button, and interactive table.
- **Modern Design**: Responsive, glassmorphic UI with smooth animations and a focus on UX.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, Lucide React, CSS3 (Vanilla).
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL.
- **Icons**: Lucide React.
- **Notifications**: React Toastify.

## 🏃 How to Run

Clone the repository from github or download the zip file and follow the steps below.

```bash
git clone https://github.com/Prasanna0111/company_user_management.git
```

### 1. Database Setup

Ensure you have PostgreSQL installed and running. Execute the schema (usually found in `com_user_backend/src/models/schema.sql`) to set up the necessary tables.

### 2. Backend Setup

```bash
cd com_user_backend
npm install
# Create a .env file based on .env.example with your DB credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd com_user_frontend
npm install
# Create a .env file based on .env.example with your backend API URL
npm run dev
```

The application will be available at `http://localhost:5173` (Frontend) and the API will run at `http://localhost:3000` (Backend).

## 📄 Deployment

The project is configured for deployment on **Vercel** (Frontend) and **Render** (Backend & DB).
