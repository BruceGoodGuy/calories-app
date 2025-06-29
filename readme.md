# Project Name: Calorie Tracker

## Description
This project is a calorie tracking application built using Laravel for the backend and React with TypeScript for the frontend. It includes features such as chart visualization, TDEE calculations, and more.

## Project Structure
- **Backend**: Laravel framework
- **Frontend**: React with TypeScript
- **Database**: MySQL (or other supported databases)
- **Build Tool**: Vite
- **Testing**: PHPUnit for backend, Jest/React Testing Library for frontend (if applicable)

## Prerequisites
- PHP >= 8.4
- Composer
- Node.js >= 22
- npm
- MySQL (or other database)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd calorie
```

### 2. Install Backend Dependencies
```bash
composer install
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Update the `.env` file with your database credentials and other configurations.

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Run Database Migrations
```bash
php artisan migrate
```

### 7. Build Frontend Assets
For development:
```bash
npm run dev
```
For production:
```bash
npm run build
```

### 8. Start the Application
Run the Laravel server:
```bash
php artisan serve
```

### 9. Optional: Run Tests
To run backend tests:
```bash
php artisan test
```

To run frontend linting:
```bash
npm run lint
```

## Deployment
For deployment, ensure you:
1. Set up a production database and update `.env`.
2. Build frontend assets using `npm run build`.
3. Use a web server like Apache or Nginx to serve the Laravel application.

## Additional Notes
- **Chart Configuration**: Charts are implemented in `resources/js/components/ui/chart.tsx` using Recharts.
- **Database Schema**: Includes tables like `tdee_details` for tracking TDEE-related data.
- **Testing Workflow**: CI/CD pipeline is defined in `.github/workflows/tests.yml`.

## License
Specify the license for your project here.

```# Project Name: Calorie Tracker

## Description
This project is a calorie tracking application built using Laravel for the backend and React with TypeScript for the frontend. It includes features such as chart visualization, TDEE calculations, and more.

## Project Structure
- **Backend**: Laravel framework
- **Frontend**: React with TypeScript
- **Database**: MySQL (or other supported databases)
- **Build Tool**: Vite
- **Testing**: PHPUnit for backend, Jest/React Testing Library for frontend (if applicable)

## Prerequisites
- PHP >= 8.4
- Composer
- Node.js >= 22
- npm
- MySQL (or other database)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd calorie
```

### 2. Install Backend Dependencies
```bash
composer install
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Update the `.env` file with your database credentials and other configurations.

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Run Database Migrations
```bash
php artisan migrate
```

### 7. Build Frontend Assets
For development:
```bash
npm run dev
```
For production:
```bash
npm run build
```

### 8. Start the Application
Run the Laravel server:
```bash
php artisan serve
```

### 9. Optional: Run Tests
To run backend tests:
```bash
php artisan test
```

To run frontend linting:
```bash
npm run lint
```

## Deployment
For deployment, ensure you:
1. Set up a production database and update `.env`.
2. Build frontend assets using `npm run build`.
3. Use a web server like Apache or Nginx to serve the Laravel application.

## Additional Notes
- **Chart Configuration**: Charts are implemented in `resources/js/components/ui/chart.tsx` using Recharts.
- **Database Schema**: Includes tables like `tdee_details` for tracking TDEE-related data.
- **Testing Workflow**: CI/CD pipeline is defined in `.github/workflows/tests.yml`.

## License
Specify the license for your project here.
