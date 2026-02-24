# 🌍 IMPACT LINK  
## NGO & Volunteer Activity Management Platform  

Impact Link is a full-stack web application designed to connect NGOs and Volunteers through a structured activity management system.

The platform enables NGOs to create and manage social activities, while volunteers can explore opportunities, request participation, and receive notifications and email updates.

This project follows an ER-diagram-based relational structure implemented using MongoDB references.

---

# 📌 Project Objective

Many NGOs struggle with:

- Managing volunteer participation manually  
- Tracking activity requests  
- Communicating acceptance or rejection decisions  
- Maintaining structured activity records  

Impact Link provides:

- Centralized activity creation and management  
- Structured request tracking  
- Automated email notifications  
- Role-based dashboards  
- ER-aligned database architecture  

---

# 🏗 System Architecture

```
Frontend (HTML, CSS, JS)
        ↓
Express.js REST API
        ↓
MongoDB (Mongoose ODM)
```

The system follows a Model–View–Controller inspired structure:

- Models → MongoDB schema definitions  
- Routes → API logic  
- Frontend → UI + API consumption  

---

# 📁 Project Structure

```
IMPACT LINK/
│
├── backend/
│   ├── models/
│   │     NGO.js
│   │     Volunteer.js
│   │     Activity.js
│   │     ActivityRequest.js
│   │     Notification.js
│   │     VolunteerNotificationDetails.js
│   │
│   ├── routes/
│   │     auth.js
│   │     activityRoutes.js
│   │     notificationRoutes.js
│   │
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── css/
│   ├── js/
│   │     ngo-dashboard.js
│   │     volunteer-dashboard.js
│   ├── ngo-dashboard.html
│   ├── volunteer-dashboard.html
│   ├── login.html
│   ├── signup.html
│   └── index.html
```

---

# 🗃 Database Collections

The system uses the following MongoDB collections:

```
ngos
volunteers
activities
activityrequests
notifications
volunteernotificationdetails
```
---
# 📘 Collection Structure

## 1️⃣ NGOs

```js
{
  ngoName,
  headName,
  establishmentDate,
  email,
  username,
  password (hashed)
}
```
---
## 2️⃣ Volunteers
```js
{
  name,
  age,
  email,
  username,
  password (hashed)
}
```
---
## 3️⃣ Activities
```js
{
  ngoId,
  title,
  description,
  location,
  date
}
```
---
## 4️⃣ ActivityRequests
Bridge between Volunteer and Activity.

```js
{
  activityId,
  volunteerId,
  status: "pending" | "accepted" | "rejected"
}
```
---
## 5️⃣ Notifications
Stores notification messages.
```js
{
  activityId,
  volunteerId,
  ngoId,
  type,
  message
}
```
---
## 6️⃣ VolunteerNotificationDetails
Bridge between Volunteer and Notification.
```js
{
  volunteerId,
  notificationId,
  read: false,
  createdAt
}
```
---

# 🔐 Authentication System

- Password hashing using bcryptjs  
- Separate login for NGO and Volunteer  
- Role-based dashboard access  
- LocalStorage session management  

---

# 🏢 NGO Workflow

1. NGO registers  
2. NGO logs in  
3. NGO creates activity  
4. Volunteers send requests  
5. NGO accepts/rejects  

When NGO accepts or rejects:

- ActivityRequest status updated  
- Notification created  
- VolunteerNotificationDetails created  
- Email sent to volunteer  

---

# 🙋 Volunteer Workflow

1. Volunteer registers  
2. Volunteer logs in  
3. Browse available activities  
4. Send join request  
5. View request status  
6. Receive dashboard notification  
7. Receive email update  

---

# 📡 API Endpoints

## 🔐 Authentication

```
POST /api/auth/ngo/signup
POST /api/auth/ngo/login
POST /api/auth/volunteer/signup
POST /api/auth/volunteer/login
```

---

## 🏢 Activities

```
POST   /api/activities/create
GET    /api/activities/
POST   /api/activities/request
GET    /api/activities/requests/:ngoId
GET    /api/activities/volunteer-requests/:volunteerId
PUT    /api/activities/update/:id
```

---

## 🔔 Notifications

```
GET /api/notifications/ngo/:ngoId
GET /api/notifications/volunteer/:volunteerId
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd impact-link
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Create .env File (Inside backend)

```
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

⚠ Use Gmail App Password.

---

## 4️⃣ Start Backend Server

```bash
node server.js
```

Server runs at:

```
http://localhost:5000
```

---

## 5️⃣ Run Frontend

Option 1: Open `frontend/login.html` directly.

Option 2:

```bash
cd frontend
npx http-server -p 8000
```

Visit:

```
http://localhost:8000
```

---

# 🎯 Features Implemented

### Backend
- Express.js REST API
- MongoDB with Mongoose
- ER-based modeling
- Email integration (Nodemailer)
- Structured notification system

### Frontend
- Separate NGO & Volunteer dashboards
- Dynamic activity loading
- Request management
- Notification display
- Role-based redirection

### Integration
- RESTful API communication
- Session handling via LocalStorage
- Real-time request status updates

---

# 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env

### Email Not Sending
- Verify Gmail App Password
- Check EMAIL_USER and EMAIL_PASS

### 500 Internal Server Error
- Check backend terminal logs
- Restart server

### Notifications Not Showing
- Ensure VolunteerNotificationDetails collection exists
- Restart backend after updates

---

# 🚀 Future Enhancements

- JWT Authentication
- Role-based middleware
- Real-time notifications (Socket.io)
- Mark notifications as read
- Activity capacity control
- Search & filtering
- Cloud deployment (Render / Railway / Vercel)

---


# 📄 License

This project is developed for academic and educational purposes.
