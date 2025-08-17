# QuickCourt 🏀⚡

A full-stack sports facility booking system with **Spring Boot (Gradle) backend** and **React frontend**.

## 🌟 Features
- User authentication (JWT)
- Facility/court management
- Booking system with time slots
- Payment integration
- Review system
- Admin dashboard

## 🛠 Tech Stack

### Backend
| Technology       | Purpose                          |
|------------------|----------------------------------|
| Java 17+         | Core language                    |
| Spring Boot 3+   | Framework                        |
| Gradle           | Build tool                       |
| Spring Security  | Authentication & Authorization   |
| Spring Data JPA  | Database operations              |
| PostgreSQL/MySQL | Database                         |
| Lombok           | Boilerplate reduction           |
| MapStruct        | DTO mapping                     |

### Frontend
| Technology        | Purpose                          |
|-------------------|----------------------------------|
| React 18+         | UI Framework                     |
| Vite              | Build tool                       |
| TailwindCSS       | Styling                          |
| Redux Toolkit     | State management                 |
| React Hook Form   | Form handling                    |
| Axios             | HTTP requests                    |
| React Router      | Navigation                       |

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL/MySQL
- Gradle 7+

### Backend Setup
1. Configure database in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quickcourt
spring.datasource.username=your_username
spring.datasource.password=your_password
```

cd backend
./gradlew bootRun


cd frontend
npm install
npm run dev


```
# Build and start containers in the background
docker compose up -d

# See real-time logs from all services
docker compose logs -f

# Stop and remove containers, networks, and volumes
docker compose down

#Restart the application
docker compose down
docker compose up -d

🧹 Cleanup
Remove all unused containers, networks, images, and caches:
docker system prune -a

```


```Frontend .env
VITE_API_URL=http://localhost:8080/api/v1
```

```Backend.env
ADMIN_PASSWORD=adminpassword;
ADMIN_USER=admin;
DB_PASSWORD=password;
DB_USERNAME= database username;
JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters_long;
MAIL_PASSWORD=password;
MAIL_USERNAME=your_email@gmail.com
```


```Root Folder for Docker .env
# Database Configuration
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=nameDB
MYSQL_USER=username
MYSQL_PASSWORD=StrongPassword

# Backend Configuration
ADMIN_USER=admin
ADMIN_PASSWORD=adminpassword
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=appassword
JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters_long

# Ports (optional - for easy changes)
BACKEND_PORT=8080
FRONTEND_PORT=80
MYSQL_PORT=3307
```



<img width="1892" height="935" alt="Screenshot 2025-08-16 210506" src="https://github.com/user-attachments/assets/66edf6ce-ea08-4b4d-ab07-49de64664769" />

<img width="1918" height="936" alt="Screenshot 2025-08-16 210519" src="https://github.com/user-attachments/assets/9ace9c49-d71d-4ba5-87cf-19a1e97fd41d" />

<img width="1906" height="932" alt="Screenshot 2025-08-16 210529" src="https://github.com/user-attachments/assets/6a6fc787-32b7-4337-a46b-442f7f042079" />

<img width="1335" height="944" alt="Screenshot 2025-08-16 210539" src="https://github.com/user-attachments/assets/6e75bfbe-f25e-4b6c-bffc-d11ebe27315d" />

<img width="1375" height="911" alt="Screenshot 2025-08-16 210552" src="https://github.com/user-attachments/assets/f4deb73d-4475-4e81-8422-84de7b2b1bac" />

<img width="1915" height="946" alt="Screenshot 2025-08-16 210603" src="https://github.com/user-attachments/assets/406bc01f-d182-439a-879c-6aa38cebf6db" />


