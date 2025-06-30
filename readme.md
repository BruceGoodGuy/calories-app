# Project Name: Calorie Tracker
## Description
Calorie Tracker is a robust application designed to assist users in monitoring their daily calorie intake and expenditure. The backend is powered by Laravel, with additional features implemented using PHPNative, while the frontend is developed using React and TypeScript. The application includes functionalities such as chart visualization, Total Daily Energy Expenditure (TDEE) calculations, and more.

## Project Structure
- **Backend**: Laravel framework with PHPNative for specific features.
- **Frontend**: React with TypeScript.
- **Database**: MySQL (or other supported databases).
- **Build Tool**: Vite.
- **Testing**: PHPUnit for backend testing; Jest and React Testing Library for frontend testing.

## Prerequisites
- PHP >= 8.4
- Composer
- Node.js >= 22
- npm
- MySQL (or another supported database)
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
Update the `.env` file with your database credentials and other necessary configurations.

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

### 8. Install NativePHP Runtime
```bash
composer require nativephp/electron
```

### 9. Run NativePHP Installer
```bash
php artisan native:install
```

### 10. Start the Development Server
```bash
php artisan native:serve
```

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute the software, provided proper attribution is given to the original authors. For more details, refer to the LICENSE file included in the repository.

### Important Notes
The application utilizes a food dataset for nutritional information, located at `database/seeders/data/foods_data.csv`. Due to limitations with the seeder functionality, the dataset must be imported manually. Follow these steps:
1. Open the application.
2. Navigate to `Tools > Import Dataset` (shortcut: Ctrl + I) and select the file `database/seeders/data/foods_data.csv`.

### Acknowledgments
This project was developed for research purposes, exploring the capabilities of PHPNative. Special thanks to V0.dev, DeepSeek, ChatGPT, and GitHub Copilot for their support in completing this project.
