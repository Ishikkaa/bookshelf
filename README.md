# BookShelf Application

📚 **BookShelf** is a modern online library app for browsing, searching, managing, and preparing books for purchase. It features **AI-powered semantic search**, **admin panel**, and responsive UI built with React + Redux Toolkit and Spring Boot.

## ✨ Key Features
- AI-powered semantic search using embeddings, keyword matching, genre boosting, and relevance ranking
- Admin panel for CRUD on books/users, image uploads, and genre management
- Pagination, sorting, filtering for smooth browsing (« Prev … 4 5 6 … Next »)
- AI-based book recommendations
- JWT authentication & role-based authorization (USER/ADMIN)
- Responsive design with React-Bootstrap

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Redux Toolkit
- React Router v6
- React-Bootstrap
- Axios

**Backend:**
- Spring Boot 3.x
- Spring Data JPA
- Spring Security (JWT)
- MySQL 8
- Maven

**Tools:**
- Git/GitHub
- IntelliJ IDEA / VS Code

## 🚀 Quick Start

### Backend Setup
1. Clone repo:
   ```
   git clone https://github.com/Ishikkaa/bookshelf.git
   cd bookshelf/backend
   ```
2. Configure `application.properties`:
   ```
   ADMIN_PASSWORD=your-admin-password
   auth.token.jwtSecret=your-jwt-secret
   spring.datasource.url=jdbc:mysql://localhost:3306/bookshelf
   spring.datasource.username=root
   spring.datasource.password=your-db-password
   ```
3. Start server:
   ```
   # Unix/Mac: ./mvnw spring-boot:run
   # Windows: mvnw spring-boot:run
   ```
   Backend runs on `http://localhost:9090`

### Frontend Setup
1. `cd ../frontend`
2. `npm install`
3. `npm start`

Frontend runs on `http://localhost:3000`

## 🔍 Semantic Search
- Powered by vector embeddings & cosine similarity
- Ranks by title/genre match + token overlap
- Threshold filtering for relevance

## 👨‍💼 Admin Panel
- Add/Edit/Delete books with image upload
- User management & role assignment
- Genre categorization

## 🔐 Security
- JWT tokens for stateless auth
- BCrypt password encoding
- Role-based access (USER/ADMIN)

## 📁 Project Structure
```
bookshelf/
├── backend/           # Spring Boot API
│   ├── src/main/java/com/ishikapandita/bookshelf/
│   ├── application.properties
│   └── pom.xml
└── frontend/          # React + Redux app
    ├── src/
    ├── public/
    └── package.json
```

## 🧪 Testing
```bash
# Backend
./mvnw test

# Frontend
npm test
```

## Usage
1. Browse books on homepage
2. Search via keyword or natural language
3. Admin: Login → Manage books/users

## Author
**Ishika Inder Pandita**  
Software Developer  
[LinkedIn](https://www.linkedin.com/in/ishika-pandita-2b60b5171)  
[GitHub](https://github.com/Ishikkaa)
