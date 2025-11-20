# Voting Using Blockchain

A secure and transparent voting application built with Next.js, Prisma, and Blockchain concepts.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher recommended)
- **npm** (usually comes with Node.js)
- **PostgreSQL** (running locally or a cloud instance)

### 🛠️ Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd "Voting Using Blockchain"
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory of the project. You can use the example below:

    ```env
    # Connect to your PostgreSQL database
    DATABASE_URL="postgresql://username:password@localhost:5432/votingDb?schema=public"
    ```
    *Replace `username`, `password`, and `votingDb` with your actual PostgreSQL credentials.*

4.  **Database Setup**
    Initialize the database schema using Prisma:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

### 🏃‍♂️ Running the Project

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 📂 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/prisma`: Database schema and migrations.
- `/lib`: Utility functions and shared code.
- `/components`: Reusable UI components (if applicable).

### 📜 Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs the linter to check for code issues.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
