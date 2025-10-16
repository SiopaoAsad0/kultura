# 🧪 Kultura - Complete System Test Cases

## 📋 System Overview

**Kultura** is a comprehensive indigenous cultural marketplace platform with:
- Product marketplace for indigenous crafts
- Cultural storytelling platform
- Fundraising campaigns for community projects
- Image gallery for cultural preservation
- Order management system
- Stock management

---

## 🎯 Test Environment

| Component | URL/Details |
|-----------|------------|
| Backend API | http://127.0.0.1:8000 |
| Frontend App | http://localhost:3000 |
| Database | MySQL - kultura |
| Test Data | Via `php artisan db:seed` |

---

## 👥 Test Accounts

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| **Weaver** | weaver@example.com | password | Create products, stories, fundraising, manage orders |
| **Customer** | user@example.com | password | Browse, purchase, donate, view content |

---

## 📊 Test Case Summary

| Module | Test Cases | Priority |
|--------|-----------|----------|
| Authentication & Registration | 7 | 🔴 Critical |
| Product Management | 8 | 🔴 Critical |
| Shopping & Cart | 10 | 🔴 Critical |
| Checkout & Orders | 8 | 🔴 Critical |
| Order Management (Weaver) | 6 | 🔴 Critical |
| Stock Management | 5 | 🔴 Critical |
| Stories Module | 10 | 🟡 High |
| Fundraising Module | 12 | 🟡 High |
| Imagery/Gallery Module | 8 | 🟡 High |
| Integration Tests | 5 | 🔴 Critical |
| **TOTAL** | **79** | - |

---

# 1. Authentication & Registration Module

## TC-001: User Registration with Terms & Conditions ✅

**Priority:** 🔴 Critical

**Objective:** Verify user registration with mandatory terms acceptance

**Preconditions:** None

**Test Steps:**
1. Navigate to `/register`
2. Fill registration form:
   - Name: "Test Customer"
   - Email: "testcustomer@test.com"
   - Password: "Test@123"
   - Role: "Customer"
3. Attempt to submit WITHOUT checking terms checkbox
4. Verify submit button disabled or validation message
5. Click "Terms and Conditions" link
6. Verify modal opens with terms content
7. Click "I Agree" button in modal
8. Verify checkbox is automatically checked
9. Click "Create Account"
10. Verify redirect to login page

**Expected Results:**
- ✅ Cannot submit without accepting terms
- ✅ Terms modal displays complete content
- ✅ "I Agree" checks the checkbox automatically
- ✅ Account created successfully
- ✅ User data saved in database
- ✅ Password is hashed (bcrypt)
- ✅ Success message displayed

**Test Data:**
```json
{
  "name": "Test Customer",
  "email": "testcustomer@test.com",
  "password": "Test@123",
  "role": "user"
}
```

---

## TC-002: Weaver Registration

**Priority:** 🔴 Critical

**Test Steps:**
1. Navigate to `/register`
2. Fill form with role: "Weaver"
3. Accept terms
4. Submit registration
5. Login with new account
6. Verify weaver-specific features accessible

**Expected Results:**
- ✅ Weaver role saved correctly
- ✅ Can access `/dashboard`
- ✅ "View Orders" button visible
- ✅ Cannot access checkout/cart features

---

## TC-003: Login - Valid Credentials

**Priority:** 🔴 Critical

**Test Steps:**
1. Navigate to `/login`
2. Enter: user@example.com / password
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Bearer token generated and stored
- ✅ User object stored in localStorage
- ✅ Redirected to homepage
- ✅ User name displays in header
- ✅ Cart icon visible (for customers)

---

## TC-004: Login - Invalid Credentials

**Priority:** 🟡 High

**Test Steps:**
1. Navigate to `/login`
2. Enter: user@example.com / wrongpassword
3. Submit

**Expected Results:**
- ✅ Error: "Invalid credentials"
- ✅ Status code: 401
- ✅ No token generated
- ✅ Not redirected
- ✅ Form remains filled

---

## TC-005: Logout Functionality

**Priority:** 🔴 Critical

**Test Steps:**
1. Login successfully
2. Click "Logout" in header
3. Attempt to access protected route

**Expected Results:**
- ✅ Token deleted from database
- ✅ localStorage cleared
- ✅ Redirected to homepage
- ✅ Cannot access protected routes
- ✅ Shows "Login" button

---

## TC-006: Token Expiration Handling

**Priority:** 🟡 High

**Test Steps:**
1. Login successfully
2. Manually delete token from backend
3. Try to add product to cart

**Expected Results:**
- ✅ Receives 401 Unauthorized
- ✅ Auto-redirected to login
- ✅ Token cleared from localStorage
- ✅ Error message displayed

---

## TC-007: Duplicate Email Registration

**Priority:** 🟡 High

**Test Steps:**
1. Try to register with existing email
2. Submit form

**Expected Results:**
- ✅ Validation error: "Email already exists"
- ✅ Status 422
- ✅ No duplicate created

---

# 2. Product Management Module (Weaver)

## TC-008: Add Product - Minimal Fields ✅

**Priority:** 🔴 Critical

**Test Steps:**
1. Login as weaver
2. Navigate to `/dashboard`
3. Fill product form:
   - Title: "Traditional Basket"
   - Story: "Handwoven bamboo basket from Cordillera"
   - Price: 750.00
   - Stock: 25
4. Click "Add Product"

**Expected Results:**
- ✅ Product created successfully
- ✅ Shows in "Your Products" table
- ✅ Stock: 25
- ✅ Weaver ID set correctly
- ✅ Form cleared after submission
- ✅ Success message displayed

**Verification Query:**
```sql
SELECT * FROM products 
WHERE title = 'Traditional Basket' 
AND weaver_id = <weaver_id>;
```

---

## TC-009: Product Validation - Required Fields

**Priority:** 🔴 Critical

**Test Steps:**
1. Try to submit with empty title
2. Try to submit with negative price
3. Try to submit with negative stock

**Expected Results:**
- ✅ Title required validation
- ✅ Price must be >= 0
- ✅ Stock must be >= 0
- ✅ Form not submitted
- ✅ Validation errors displayed

---

## TC-010: Delete Product

**Priority:** 🟡 High

**Test Steps:**
1. Login as weaver
2. View products table
3. Click "Delete" on a product
4. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Product deleted from database
- ✅ Removed from table
- ✅ Images deleted (if any)
- ✅ Success message shown

---

## TC-011: View Products - Weaver Filter

**Priority:** 🟡 High

**Test Steps:**
1. Create products with Weaver A
2. Create products with Weaver B
3. Login as Weaver A
4. View dashboard

**Expected Results:**
- ✅ Shows ONLY Weaver A's products
- ✅ Does not show Weaver B's products
- ✅ Correct product count

---

## TC-012: Product Listing - Public View

**Priority:** 🔴 Critical

**Test Steps:**
1. Navigate to `/products`
2. View product list

**Expected Results:**
- ✅ Shows ALL products from all weavers
- ✅ Displays: Title, Price, Stock
- ✅ Products are clickable
- ✅ Pagination works (if applicable)
- ✅ Stock displayed correctly

---

## TC-013: Product Detail View

**Priority:** 🔴 Critical

**Test Steps:**
1. Click on a product
2. View detail page

**Expected Results:**
- ✅ URL: `/products/{id}`
- ✅ Shows: Title, Story, Price, Stock
- ✅ "Add to Cart" button visible (if logged in)
- ✅ Stock count accurate
- ✅ Heritage info displayed (if set)

---

## TC-014: Product Search/Filter

**Priority:** 🟢 Medium

**Test Steps:**
1. Navigate to `/products`
2. Search for "basket"

**Expected Results:**
- ✅ Shows products containing "basket"
- ✅ Search works on title and story
- ✅ Results update in real-time

---

## TC-015: Product Stock Display

**Priority:** 🔴 Critical

**Test Steps:**
1. View product with stock = 5
2. Verify stock displays correctly
3. Check stock shows "Out of Stock" when 0

**Expected Results:**
- ✅ Stock count accurate
- ✅ Shows "Out of Stock" when stock = 0
- ✅ "Add to Cart" disabled when stock = 0

---

# 3. Shopping & Cart Module

## TC-016: Add to Cart - Not Authenticated

**Priority:** 🔴 Critical

**Test Steps:**
1. Logout (if logged in)
2. View product detail
3. Click "Add to Cart"

**Expected Results:**
- ✅ Alert: "Please login first"
- ✅ Redirected to `/login`
- ✅ Product NOT added to cart

---

## TC-017: Add to Cart - Success ✅

**Priority:** 🔴 Critical

**Test Steps:**
1. Login as customer
2. Navigate to product (Stock: 15)
3. Click "Add to Cart"
4. Navigate to `/cart`

**Expected Results:**
- ✅ Success message: "Product added to cart"
- ✅ Item appears in cart
- ✅ Quantity: 1
- ✅ Price displayed correctly
- ✅ Cart badge shows count: 1
- ✅ Backend cart entry created

**API Request:**
```http
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 1
}
```

---

## TC-018: Add Same Product Multiple Times

**Priority:** 🟡 High

**Test Steps:**
1. Add product to cart
2. Add same product again
3. View cart

**Expected Results:**
- ✅ Quantity incremented (not duplicated)
- ✅ Shows: Quantity = 2
- ✅ Total = Price × Quantity
- ✅ Only one cart entry

---

## TC-019: View Cart

**Priority:** 🔴 Critical

**Test Steps:**
1. Login with items in cart
2. Navigate to `/cart`

**Expected Results:**
- ✅ All cart items displayed
- ✅ Shows: Title, Qty, Price, Subtotal
- ✅ Total calculated correctly
- ✅ Tax calculated (12%)
- ✅ "Remove" button for each item
- ✅ "Proceed to Checkout" button visible

---

## TC-020: Remove from Cart

**Priority:** 🟡 High

**Test Steps:**
1. Navigate to `/cart` with items
2. Click "Remove" on an item

**Expected Results:**
- ✅ Item removed immediately
- ✅ Cart total updated
- ✅ Backend cart entry deleted
- ✅ Success message shown
- ✅ Cart badge updated

---

## TC-021: Cart Sync Across Sessions

**Priority:** 🟢 Medium

**Test Steps:**
1. Login and add items to cart
2. Logout
3. Login again
4. View cart

**Expected Results:**
- ✅ Cart items persist
- ✅ Same items displayed
- ✅ Quantities correct

---

## TC-022: Empty Cart State

**Priority:** 🟢 Medium

**Test Steps:**
1. Remove all items from cart
2. View cart page

**Expected Results:**
- ✅ Shows "Your cart is empty" message
- ✅ Shopping cart icon
- ✅ "Browse Products" button
- ✅ No checkout button

---

## TC-023: Cart - Stock Validation

**Priority:** 🔴 Critical

**Test Steps:**
1. Product stock: 5
2. Try to add quantity: 10

**Expected Results:**
- ✅ Error: "Not enough stock"
- ✅ Shows available stock
- ✅ Cannot add to cart

---

## TC-024: Cart - Multiple Products

**Priority:** 🟡 High

**Test Steps:**
1. Add Product A
2. Add Product B
3. Add Product C
4. View cart

**Expected Results:**
- ✅ All 3 products in cart
- ✅ Each with correct details
- ✅ Total = sum of all items
- ✅ Can remove individually

---

## TC-025: Weaver Cannot Access Cart

**Priority:** 🟡 High

**Test Steps:**
1. Login as weaver
2. Try to access `/cart`

**Expected Results:**
- ✅ No cart icon in header
- ✅ Cannot access cart route
- ✅ Appropriate message shown

---

# 4. Checkout & Orders Module

## TC-026: Checkout Process - Complete ✅

**Priority:** 🔴 Critical

**Preconditions:**
- Customer logged in
- Items in cart
- Product stock available

**Test Steps:**
1. Note product stock: ____ (e.g., 20)
2. Add product to cart (Qty: 3)
3. Navigate to `/cart`
4. Click "Proceed to Checkout"
5. Fill shipping information:
   ```
   Address: "456 Cultural Avenue, Baguio City, Benguet"
   Contact: "09171234567"
   Notes: "Please call before delivery"
   ```
6. Verify order summary shows:
   - Product items
   - Subtotal
   - Tax (12%)
   - Total
7. Click "Place Order"
8. Note Order ID from confirmation
9. Check product stock again

**Expected Results:**
- ✅ Redirected to `/checkout`
- ✅ Order summary accurate
- ✅ Tax calculated: Subtotal × 0.12
- ✅ Total = Subtotal + Tax
- ✅ Payment method: Cash on Delivery
- ✅ Order created successfully
- ✅ Redirected to `/order-confirmation/{id}`
- ✅ Cart cleared after order
- ✅ **Stock deducted: 20 → 17** ✅
- ✅ Order status: "pending"

**Stock Calculation:**
```
Initial Stock: 20
Order Quantity: 3
Expected Final Stock: 17 ✅
```

**API Request:**
```http
POST /api/orders
Authorization: Bearer {token}

{
  "shipping_address": "456 Cultural Avenue, Baguio City, Benguet",
  "contact_number": "09171234567",
  "notes": "Please call before delivery",
  "payment_method": "cash_on_delivery"
}
```

---

## TC-027: Checkout - Insufficient Stock

**Priority:** 🔴 Critical

**Test Steps:**
1. Product stock: 3
2. Add quantity: 5 to cart
3. Attempt checkout

**Expected Results:**
- ✅ Error: "Not enough stock for product: {name}"
- ✅ Checkout prevented
- ✅ Stock not deducted
- ✅ Order not created

---

## TC-028: Checkout - Empty Cart

**Priority:** 🟡 High

**Test Steps:**
1. Have empty cart
2. Try to access `/checkout`

**Expected Results:**
- ✅ Redirected to `/products`
- ✅ Message: "Cart is empty"

---

## TC-029: Checkout - Weaver Restriction

**Priority:** 🔴 Critical

**Test Steps:**
1. Login as weaver
2. Try to create order via API

**Expected Results:**
- ✅ Error: "Weavers cannot create orders"
- ✅ Status: 403 Forbidden
- ✅ No order created

---

## TC-030: Order Confirmation Page

**Priority:** 🟡 High

**Test Steps:**
1. Complete checkout
2. View confirmation page

**Expected Results:**
- ✅ URL: `/order-confirmation/{id}`
- ✅ Shows Order ID
- ✅ Shows order items
- ✅ Shows total amount
- ✅ Shows shipping address
- ✅ Shows status: "Pending"
- ✅ Success message displayed

---

## TC-031: Order History - Customer

**Priority:** 🟡 High

**Test Steps:**
1. Login as customer
2. Navigate to `/orders`
3. View order history

**Expected Results:**
- ✅ Shows all user's orders
- ✅ Displays: Order ID, Date, Total, Status
- ✅ Can click to view details
- ✅ Orders sorted by date (newest first)

---

## TC-032: View Order Details

**Priority:** 🟡 High

**Test Steps:**
1. Navigate to order history
2. Click on an order
3. View order details

**Expected Results:**
- ✅ Shows complete order info
- ✅ Lists all items
- ✅ Shows shipping address
- ✅ Shows payment method
- ✅ Shows current status

---

## TC-033: Tax Calculation

**Priority:** 🔴 Critical

**Test Steps:**
1. Add items totaling ₱1,000 to cart
2. Proceed to checkout
3. Verify tax and total

**Expected Results:**
```
Subtotal: ₱1,000.00
Tax (12%): ₱120.00
Total: ₱1,120.00 ✅
```

---

# 5. Order Management Module (Weaver)

## TC-034: View Orders - Weaver Dashboard ✅

**Priority:** 🔴 Critical

**Preconditions:**
- Customer placed order with weaver's product

**Test Steps:**
1. Login as weaver
2. Navigate to Weaver Dashboard
3. Click "📋 View Orders" button
4. Review orders page

**Expected Results:**
- ✅ Redirected to `/weaver/orders`
- ✅ Orders table displayed
- ✅ Shows ONLY orders with weaver's products
- ✅ Displays: Order #, Customer, Products, Amount, Status, Date
- ✅ Customer name and email visible
- ✅ Product details accurate
- ✅ Status badge color-coded
- ✅ "Update Status" button for non-completed orders

---

## TC-035: Confirm Order - Processing ✅

**Priority:** 🔴 Critical

**Test Steps:**
1. Navigate to `/weaver/orders`
2. Find order with status "⏳ Pending"
3. Click "📝 Update Status"
4. Modal opens
5. Select status: "📦 Processing"
6. Add note: "Order confirmed, preparing items for shipment"
7. Click "✅ Update Order"

**Expected Results:**
- ✅ Modal opens with status dropdown
- ✅ Note field available
- ✅ Status updated to "Processing"
- ✅ Notes saved with prefix: "[Weaver: {name}]"
- ✅ Success message displayed
- ✅ Badge changes to blue "📦 Processing"
- ✅ Order list refreshes

**API Request:**
```http
POST /api/weaver/orders/1/confirm
Authorization: Bearer {token}

{
  "status": "processing",
  "notes": "Order confirmed, preparing items for shipment"
}
```

---

## TC-036: Update Order - Shipped

**Priority:** 🔴 Critical

**Test Steps:**
1. Find order with status "Processing"
2. Click "Update Status"
3. Select: "🚚 Shipped"
4. Add note: "Shipped via LBC, Tracking: LBC123456789"
5. Submit

**Expected Results:**
- ✅ Status updated to "Shipped"
- ✅ Tracking info saved
- ✅ Badge: 🚚 Shipped (purple)
- ✅ Timestamp updated

---

## TC-037: Complete Order - Delivered

**Priority:** 🔴 Critical

**Test Steps:**
1. Find "Shipped" order
2. Update to "✅ Delivered"
3. Add note: "Successfully delivered"

**Expected Results:**
- ✅ Status: "Delivered"
- ✅ Badge: ✅ Delivered (green)
- ✅ **"Update Status" button disappears**
- ✅ Order locked from further updates

---

## TC-038: Cannot Modify Completed Order

**Priority:** 🟡 High

**Test Steps:**
1. Find delivered order
2. Look for update option

**Expected Results:**
- ✅ No "Update Status" button
- ✅ Order is read-only
- ✅ Cannot change via API (403 error)

---

## TC-039: Multi-Weaver Order Filtering

**Priority:** 🔴 Critical

**Test Steps:**
1. Customer orders from Weaver A and B
2. Login as Weaver A
3. View orders

**Expected Results:**
- ✅ Shows order with ONLY Weaver A's products
- ✅ Weaver B's items filtered out
- ✅ Subtotal shows only Weaver A's amount
- ✅ Correct calculation

**Example:**
```
Order #123:
- Weaver A: Basket ₱500
- Weaver B: Mat ₱800

Weaver A sees:
- Basket ₱500
- Subtotal: ₱500 ✅

Weaver B sees:
- Mat ₱800
- Subtotal: ₱800 ✅
```

---

# 6. Stock Management Module

## TC-040: Stock Deduction on Checkout ✅

**Priority:** 🔴 Critical

**Test Steps:**
```
1. Product initial stock: 50
2. Customer orders: 7 units
3. Check product stock
```

**Expected Results:**
```
Before Order:
- Stock: 50

After Order:
- Stock: 43 (50 - 7) ✅
- Deduction immediate
- Accurate to the unit
```

**Database Verification:**
```sql
SELECT stock FROM products WHERE id = ?;
-- Should show: 43
```

---

## TC-041: Stock Validation - Prevent Overselling

**Priority:** 🔴 Critical

**Test Steps:**
1. Product stock: 5
2. Try to order: 10 units

**Expected Results:**
- ✅ Error: "Not enough stock available"
- ✅ Shows available: 5 units
- ✅ Order not created
- ✅ Stock unchanged (remains 5)

---

## TC-042: Stock Restoration on Cancellation ✅

**Priority:** 🔴 Critical

**Test Steps:**
```
1. Product stock: 30
2. Customer orders: 5
3. Stock becomes: 25
4. Customer cancels order
5. Check stock
```

**Expected Results:**
```
Initial: 30
After Order: 25 (30 - 5)
After Cancel: 30 (25 + 5) ✅
Stock fully restored
```

---

## TC-043: Concurrent Orders - Same Product

**Priority:** 🟡 High

**Test Steps:**
1. Product stock: 20
2. User A orders: 8 (simultaneously)
3. User B orders: 15 (simultaneously)
4. Check final stock

**Expected Results:**
- ✅ One order succeeds (first to complete)
- ✅ Second order fails (insufficient stock)
- ✅ No negative stock
- ✅ No race condition

**Stock Calculation:**
```
Option 1 (A succeeds, B fails):
- Final: 12 (20 - 8)

Option 2 (B succeeds, A fails):
- Final: 5 (20 - 15)

Both cannot succeed ✅
```

---

## TC-044: Stock Display Accuracy

**Priority:** 🟡 High

**Test Steps:**
1. Create product with stock: 100
2. Multiple orders reduce stock
3. Check stock at different points

**Expected Results:**
- ✅ Always shows current stock
- ✅ Updates immediately after order
- ✅ Accurate across all pages
- ✅ No caching issues

---

# 7. Stories Module

## TC-045: View Stories List

**Priority:** 🟡 High

**Test Steps:**
1. Navigate to `/stories`
2. View stories list

**Expected Results:**
- ✅ Shows published stories
- ✅ Displays: Title, Excerpt, Image
- ✅ Shows author name
- ✅ Shows like count
- ✅ Shows view count
- ✅ Pagination works

---

## TC-046: View Story Detail

**Priority:** 🟡 High

**Test Steps:**
1. Click on a story
2. View detail page

**Expected Results:**
- ✅ URL: `/stories/{slug}`
- ✅ Shows full content
- ✅ Shows featured image
- ✅ Shows gallery images (if any)
- ✅ Shows author info
- ✅ View count incremented
- ✅ Like button visible

---

## TC-047: Create Story

**Priority:** 🟡 High

**Preconditions:** Authenticated user

**Test Steps:**
1. Navigate to story create page
2. Fill form:
   ```
   Title: "Weaving Traditions of Benguet"
   Content: "The art of traditional weaving..."
   Category: "Cultural Heritage"
   Location: "Benguet, Cordillera"
   ```
3. Upload featured image
4. Add gallery images
5. Submit

**Expected Results:**
- ✅ Story created
- ✅ Slug generated from title
- ✅ Images uploaded to storage
- ✅ Status: "published" or "pending"
- ✅ User ID set correctly

---

## TC-048: Like Story

**Priority:** 🟢 Medium

**Test Steps:**
1. View story detail
2. Note like count
3. Click "Like" button
4. Refresh page

**Expected Results:**
- ✅ Like count incremented
- ✅ Change persists
- ✅ API call successful

**API:**
```http
POST /api/stories/{story}/like
```

---

## TC-049: Filter Stories - Featured

**Priority:** 🟢 Medium

**Test Steps:**
1. Navigate to stories
2. Filter by "Featured"

**Expected Results:**
- ✅ Shows only featured stories
- ✅ `is_featured = true`
- ✅ Limit to 6 items

---

## TC-050: Filter Stories - Cordillera

**Priority:** 🟢 Medium

**Test Steps:**
1. Navigate to `/stories/cordillera`

**Expected Results:**
- ✅ Shows Cordillera-related stories
- ✅ Filtered by category or location
- ✅ Pagination works

---

## TC-051: Search Stories

**Priority:** 🟢 Medium

**Test Steps:**
1. Search for "weaving"

**Expected Results:**
- ✅ Searches title, excerpt, content
- ✅ Searches author name and location
- ✅ Returns matching results

---

## TC-052: Update Story

**Priority:** 🟢 Medium

**Test Steps:**
1. Login as story author
2. Edit story
3. Update content and images
4. Save

**Expected Results:**
- ✅ Only author can update
- ✅ Changes saved
- ✅ Old images deleted
- ✅ New images uploaded
- ✅ Slug updated if title changes

---

## TC-053: Delete Story

**Priority:** 🟢 Medium

**Test Steps:**
1. Login as author
2. Delete story

**Expected Results:**
- ✅ Story deleted from database
- ✅ All associated images deleted
- ✅ Success message shown

---

## TC-054: Story View Counter

**Priority:** 🟢 Medium

**Test Steps:**
1. Note view count
2. View story
3. Check count again

**Expected Results:**
- ✅ Count incremented by 1
- ✅ Each view counted
- ✅ Persists in database

---

# 8. Fundraising Module

## TC-055: View Fundraising Campaigns

**Priority:** 🟡 High

**Test Steps:**
1. Navigate to `/fundraising`
2. View campaign list

**Expected Results:**
- ✅ Shows all active campaigns
- ✅ Displays: Title, Description, Image
- ✅ Shows progress bar
- ✅ Shows current amount / target
- ✅ Shows days remaining
- ✅ Shows donor count

---

## TC-056: View Campaign Detail

**Priority:** 🟡 High

**Test Steps:**
1. Click on a campaign
2. View detail page

**Expected Results:**
- ✅ URL: `/fundraising/{slug}`
- ✅ Full description visible
- ✅ Progress percentage calculated
- ✅ Shows organizer info
- ✅ Recent donations list
- ✅ "Donate" button visible

---

## TC-057: Create Fundraising Campaign

**Priority:** 🟡 High

**Test Steps:**
1. Login (any user)
2. Create campaign:
   ```
   Title: "Build Community Learning Center"
   Description: "Help us build a learning center..."
   Category: "education"
   Target: ₱100,000
   End Date: (30 days from now)
   Organizer: "Benguet Cultural Foundation"
   Email: "info@bcf.org"
   ```
3. Submit

**Expected Results:**
- ✅ Campaign created
- ✅ Status: "pending"
- ✅ User ID set
- ✅ Slug generated
- ✅ Dates validated

---

## TC-058: Make Donation ✅

**Priority:** 🟡 High

**Preconditions:** 
- Customer logged in
- Active campaign

**Test Steps:**
1. Login as customer
2. View campaign detail
3. Click "Donate" button
4. Enter amount: ₱500
5. Add message: "Supporting cultural education!"
6. Check "Anonymous" (optional)
7. Submit donation

**Expected Results:**
- ✅ Donation created
- ✅ Amount added to campaign total
- ✅ Progress updated
- ✅ Donor count incremented
- ✅ Message saved
- ✅ Anonymous flag respected
- ✅ Success message shown

**API:**
```http
POST /api/fundraisings/{slug}/donate
Authorization: Bearer {token}

{
  "amount": 500,
  "message": "Supporting cultural education!",
  "is_anonymous": false
}
```

---

## TC-059: Weaver Cannot Donate

**Priority:** 🟡 High

**Test Steps:**
1. Login as weaver
2. Try to donate

**Expected Results:**
- ✅ Error: "Weavers cannot make donations"
- ✅ Status: 403 Forbidden
- ✅ Donation not created

---

## TC-060: Campaign Progress Calculation

**Priority:** 🟡 High

**Test Steps:**
1. Campaign target: ₱10,000
2. Donations: ₱2,500
3. Check progress

**Expected Results:**
```
Target: ₱10,000
Current: ₱2,500
Progress: 25% ✅
Formatted: "₱2,500.00 / ₱10,000.00"
```

---

## TC-061: Campaign Auto-Complete

**Priority:** 🟡 High

**Test Steps:**
1. Campaign target: ₱5,000
2. Current amount: ₱4,800
3. Donate: ₱300

**Expected Results:**
- ✅ Total becomes: ₱5,100
- ✅ **Status auto-changes to "completed"**
- ✅ Progress: 102%
- ✅ Cannot donate more

---

## TC-062: Days Remaining Calculation

**Priority:** 🟢 Medium

**Test Steps:**
1. Campaign end date: 15 days from now
2. View campaign

**Expected Results:**
- ✅ Shows: "15 days remaining"
- ✅ Updates daily
- ✅ Shows 0 when expired

---

## TC-063: Filter Campaigns by Category

**Priority:** 🟢 Medium

**Test Steps:**
1. Filter by "education"

**Expected Results:**
- ✅ Shows education campaigns only
- ✅ Other categories hidden

---

## TC-064: My Donations List

**Priority:** 🟢 Medium

**Test Steps:**
1. Login as customer
2. Navigate to `/my-donations`

**Expected Results:**
- ✅ Shows all user's donations
- ✅ Displays: Campaign, Amount, Date
- ✅ Links to campaigns
- ✅ Sorted by date

---

## TC-065: Update Campaign

**Priority:** 🟢 Medium

**Test Steps:**
1. Login as campaign creator
2. Update campaign details

**Expected Results:**
- ✅ Only creator can update
- ✅ Changes saved
- ✅ Cannot change if completed

---

## TC-066: Delete Campaign

**Priority:** 🟢 Medium

**Test Steps:**
1. Delete campaign with donations

**Expected Results:**
- ✅ Only creator can delete
- ✅ Donations cascade deleted
- ✅ Success message shown

---

# 9. Imagery/Gallery Module

## TC-067: View Gallery

**Priority:** 🟢 Medium

**Test Steps:**
1. Navigate to `/imagery`
2. View image gallery

**Expected Results:**
- ✅ Shows all public images
- ✅ Grid/masonry layout
- ✅ Shows thumbnails
- ✅ Shows titles and categories
- ✅ Pagination works

---

## TC-068: View Image Detail

**Priority:** 🟢 Medium

**Test Steps:**
1. Click on an image
2. View detail page

**Expected Results:**
- ✅ Full-size image displayed
- ✅ Shows title and description
- ✅ Shows photographer info
- ✅ Shows location and tags
- ✅ View count incremented
- ✅ Image dimensions shown

---

## TC-069: Upload Image

**Priority:** 🟢 Medium

**Preconditions:** Authenticated user

**Test Steps:**
1. Upload image:
   ```
   Title: "Traditional Textile Pattern"
   Description: "Intricate weaving pattern..."
   Category: "textiles"
   Location: "Baguio City"
   Photographer: "Juan dela Cruz"
   Email: "juan@email.com"
   File: textile.jpg (< 10MB)
   ```
2. Submit

**Expected Results:**
- ✅ Image uploaded to storage
- ✅ File info captured (name, type, size)
- ✅ Dimensions extracted
- ✅ Status: "pending"
- ✅ User ID set
- ✅ Success message

---

## TC-070: Image File Validation

**Priority:** 🟡 High

**Test Steps:**
1. Try to upload:
   - PDF file
   - 15MB image
   - Unsupported format

**Expected Results:**
- ✅ Only image types allowed
- ✅ Max size: 10MB
- ✅ Formats: jpeg, png, jpg, gif
- ✅ Validation errors shown

---

## TC-071: Filter Images by Category

**Priority:** 🟢 Medium

**Test Steps:**
1. Filter by "festivals"

**Expected Results:**
- ✅ Shows festival images only
- ✅ Correct filtering

**Categories:**
- textiles
- crafts
- festivals
- people
- landscape

---

## TC-072: Search Images

**Priority:** 🟢 Medium

**Test Steps:**
1. Search for "cordillera"

**Expected Results:**
- ✅ Searches title, description, tags
- ✅ Returns matching results

---

## TC-073: Update Image

**Priority:** 🟢 Medium

**Test Steps:**
1. Login as image uploader
2. Update image details
3. Replace image file

**Expected Results:**
- ✅ Only uploader can update
- ✅ Details updated
- ✅ Old image deleted
- ✅ New image uploaded

---

## TC-074: Delete Image

**Priority:** 🟢 Medium

**Test Steps:**
1. Login as uploader
2. Delete image

**Expected Results:**
- ✅ Image file deleted from storage
- ✅ Database record deleted
- ✅ Success message

---

# 10. Integration & End-to-End Tests

## TC-075: Complete Customer Journey

**Priority:** 🔴 Critical

**Test Steps:**
1. **Register** new customer account (accept terms)
2. **Login** successfully
3. **Browse** products
4. **View** product detail
5. **Add** product to cart (Stock: 25)
6. **View** cart
7. **Checkout** with shipping info
8. **Verify** order confirmation
9. **Check** stock reduced (25 → 24)
10. **View** order history

**Expected Results:**
- ✅ All steps complete without errors
- ✅ Stock deducted correctly
- ✅ Order created successfully
- ✅ Cart cleared
- ✅ Data persists

---

## TC-076: Complete Weaver Journey

**Priority:** 🔴 Critical

**Test Steps:**
1. **Register** weaver account (accept terms)
2. **Login** as weaver
3. **Add** product (Stock: 30)
4. **Logout**
5. Login as customer
6. **Order** the product (Qty: 5)
7. **Verify** stock: 25
8. **Logout**
9. Login as weaver
10. **View** orders
11. **Confirm** order (Processing)
12. **Update** to Shipped
13. **Mark** as Delivered

**Expected Results:**
- ✅ Product created: Stock 30
- ✅ Order placed: Stock 25
- ✅ Order visible in weaver dashboard
- ✅ All status updates work
- ✅ Order locked after delivery

---

## TC-077: Full Content Creation Flow

**Priority:** 🟡 High

**Test Steps:**
1. Login as weaver
2. Create story
3. Create fundraising campaign
4. Upload gallery images
5. Logout and view as public

**Expected Results:**
- ✅ All content created
- ✅ Visible to public
- ✅ User can interact (like, donate, view)

---

## TC-078: Multi-Feature Interaction

**Priority:** 🟡 High

**Test Steps:**
1. Customer orders from multiple weavers
2. Customer donates to fundraising
3. Customer likes stories
4. Each weaver sees only their orders

**Expected Results:**
- ✅ Order correctly split
- ✅ Each weaver sees their portion
- ✅ Donations tracked
- ✅ Likes counted

---

## TC-079: Cross-Role Restrictions

**Priority:** 🔴 Critical

**Test Steps:**
1. Weaver tries to:
   - Place order ❌
   - Donate ❌
   - Add to cart ❌
2. Customer tries to:
   - Create product ❌
   - View weaver orders ❌

**Expected Results:**
- ✅ All restricted actions blocked
- ✅ Appropriate errors returned
- ✅ 403 Forbidden responses

---

# 📊 Test Execution Template

```
KULTURA TEST EXECUTION REPORT
================================
Date: _______________
Tester: _______________
Environment: Development

MODULE SUMMARY:
1. Authentication & Registration: __/7 passed
2. Product Management: __/8 passed
3. Shopping & Cart: __/10 passed
4. Checkout & Orders: __/8 passed
5. Order Management (Weaver): __/6 passed
6. Stock Management: __/5 passed
7. Stories Module: __/10 passed
8. Fundraising Module: __/12 passed
9. Imagery/Gallery Module: __/8 passed
10. Integration Tests: __/5 passed

TOTAL: __/79 passed (__%)

CRITICAL ISSUES:
1. _________________________________
2. _________________________________

HIGH PRIORITY ISSUES:
1. _________________________________
2. _________________________________

MEDIUM ISSUES:
1. _________________________________

NOTES:
- _________________________________
- _________________________________

RECOMMENDATIONS:
- _________________________________
- _________________________________

SIGN-OFF:
Tested By: _______________
Approved By: _______________
Date: _______________
```

---

# 🎯 Quick Smoke Test Checklist

**Time: ~30 minutes**

## Critical Path Tests:
- [ ] TC-001: Register with terms ✅
- [ ] TC-003: Login ✅
- [ ] TC-008: Add product ✅
- [ ] TC-017: Add to cart ✅
- [ ] TC-026: Complete checkout ✅
- [ ] TC-040: Stock deduction ✅
- [ ] TC-034: View weaver orders ✅
- [ ] TC-035: Confirm order ✅

## Feature Verification:
- [ ] TC-045: View stories ✅
- [ ] TC-055: View fundraising ✅
- [ ] TC-058: Make donation ✅
- [ ] TC-067: View gallery ✅

## Integration:
- [ ] TC-075: Customer journey ✅
- [ ] TC-076: Weaver journey ✅

**Pass Criteria:** 14/14 tests pass ✅

---

# 🔍 Test Data & SQL Queries

## Verify Stock Deduction:
```sql
-- Before order
SELECT id, title, stock FROM products WHERE id = 1;

-- After order (Qty: 3)
-- Stock should be reduced by 3
```

## Verify Order Creation:
```sql
SELECT o.*, oi.* 
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = ?
ORDER BY o.created_at DESC;
```

## Verify Weaver Orders:
```sql
SELECT o.*, oi.*, p.weaver_id
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.weaver_id = ?;
```

## Verify Fundraising Progress:
```sql
SELECT 
  f.id,
  f.title,
  f.target_amount,
  SUM(d.amount) as current_amount,
  COUNT(d.id) as donor_count,
  (SUM(d.amount) / f.target_amount * 100) as progress_percentage
FROM fundraisings f
LEFT JOIN donations d ON f.id = d.fundraising_id
WHERE f.id = ?
GROUP BY f.id;
```

---

**Document Version:** 1.0  
**Total Test Cases:** 79  
**Last Updated:** October 13, 2025  
**Status:** ✅ Ready for Execution


