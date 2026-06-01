# Online Food Ordering System (Quick Plate Cafe)

A system inspired by real-world restaurant systems that support online ordering, QR table access, kitchen management, and admin analytics.

## Installation & Setup
### 1. Install Node.js
Install Node.js from:
https://nodejs.org/


### 2. Open Terminal 
Run the commands:
```bash
git clone <your-repo-url>
cd online-ordering-system
npm install
node server.js
```

### 3. Open Browser
Go to:
http://localhost:3000

## 🌐 Live Demo (No Installation Required)

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

## System Workflow

```bash
Customer scans QR / opens table link
        ↓
Browse menu & add items to cart
        ↓
POST /api/order (order sent to backend)
        ↓
MongoDB stores order permanently
        ↓
Kitchen dashboard processes order
        ↓
Order status updated (/api/status)
        ↓
Admin monitors revenue + analytics
        ↓
Checkout marks table as paid
```
## Database

MongoDB Atlas cloud database that stores:
- Order Number
- Table ID
- Items
- Status
- Time
- Payment Status

## Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
HTML / CSS / JavaScript
Chart.js 



## API Endpoints

### Menu
```bash
GET /api/menu
```
Returns all food categories and items.

### Orders
```bash
GET /api/orders
POST /api/order
DELETE /api/order/:orderNumber
```

### Status Update
```bash
POST /api/status
```

### Checkout Table
```bash
POST /api/checkout/:tableId
```

Marks all orders from a table as paid.

### Admin Analytics
```bash
GET /api/admin
```

Returns:

total revenue
table totals
food sold count
all orders

## Features
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




## Notes
Backend is REST API based
Frontend is static served via Express
Data is stored permanently in MongoDB
Designed for real-world restaurant workflow simulation
