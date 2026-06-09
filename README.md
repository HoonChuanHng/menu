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
- They can view diital menu consist of many food 
Navigation bar for each food ctageory 
- They add items to a cart that can Add/remove to cart can increase decrease quanitity
with quantity and price calculated automatically
can add remarks
- They submit an order to the system, where its table id is recorded for later checkout and sepearte with other tbale(customer)
search for food
call waiter, waiter recive message from their side
Track order status
no need login
can install the app
 
Login
Select of waiter kicthen admin
Password authentication 
Session expire per 8 hr
if user direct go /admin or /waiter etc, forced to login page
Show/hide password

waiter
have a notifciation sound wehn custimer cakl waiter, print up the table id pf that who is called customer
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
