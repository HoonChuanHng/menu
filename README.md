# Online Food Ordering System (Quick Plate Cafe)
A system inspired by real-world restaurant operations that supports QR table access, online ordering, kitchen order processing, waiter workflows, and admin analytics.

---

## Live Demo (No Installation Required)
### Customer (Table Link):
* https://online-ordering-system-3il6.onrender.com/?table=1
* https://online-ordering-system-3il6.onrender.com/?table=2
* https://online-ordering-system-3il6.onrender.com/?table=3
* https://online-ordering-system-3il6.onrender.com/?table=4
* https://online-ordering-system-3il6.onrender.com/?table=5

### Customer (QR Code):
* https://online-ordering-system-3il6.onrender.com/external/QR/table1.png
* https://online-ordering-system-3il6.onrender.com/external/QR/table2.png
* https://online-ordering-system-3il6.onrender.com/external/QR/table3.png
* https://online-ordering-system-3il6.onrender.com/external/QR/table4.png
* https://online-ordering-system-3il6.onrender.com/external/QR/table5.png

### Login Page:
* https://online-ordering-system-3il6.onrender.com/login

### Admin Dashboard:
* https://online-ordering-system-3il6.onrender.com/admin

### Waiter Dashboard:
* https://online-ordering-system-3il6.onrender.com/waiter

### Kitchen Dashboard:
* https://online-ordering-system-3il6.onrender.com/kitchen

## Demo Access

| Role   | Username | Password |
|--------|--------  |----------|
| Admin  | a1       | 123      |
| Waiter | w1       | 123      |
| Kitchen| k1       | 123      |

--- 

## What This System Does

### Customer Side

Customers can access the system by scanning a QR code or opening a table-specific link (Table 1–5).

#### Features

* View a digital menu with categorized food items
* Browse menu items using a category-based navigation bar
* Add items to cart
* Adjust item quantities
* Add remarks to food items
* Automatic total price calculation
- Submit orders linked to the corresponding table number
* Search for food items
* Track order status
* Call a waiter directly from the system (notification sent to waiter system)
* Install the system as an application (PWA support)
* No customer login required

### Login Page

The system includes role-based authentication for staff access.

#### Features

* Login support for Waiter, Kitchen, and Admin roles
* Password-based authentication
* Automatic session expiration after 8 hours
* Protected routes (e.g., /admin, /waiter, and /kitchen require authentication)
* Supports login submission using the Enter key

### Admin Side

Administrators manage sales analytics, orders, food items, and user accounts.

#### Sales Statistics Visualization

* View total revenue
* View sales charts, including Best Sellers, All Food Sold, and Daily Sales

#### Order Management

* View complete order information, including table number, order ID, order time, ready time, completion time, status, remarks, total price, and ordered items
* Delete orders when necessary (deleted orders are removed from the database)
* Sort orders by order ID, date, total price, table, and status

#### Food Management

* Add new food items with name, price, category, and upload image from device.
* Newly added food items are displayed on the customer page.
* Edit food details, including name, price, image, and category
* Delete existing food items
* Sort food items by name (A–Z, Z–A), category (A–Z), and price (low to high, high to low)

#### User Management

* Create new staff accounts with a username, password, and assigned role
* Newly created staff can log in using their assigned credentials
* Remove user accounts when staff leave the organization

### Kitchen Side

Kitchen staff manage order preparation and menu availability.

#### New Order Notification

* Receive a notification sound when a customer places an order; the order is automatically marked as **New**
* A red dot on the notification bell indicates unread **New** order notifications
* Clicking the notification bell displays orders marked as **New** and clears the unread indicator

#### Order Preparation

* View customer orders
* Update order status to **Preparing** while food is being prepared
* Mark orders as **Ready** once preparation is complete
* Orders marked as **Ready** are automatically hidden from the kitchen view

#### Menu Availability

* Mark food items as **Out of Sales** or **Restocked**
* Food items marked as **Out of Sales** are shown as **SOLD OUT** on customer page and cannot be ordered
* Sort food items by name (A–Z, Z–A), category (A–Z), available first, and price (low to high, high to low)

### Waiter Side

Waiters manage customer requests, order delivery, and table checkout.

#### Customer Call Notification

* Receive notification messages, sound alerts, and table information when customers request waiter assistance on customer page

#### Ready Order Notification

* Receive a separate notification sound when the kitchen marks an order as **Ready**
* A red dot on the notification bell indicates unread **Ready** order notifications
* Clicking the notification bell displays orders marked as **Ready** and clears the unread indicator

#### Order Delivery

* View orders marked as **Ready** by the kitchen
* Update order status to **Serving** while delivering food to the customer
* Mark orders as **Done** after delivery is completed
* Orders marked as **Done** are automatically hidden from the waiter view

#### Checkout & Receipt Management

* Process table checkout for orders marked as **Done**
* Checkout clears the active session for the selected table while preserving historical records in the database
* Open receipt in a new browser tab (PDF view) and allow downloading

### Other Features
* QR-based table system (Table 1–5)
* Production-style URL routing
* Real-time data updates across system
* Persistent cart (retains data after refresh)
* MongoDB database integration
* Responsive design
* Dark mode toggle
* Auto-incremented persistent order IDs
* Click image to open in modal view

---

## System Workflow
1. Customer scans QR / opens table link
2. Customer browses menu & adds items to cart
3. Customer add remarks and adjust food quantity (optional)
4. Customer places order
5. Kitchen receives placed order and prepares order
6. Waiter receives prepared order delivers order
7. Waiter processes checkout for the specific table after food is delivered
8. The table is marked as paid and session cleared
9. Admin monitors orders, revenue, and analytics

---

## Database

MongoDB Atlas cloud database that stores:

### Orders
* Order ID
* Table Number
* Food Items
* Status
* Remarks
* Ordered At (Time)
* Total Price
* Payment Status (Paid / Not paid)
* Ready At (Time)
* Done At (Time)

### Call Waiter
* Call At (Time)
* Message Seen / Not Seen

### Food
* Food Name
* Price
* Image
* Category
* Sold Out / Not Sold Out

### User
* Username
* Password (Hashed)
* Role (Admin / Waiter / Kitchen)
* Created At (Time)

---

## Tech Stack

### Frontend
* HTML
* CSS
* JavaScript 
* Chart.js 

### Backend
* Node.js
* Express.js

### Database
* MongoDB
* Mongoose (ODM)
* bcrypt (Password Hashing)

### File Handling & Export
* Multer (file uploads)
* PDFKit (PDF generation)

### Real-time Features
* WebSocket (ws)

### Environment Variable
* dotenv 

---

## Installation / Setup
### Prerequisites
* Node.js (v18 or above)
* npm (comes with Node.js)
* MongoDB Atlas account (or local MongoDB server)
* Git (optional, for cloning repo)

### Install Steps
```bash
git clone <your-repo-url>
cd online-ordering-system
npm install
```

### Environment Setup
Create a .env file in the root folder:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### Run the Project
```bash
node server.js
```

### Open in browser
```bash
http://localhost:3000/login
```

### Notes
* Make sure MongoDB Atlas IP access is enabled (allow all IPs 0.0.0.0/0 for development)
* If .env is missing or wrong, server will fail to connect to database
* Ensure .env and node_modules are excluded using .gitignore

---

## Project Structure

## Project Structure

```
online-ordering-system/
├── public/
│   ├── admin.html
│   ├── kitchen.html
│   ├── waiter.html
│   ├── login.html
│   ├── index.html
│   ├── style.css
│   ├── manifest.json
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── kitchen.js
│   │   ├── waiter.js
│   │   └── login.js
│   │
│   ├── external/
│   │   ├── uploads/
│   │   ├── image/
│   │   ├── QR/
│   │   └── sound/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```


online-ordering-system/
│
├── public/
│   ├── admin.html
│   ├── kitchen.html
│   ├── waiter.html
│   ├── login.html
│   ├── index.html
│   │
│   ├── style.css
│   │
│   ├── manifest.json
│   │
│   ├── js/
│   │   ├── admin.js
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── kitchen.js
│   │   ├── waiter.js
│   │   └── login.js
│   │
│   ├── external/
│   │   ├── uploads/
│   │   ├── image/
│   │   ├── QR/
│   │   └── sound/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md

---

## API / Backend Endpoints
### Authentication
* POST /api/login → login

### User Management
* GET /api/admin/users → Get all users
* POST /api/admin/users → Create user
* DELETE /api/admin/users/:id → Delete user

### Food 
* GET /api/menu → Get all food items
* POST /api/food → Add new food item 
* PUT /api/food/:id → Update food item
* DELETE /api/food/:id → Delete food item
* PUT /api/food/:id/soldout → Toggle sold out status

### Orders
* POST /api/order → Create new order
* GET /api/orders → Get all orders
* GET /api/order/:tableId → Get orders by table
* GET /api/order/:tableId/track → Track active orders (not paid)
* DELETE /api/order/:orderNumber → Delete order
* POST /api/status → Update order status 
* POST /api/checkout/:tableId → Mark table orders as paid

### Admin Dashboard
* GET /api/admin → Analytics

### Kitchen
* GET /api/kitchen → Get active kitchen orders (NEW, PREPARING)

### Waiter
* GET /api/waiter/orders → Orders ready to serve
* GET /api/waiter/billing → Orders ready for billing

### Waiter Call System
* POST /api/call-waiter → Customer calls waiter
* GET /api/call-waiter → Get unread calls
* POST /api/call-waiter/seen → Mark call as seen

### File Upload
* POST /api/upload → Upload food image 

---

## Future Improvements
* Payment integration
* Performance optimization
* Scalability improvements for high traffic and concurrent users
* Two-factor authentication
* Automated email verification system
