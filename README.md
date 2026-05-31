# 🍽️ Online Food Ordering System (Quick Plate Cafe)

A restaurant ordering system featuring QR table access, kitchen dashboard, admin analytics, and MongoDB backend.

---

## 🌐 Live Demo

Customer (QR Table Access):
- https://online-ordering-system-3il6.onrender.com/?table=1
- https://online-ordering-system-3il6.onrender.com/?table=2
- https://online-ordering-system-3il6.onrender.com/?table=3
- https://online-ordering-system-3il6.onrender.com/?table=4
- https://online-ordering-system-3il6.onrender.com/?table=5

Kitchen Dashboard:
- https://online-ordering-system-3il6.onrender.com/kitchen.html

Admin Dashboard:
- https://online-ordering-system-3il6.onrender.com/admin.html

---

## ⚙️ Backend (Node.js)

Run server locally:
```bash
node server.js
```bash

Server runs on:
```bash
http://localhost:3000

##📡 API Endpoints
```bash

###Menu
```bash
GET /api/menu
```bash
Returns all food categories and items.

###Orders
```bash
GET /api/orders
POST /api/order
DELETE /api/order/:orderNumber
```bash

###Status Update
```bash
POST /api/status
```bash

###Checkout Table
```bash
POST /api/checkout/:tableId
```bash

Marks all orders from a table as paid.

###Admin Analytics
```bash
GET /api/admin
```bash

Returns:

total revenue
table totals
food sold count
all orders

###🧠 Features
QR Table System (table=1 to table=5)
Real production-style URL routing
Installable web app (PWA ready concept)
Cart persists on refresh (no reset)
Unique Order ID system (MongoDB counter)
Dark mode toggle
Quantity + price calculation
Admin + Kitchen dashboards
MongoDB cloud storage
Cross-device support (phone + laptop)
QuickPlate branding/logo system
Full navigation system (menu → cart → checkout)
🗄️ Database
MongoDB Atlas
Stores:
Orders
Order items
Table ID
Status
Paid state
Timestamp
🚀 Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
HTML / CSS / JavaScript
Chart.js (Admin analytics)
📱 Usage Flow
User scans QR or opens table link
Select food → add to cart
Submit order
Kitchen updates status
Admin monitors orders + revenue
Cashier uses checkout system per table
🧾 Notes
Backend is REST API based
Frontend is static served via Express
Data is stored permanently in MongoDB
Designed for real-world restaurant workflow simulation
