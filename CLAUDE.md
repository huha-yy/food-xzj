# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Campus food evaluation system (校园美食评价系统) — a graduation project with a React frontend and SpringBoot backend. Users can browse foods, merchants, leave reviews, and collect favorites. Three roles: STUDENT, MERCHANT, ADMIN.

## Development Commands

### Backend (run from `backend/`)
```bash
mvn spring-boot:run        # Start dev server on :8080
mvn clean package          # Build JAR
mvn test                   # Run tests
```

### Frontend (run from `frontend/`)
```bash
npm install                # Install dependencies
npm run dev                # Start dev server on :5173
npm run build              # Build production bundle
npm run preview            # Preview production build
```

### Database Setup
```bash
mysql -u root -p < sql/campus_food_schema.sql      # Create tables
mysql -u root -p < sql/campus_food_init_data.sql   # Seed data (optional)
```

## Architecture

**Frontend** (`frontend/src/`):
- `api/` — Axios modules per domain (auth, food, etc.)
- `utils/request.js` — Axios instance with JWT interceptor (reads token from localStorage, sets `Authorization: Bearer {token}` header)
- `router/index.js` — React Router 6 config with lazy-loaded pages
- `layouts/` — Shared layout wrapper
- `pages/` — Page components organized by domain (auth, home, food, merchant, review, collection, user)

**Backend** (`backend/src/main/java/com/campus/food/`):
- Standard layered architecture: `controller/` → `service/impl/` → `mapper/` → MySQL
- `entity/` — MyBatis-Plus entities; `dto/` — request bodies; `vo/` — response shapes
- `security/` — JWT filter (`JwtAuthenticationFilter`) validates `Authorization` header on protected routes
- `common/` — Shared utilities, constants, global exception handler

**Frontend–Backend communication**:
- Vite proxy (`vite.config.js`) forwards `/api/*` to `http://localhost:8080` during development, eliminating CORS issues
- All responses use `{ code, message, data }` envelope; `code: 200` = success

## Key Conventions

- **Soft delete**: All records use `is_deleted` flag — never hard DELETE
- **No foreign keys**: Referential integrity enforced in application code, not DB
- **File uploads**: Stored at `backend/src/main/resources/static/uploads/`; max 5MB; jpg/jpeg/png only; served as static resources
- **JWT expiry**: 30 days; secret configured in `application.yml` under `jwt.secret`
- **Passwords**: BCrypt (10 rounds) — never compare plaintext
- **MyBatis-Plus**: Use built-in CRUD methods where possible; custom SQL goes in XML or `@Select` annotations in `mapper/`
- **API docs**: Available at `http://localhost:8080/doc.html` (Knife4j) when backend is running

## Database

- DB name: `campus_food`, charset `utf8mb4`, engine InnoDB, MySQL 8.0
- Core tables: `user`, `user_profile`, `merchant`, `category`, `food`, `review`, `review_image`, `collection`, `interaction`, `announcement`, `activity`
- `id-type: auto` — IDs are auto-increment integers

## Frontend Conventions

- Functional components + Hooks only (no class components)
- Component filenames: PascalCase; paired CSS file with same name
- All pages are lazy-loaded via `React.lazy()`
- Ant Design 5.x for all UI components
