# 📚 BookShelf - AI-Powered Online Bookstore

A full-stack online library application featuring **hybrid semantic search**, an **admin management panel**, and **role-based authentication**. Built with **React, Spring Boot, and MySQL**.

---

# ✨ Key Features

### Smart Search

* **Hybrid Search:** Combines vector embeddings (semantic similarity) with keyword matching
* **Genre-Aware Ranking:** Results boosted using book genre and metadata
* **Dynamic Filtering:** Filter books by genre and browse results with pagination

### Performance & Reliability

* **Redis Caching:** Reduced average API latency by 73% for book retrieval endpoints and eliminated redundant DB queries on cache hits.
* **RabbitMQ Async Messaging:** Decoupled email notifications from the main API using durable queues and dead-letter queues for fault-tolerant, reliable message delivery.

### User Features 

* Browse books with pagination, sorting, and filtering
* Shopping cart and **demo checkout flow**
* Address management for orders
* JWT-based authentication with secure password hashing

### Admin Panel (Protected)

* Full CRUD operations on books and genres
* Image upload for book covers
* Role-based access control
* Admin endpoints protected via JWT validation

---

# 🛠️ Tech Stack

### Frontend

* React
* Redux Toolkit (state management)
* React Router
* React Bootstrap
* Axios

### Backend

* Spring Boot
* Spring Data JPA
* MySQL
* Spring Security + JWT authentication
* BCrypt password hashing
* Redis
* RabbitMQ

### Search System

* Sentence-transformer embeddings for semantic similarity
* Cosine similarity scoring
* Hybrid ranking combining semantic similarity and keyword matching

---

# 🔍 How the Hybrid Search Works

The search engine combines **semantic similarity and lexical matching**:

### 1. Semantic Similarity

User queries and book descriptions are converted into **vector embeddings** using sentence-transformer models.
Similarity between vectors is computed using **cosine similarity**, allowing intent-based discovery.

Example:

```
Query: "books about overcoming adversity"
```

Returns books about **resilience and personal growth**, even without exact keyword matches.

### 2. Keyword Matching

Traditional keyword matching ensures **exact title or author searches still work reliably**.

### 3. Hybrid Ranking

Results are ranked using a weighted combination of:

* semantic similarity
* keyword relevance
* genre metadata

This approach balances **intent-based discovery and exact search accuracy**.

---

# 🏗️ Local Setup

## Prerequisites

* Java 17+
* Node.js 16+
* MySQL 8

---

## Backend Setup

```bash
git clone https://github.com/Ishikkaa/bookshelf.git
cd bookshelf/backend
```

Configure `application.properties`

```
ADMIN_PASSWORD=your-admin-password
auth.token.jwtSecret=your-jwt-secret-key
spring.datasource.url=jdbc:mysql://localhost:3306/bookshelf
spring.datasource.username=root
spring.datasource.password=your-db-password
```

Run backend:

```bash
./mvnw spring-boot:run
```

Backend runs on:

```
http://localhost:9090
```

---

## Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# 📁 Project Structure

```
bookshelf
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   └── security
│
└── frontend
    ├── components
    ├── store
    ├── assets
    └── App.js
```

---

# 🔐 Security

* JWT authentication (stateless sessions)
* BCrypt password hashing
* Role-based authorization (USER / ADMIN)
* Protected admin endpoints

---

# 🎯 API Overview

### Public APIs

```
POST /api/auth/signup
POST /api/auth/login
GET /api/books
GET /api/books/search
```

### User APIs

```
POST /api/cart
GET /api/orders
PUT /api/users/address
```

### Admin APIs

```
POST /api/admin/books
PUT /api/admin/books/{id}
DELETE /api/admin/books/{id}
POST /api/admin/genres
```

---

# 🚧 Known Limitations

This project is designed as a portfolio demo.

In production I would add: 
cloud image storage,
payment gateway integration,
rate limiting and
monitoring

---

# 👤 Author

**Ishika Inder Pandita**
Software Engineer — Accenture

GitHub:
https://github.com/Ishikkaa

LinkedIn:
https://www.linkedin.com/in/ishikapandita/

---

# 📝 License

MIT License
