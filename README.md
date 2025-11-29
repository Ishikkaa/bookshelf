# 📚 Bookshelf – AI-Powered Bookstore Application

Bookshelf is a full-stack web application designed for book discovery, shopping, and personalized recommendations.  
The project showcases strong backend architecture, clean frontend design, and AI-driven search/recommendation features.

---

## 🚀 Features

### 🔹 Core Features
- User authentication (JWT-based)
- Browse & search books by title, author, ISBN, or genre
- Cart + Order placement with inventory tracking
- Admin panel to manage books & genres

### 🤖 AI-Powered Features
- **Semantic search** – find books using natural language queries  
- **AI book description generator**  
- **Smart recommendations** based on user history  

---

## 🏛️ Tech Stack

### 🖥 Backend (Spring Boot)
- Java 17+
- Spring Web, Spring Security, JWT
- Spring Data JPA + Hibernate
- MySQL / PostgreSQL
- ModelMapper
- Lombok

### 💻 Frontend (React)
- React + Vite / CRA
- Redux Toolkit for state management
- Bootstrap / Custom UI
- Axios

---

## 📁 Project Structure
root/
├── backend/
│ ├── src/main/java/com.bookshelf
│ └── pom.xml
├── frontend/
│ ├── src/
│ └── package.json
├── README.md
└── .gitignore


---

## ⚙️ Setup Instructions

### 🖥 Backend


cd backend
mvn clean install
mvn spring-boot:run


### 💻 Frontend


cd frontend
npm install
npm run dev


---

## 🌐 API Documentation (Example)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/auth/login` | User login |
| POST | `/api/order/place` | Place order |

---

## 📸 Screenshots (Optional)
_Add UI screenshots here later._

---

## 📌 Roadmap
- [ ] Fully polished UI  
- [ ] Voice-based semantic search  
- [ ] On-platform AI chat helper  
- [ ] Book preview reader mode  

---

## 🧑‍💻 Author
**Ishika Pandita**  
📧 ishikapandita8@gmail.com  
🔗 [LinkedIn](YOUR-LINK-HERE)

---

## 📜 License
This project is under the MIT License.

