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
Customer Side
Customers can access the system by scanning a QR code or opening a table-specific link (Table 1–5).

Features:
- View a digital menu with categorized food listings
- Navigate menu via category-based navigation bar
- Add items to cart
- Increase or decrease quantity
- Add remark
- Automatic price calculation 
- Submit orders linked to a specific table ID
- Search for food items
- Track order status
- Call waiter feature (sends notification to waiter system)
- Installable as an application (PWA support)
- No login required for customers
 
Login Page
The system includes role-based authentication for staff access.

Features:
- Login system for Waiter / Kitchen / Admin roles
- Password-based authentication
- Show / hide password toggle 
- Session expiration (8 hours)
- Protected routes (e.g., /admin, /waiter, /kitchen require login)

Waiter Side
Waiters manage customer interaction, order delivery workflow, and checkout table.

Features:
- Receive notifications message, notification sound, and table ID when customers call waiter
- View and manage orders marked as 'Ready' by the kitchen.
- Receive another notification sound when there is new 'Ready' orders.
- Update order status to Serving and Done.
- Handle table checkout for orders marked 'Ready'.
- New 'Ready' Orders notification message is display inside the bell icon.
- Bell icon with red dot indicator for new events
- Clicking clears notification state
- Clearing table session after checkout (historical data retained in database)
- View receipt (PDF format)

### Waiter Features

#### Customer Call Waiter Notification

* Receive notification messages, notification sound, and table IDs when customers call waiter..

#### Ready Order Notification

* Receive a separate notification sound when the kitchen marks an order as **Ready**.
* View newly received **Ready** orders through the notification bell.
* Unread **Ready** order notifications are indicated by a red dot on the notification bell.
* Clicking the notification bell displays new **Ready** orders and clears the unread indicator.
* Option to delete **Ready** orders in the notification bell.

#### Order Delivering

* View orders marked as **Ready** by the kitchen.
* Update order status to **Serving** when food is delivering to the customer.
* Mark orders as **Done** after food is delivered to the customer. 

#### Checkout & Receipt Management

* Process table checkout after orders that have been marked .
* Clear active table sessions after checkout while preserving historical records in the database.
* View and generate receipts in PDF format.


👨‍🍳 Kitchen Side

Kitchen staff manage order preparation and food availability.

Features:
View all incoming customer orders
Orders displayed with:
Table ID
Order number
Time ordered
Food items
Special remarks
Order status
Update order status:
Preparing
Ready (completed cooking)
Sort orders (e.g., A–Z, availability priority)
Mark items as out of stock / unavailable
Notification system:
Alert sound for new orders
Bell icon with red dot indicator for new incoming orders
🛠️ Admin Side

Administrators manage the entire system, menu, users, and analytics.

Features:
Dashboard analytics:
Total revenue
Daily sales overview
Best-selling items
Sales timeline visualization
Full order history access:
Table ID
Order number
Timestamps (ordered / ready / completed)
Status tracking
Remarks and item details
Menu management:
Add new food items (name, price, image, category)
Edit existing items
Remove items
Update availability (in stock / out of stock)
Sorting and filtering menu items (A–Z, price, category)
User management system:
Create new staff accounts (waiter/kitchen/admin)
Assign roles
Update credentials
Remove accounts when staff leave
Fully dynamic (no hardcoded users)
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



Kitchen Side
- Kitchen staff view all orders by custmer
- Orders are displayed with table id, order number, remark, status time ordered, and food items
- They can change status (Preparing / ready) ready= cokked, prepatng = prepare
can sort the food by availanle first, a-z etc
can set dood Out of sales/rstock that customer know oh its unorderable
jave a notification bell, it will sounds and bell will have a red dot if a new order arrives, can click the bell (click = red dot no more) to see the orders

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
- Cross-device support (phone + laptop) responsive design(expect categroy button issue)
- Installable web app (PWA ready concept)
- Dark mode toggle button
- Data visualization using charts
auto generated order id. eg order 178 indicate its the 178th orders

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
