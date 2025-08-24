# Bookmark Manager

A full-stack bookmark management application designed to help you save, organize, and quickly access your favorite websites. This application features a modern, user-friendly interface and a robust backend to handle your bookmarking needs.

## Tech Stack

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool and development server for modern web projects.
- **CSS:** Used for styling the application.

### Backend

- **Node.js:** A JavaScript runtime environment for building server-side applications.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **SQLite:** A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.

### Containerization

- **Docker:** A platform for developing, shipping, and running applications in containers.
- **Nginx:** A high-performance web server, reverse proxy, and load balancer.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your machine.

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/FabHaguma/bookmark-manager.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd bookmark-manager
    ```
3.  **Build and run the application using Docker Compose:**
    ```sh
    docker-compose up --build
    ```
    The application will be available at `https://links.haguma.com`.

## Features

- **Add Bookmarks:** Easily add new bookmarks by providing a URL.
- **Automatic Title Fetching:** The application automatically fetches the title of the web page when you add a new bookmark.
- **View All Bookmarks:** See a list of all your saved bookmarks.
- **Search Functionality:** Quickly find bookmarks using the search bar.
- **Categorization:** Organize bookmarks into categories for better management (inferred from `CategorySection.jsx`).

## API Endpoints

The backend server exposes the following RESTful API endpoints:

- `GET /api/bookmarks`: Retrieve all bookmarks.
- `POST /api/bookmarks`: Add a new bookmark.
- `DELETE /api/bookmarks/:id`: Delete a specific bookmark.

## License

Distributed under the MIT License. See `LICENSE` for more information.
