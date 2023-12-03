# Vehicle Maintenance Workshop App

A Node.js application for managing a vehicle maintenance workshop. The app
provides functionality for handling vehicle repairs, inventory management, and
performance metrics. It supports three user roles: customer, admin/workshop
staff, and super admin/owner.

## Features

- **Customer:**

  - View repair history
  - ...

- **Admin/Workshop Staff:**

  - Enter records of vehicle repairs
  - Manage inventory
  - ...

- **Super Admin/Owner:**

  - Assign admin roles
  - Access financial and workshop performance metrics
  - ...

- **Other features can be found in the product requirements document**

## Technologies Used (Backend)

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Swagger for API documentation
- Winston and Morgan for logging
- Joi for validation
  > (Full list of tools can be found in package.json file)

## Getting Started

1. Clone the repository:

   ```bash
    git clone https://github.com/CeeJayyy007/auto-app-backend.git
   ```

2. Install dependencies

   ```bash
   cd auto-app-backend
   npm install
   ```

3. Set Environment Variables

   ```bash
   cp .example .env
   ```

4. Set up the PostgreSQL database:

   - Create a database named `auto_app_db` in PostgreSQL
   - Update the database credentials in the `.env` file

5. Run database migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

6. Then you can start the application:

```bash
  npm run dev
```

## or with Docker

```bash
  docker-compose -f docker-compose.dev.yml up --build
```

## Testing

```bash
  npm test
```

## Logging

    - Logs are stored in the logs folder
    - The error logs are rotated daily and stored for 14 days
    - Winston and Morgan are used for logging

## API Documentation

    - API documentation is available at http://localhost:3000/api-docs

## License

    - MIT
