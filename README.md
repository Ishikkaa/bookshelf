📚 BookShelf 

A full-stack application with a backend-centric architecture, designed to deliver low-latency, scalable, and reliable user experiences using caching, asynchronous messaging, and hybrid search. Designed with production-oriented principles including scalability, fault tolerance, and performance optimization.
---

# 🧠 Architecture Overview

BookShelf is designed as a scalable backend system with clear separation of concerns and asynchronous processing for improved performance and reliability.

### System Components:
- **API Layer (Spring Boot)** – Handles client requests and business logic
- **Database (MySQL)** – Stores book, user, and order data
- **Cache Layer (Redis)** – Reduces database load and improves read latency
- **Message Queue (RabbitMQ)** – Enables asynchronous processing for non-blocking workflows

### High-Level Flow:
Client
  ↓
Spring Boot API
  ↓
MySQL (DB)
  ↓
Outbox Table
  ↓
Outbox Worker
  ↓
RabbitMQ
  ↓
Consumer
  ↓
Email Service

Reads:
Client → API → Redis → MySQL (fallback)

This architecture ensures low latency for user-facing APIs while handling slow operations asynchronously. 
Designed to handle increasing load by scaling read-heavy operations via caching and decoupling write/side-effect workflows using asynchronous messaging.
---

# ⚙️ Key Engineering Decisions

### 1. Asynchronous Processing with RabbitMQ
Implemented an event-driven email notification pipeline using RabbitMQ with reliability mechanisms to ensure message delivery and fault tolerance.

**Design:**
- Events are published using an Outbox Pattern to prevent message loss during database transactions or broker downtime
- A main queue (bookQueue) processes events and triggers email sending via a consumer
- A retry queue with TTL handles transient failures by delaying and reprocessing messages
- A Dead Letter Queue (DLQ) captures messages that exceed retry limits or fail permanently
- Retry limits are enforced using RabbitMQ’s x-death header, preventing infinite retry loops

**Why:**
- Prevents API latency increase due to slow external services
- Improves system reliability with retries and dead-letter queues
- Decouples core application logic from notification workflows

**Trade-off:**
- Increased system complexity due to asynchronous workflows and eventual consistency

<img width="1468" height="534" alt="Screenshot 2026-04-06 at 1 49 29 PM" src="https://github.com/user-attachments/assets/e3a7670e-7abe-48fd-ac90-9ae9aa659520" />

<img width="1452" height="536" alt="Screenshot 2026-04-06 at 1 58 37 PM" src="https://github.com/user-attachments/assets/06e837d9-7a0a-4ec5-b1c5-67e4f29ce5ee" />

<img width="1459" height="576" alt="Screenshot 2026-04-06 at 1 59 25 PM" src="https://github.com/user-attachments/assets/337f0be7-5446-438f-8a7a-b6fb81aff190" />

---

### 2. Redis Caching Strategy
Frequently accessed book data is cached in Redis.

**Impact:** Validated API performance under concurrent load (50 users, 500 requests)
- Reduced average latency from ~88ms to ~14ms (~84% improvement) using Redis caching  
- Increased throughput from ~568 req/sec to ~3560 req/sec (~6.2× improvement)
- Eliminated tail latency spikes (max latency reduced from 605ms → 36ms)

**Trade-off:**
- Accepts eventual consistency between cache and database

---

### 3. Hybrid Search Design
Search combines:
- semantic similarity (vector embeddings)
- keyword matching

**Why:**
- Enables intent-based discovery
- Maintains accuracy for exact matches

---

### 4. Outbox + Reliability Patterns
Implemented the outbox pattern to ensure reliable event publishing in coordination with database transactions.

**Why:**
- Prevents event loss during partial failures
- Ensures consistency between database state and emitted events
- Improves reliability of asynchronous workflows
  
---

# 🚀 Performance & Reliability

- Redis caching reduces database load and improves response times for frequently accessed book data
- Asynchronous processing using RabbitMQ prevents blocking API requests for email notifications
- Designed APIs with pagination and filtering to handle larger datasets efficiently
- Structured backend with clear separation of concerns for maintainability and scalability

The system is designed to remain responsive by offloading non-critical operations to background consumers and minimizing unnecessary database access.

---

# 🛡️ Fault Tolerance

- Dead Letter Queues (DLQ) for failed message handling
- Retry mechanisms for transient failures
- Input validation and null-safety at API boundaries
- Decoupled services to avoid cascading failures

These patterns ensure the system remains stable even when individual components fail.

---

# 📦 Product Features

### Smart Search

* **Hybrid Search:** Combines vector embeddings (semantic similarity) with keyword matching
* **Genre-Aware Ranking:** Results boosted using book genre and metadata
* **Dynamic Filtering:** Filter books by genre and browse results with pagination

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

In a production environment, this system would be extended with cloud-based media storage, payment integration, rate limiting, observability (metrics, logging, tracing), and automated scaling strategies.

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
