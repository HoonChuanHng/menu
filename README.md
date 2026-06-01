# Online Food Ordering System (Quick Plate Cafe)
A system inspired by real-world restaurant systems that support online ordering, QR table access, kitchen management, and admin analytics.

---
## Live Demo (No Installation Required)
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
## What This System Does
Customer Side
- Customers scan a QR code or open a table link (table 1–5)
- They browse a digital menu
- They add items to a cart with quantity and price calculated automatically
- They submit an order to the system

Kitchen Side
- Kitchen staff view all orders in real time
- Orders are displayed with table id, order number, time ordered, and food items
- They can change status (Preparing / Done)

Admin Side
- Admin can view total revenue
- They can view payment for each table and checkout
- View all orders details (table id, order number, time ordered, and food items)
- Track food sold 

Backend System
- Orders are stored permanently in MongoDB Atlas
- Each order has a unique Order ID
- Status updates are saved real time

Other Features
- QR table system (table=1 to table=5)
- Real production-style URL routing
- Real-time order processing workflow
- Cart persists on refresh (no reset)
- Database (MongoDB)
- Cross-device support (phone + laptop)
- Installable web app (PWA ready concept)
- Dark mode toggle button
- Data visualization using charts

---
## System Workflow
1. Customer scans QR / opens table link
2. Browse menu & add items to cart
3. POST /api/order (order sent to backend)
4. MongoDB stores order permanently
5. Kitchen dashboard processes order
6. Order status updated (/api/status)
7. Admin monitors revenue + analytics
8. Checkout marks table as paid

---
## Database
MongoDB Atlas cloud database that stores:
- Order Number
- Table ID
- Items
- Status
- Time
- Payment Status

---
## Tech Stack
- Node.js
- Express.js
- MongoDB 
- HTML 
- CSS 
- JavaScript
- Chart.js 

---
