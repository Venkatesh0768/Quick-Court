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
