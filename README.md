# 🍳 RecipeApp

A modern full-stack recipe management application built with **ASP.NET Core Web API** and **React Native (Expo)**.

RecipeApp allows users to create, organize and manage their own recipes with a clean mobile experience. The project was developed to practice full-stack application architecture, authentication, state management and modern mobile development.

---

# ✨ Features

### Authentication
- JWT Authentication
- User Registration
- User Login
- Auto Login
- Logout

### Recipes
- Create Recipe
- Edit Recipe
- Delete Recipe
- Recipe Details
- Upload Recipe Images
- Dynamic Ingredients
- Dynamic Recipe Steps

### Organization
- Search Recipes
- Filter by Category
- Favorite Recipes
- Favorites Screen

### User Experience
- Profile Screen
- User Statistics
- Pull to Refresh
- Skeleton Loading
- Toast Notifications
- Optimistic Favorite Updates
- Responsive Mobile UI

---

# 📱 Screens

> Screenshots will be added soon.

| Login | Home | Recipe Detail | Favorites | Profile |
|-------|------|---------------|-----------|----------|
| Coming Soon | Coming Soon | Coming Soon | Coming Soon | Coming Soon |

---

# 🛠 Tech Stack

## Backend

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- AutoMapper
- JWT Authentication
- Swagger

## Mobile

- React Native
- Expo
- Expo Router
- TypeScript
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod
- NativeWind
- Axios

---

# 📂 Project Structure

```
RecipeApp
│
├── RecipeApp.Api
│   ├── Controllers
│   ├── DTOs
│   ├── Interfaces
│   ├── Mappings
│   ├── Models
│   ├── Services
│   └── ...
│
└── RecipeApp.Mobile
    ├── app
    ├── components
    ├── features
    ├── services
    ├── store
    ├── types
    └── ...
```

---

# 🚀 Getting Started

## Backend

```bash
cd RecipeApp.Api

dotnet restore

dotnet ef database update

dotnet run
```

API runs on

```
https://localhost:5001
```

Swagger

```
https://localhost:5001/swagger
```

---

## Mobile

```bash
cd RecipeApp.Mobile

npm install

npx expo start
```

---

# 🧱 Architecture

The project follows a **feature-based architecture** on the frontend.

```
features
│
├── auth
├── recipe
└── category
```

State management is handled with **Redux Toolkit + RTK Query**.

Forms are built using **React Hook Form + Zod**.

The backend follows a layered architecture:

```
Controllers

↓

Services

↓

Entity Framework Core

↓

PostgreSQL
```

---

# 🎯 Learning Goals

This project focuses on modern full-stack development practices including:

- Clean Architecture
- JWT Authentication
- RESTful API Design
- State Management
- Form Validation
- File Upload
- Optimistic UI Updates
- Reusable UI Components
- Mobile Application Development

---

# 📌 Roadmap

### ✅ Version 1.0

- Authentication
- Recipe CRUD
- Image Upload
- Favorites
- Profile
- Search
- Category Filter
- Skeleton Loading
- Toast Notifications

### 🚧 Planned Features

- Infinite Scroll
- Settings
- Dark Mode
- Recipe Sharing
- AI Recipe Import
- Multi-language Support
- Push Notifications

---

# 👩‍💻 Author

**Zeynep Tüfekçi**

Frontend Developer with 4+ years of professional experience, currently expanding into Backend Development using ASP.NET Core.

GitHub:
https://github.com/yourusername

LinkedIn:
https://linkedin.com/in/yourprofile
