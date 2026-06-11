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

Admin Dashboard:
- https://online-ordering-system-3il6.onrender.com/admin

Waiter Dashboard:
- https://online-ordering-system-3il6.onrender.com/admin

Kitchen Dashboard:
- https://online-ordering-system-3il6.onrender.com/kitchen

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

Features:
- View a digital menu with categorized food listings
- Navigate food items via category-based navigation bar
- Add items to cart
- Increase or decrease quantity
- Add remark
- Automatic price calculation 
- Submit orders linked to table number
- Search for food items
- Track order status
- Call waiter feature (sends notification to waiter system)
- Installable as an application (PWA support)
- No login required for customers
 
### Login Page
The system includes role-based authentication for staff access.

Features:
- Login system for Waiter / Kitchen / Admin roles
- Password-based authentication
- Session expiration (8 hours)
- Protected routes (e.g., /admin, /waiter, /kitchen require login)
- Supports 'Enter' key submission for login

### Admin Side
Administrators manage analytics, orders, food, and users. 

#### Sales Statistics Visualization
* View total revenue
* View Charts (Best Seller, All Food Sold, and Daily Sales)

#### Order Details 
* View all orders details (table number, order id, ordered at(time), ready at(time), done at(time), status, remarks, total price, food items.)
* Option to delete orders (Deleted record will be removed from database and affect total revenue record and sales stats)
* Sort orders

#### Food Management
* Can add new food item with name, price, upload image and categories, all details are display in customer page real time
* Edit food details (name, price, reupload image and category)
* Option to delete existed food
* Sort Food

#### User Management
* Can add new user account with username, password and role when a new staff is hired
* New staff can use that new created account at login page
* Can delete account when the staff resigns

### Kitchen Side
Kitchen staff manage order preparation and food availability.

#### New Order Notification
* Receive a notification sound when a customer place order, the order is marked as **New** automatically.
* Unread **New** order notifications are indicated by a red dot on the notification bell.
* Clicking the notification bell displays new **New** orders and clears the unread indicator

#### Order Preparing
* View orders placed by customers.
* Update order status to **Preparing** when food is cooking.
* Mark orders as **Ready** after food is cooked. 
* Orders marked as **Ready*** are hidden automatically from kitchen side.

#### Menu Avalability
* Mark food items as Out of Sales / Restocked 
* Items marked as **Out of Sales** will be shown in customer page, disallow place order for that item.
* Sort orders 

### Waiter Side
Waiters manage customer calling, order delivery workflow, and checkout table.

#### Customer Call Waiter Notification

* Receive notification messages, notification sound, and table number when customers call waiter.

#### Ready Order Notification

* Receive a separate notification sound when the kitchen marks an order as **Ready**.
* Unread **Ready** order notifications are indicated by a red dot on the notification bell.
* Clicking the notification bell displays new **Ready** orders and clears the unread indicator.

#### Order Delivering

* View orders marked as **Ready** by the kitchen.
* Update order status to **Serving** when food is delivering to the customer.
* Mark orders as **Done** after food is delivered to the customer. 
* Orders marked as **Done** are hidden automatically from waiter side.

#### Checkout & Receipt Management

* Process table checkout for orders marked as **Done**.
* Checkout clears session for specific table number while preserving historical records in the database.
* View and generate receipts in PDF format.

⚙️ System Highlights
Fully role-based system (Customer / Waiter / Kitchen / Admin)
Real-time notification system for operational efficiency
Table-based ordering system (multi-table isolation)
Dynamic menu management (no hardcoded food data)
Session-secured authentication system
PWA installable support for customer convenience

They can view payment for each table and checkoutand checkout table, if checkout eg table 1, all the record of table1 orders are gone(but databse arent deleted this is for the net customer eat table1 = new record to ehckout, wont addups)
display receipt in pdf, potentoonally priny if have printer
view orders that marked ready (ready chef will mark it if they done prepare the food so they waiter can mark it as serving or done(done sent to customer food))
jave a notification bell, it will sounds and bell will have a red dot if a ready order arrives waiter can click the bell (click = red dot no more) to see the orders that kcthen cooked





Admin Side
- Admin can view total revenu
- View all orders details (table id, order number, torderat readyat doneat, status, rematks and food items)
add new food items, name price uplaod pic category(instead of hardcode all food item, admin can add itself)
edit existed food chnage name price new pic categroy oreven remove entirely
can view sttaistic of visual eg best seller allfoodsold vsdaily sales timeline
can sort the food by  a-z etc price
instead of hardcodethe fk user password, admin design the passowrd and user, eg a new waiter hiredm so admin create a new user acc name password role, a waiter resigned, admin remove the acc deleetd it these account is used in login page, very bad no harrddcore sory

Backend System
- Orders are stored permanently in MongoDB Atlas
- Each order has a unique Order ID
- Status updates are saved real time

Other Features
all updates are auto 3sec refresh eg if user place order, kitchen see it every 3 second auto refesh
- QR table system (table=1 to table=5)
- Real production-style URL routing
- Real-time order processing workflow
- Cart persists on refresh (no reset)
- Database (MongoDB)
- Cross-device support (phone + laptop) 
- Installable web app (PWA ready concept)
- Dark mode toggle button
- Data visualization using charts
auto generated order id. eg order 178 indicate its the 178th orders

Click image to zoom


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
