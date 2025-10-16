# 🧪 Kultura System Test Cases

## Test Environment Setup
- **Backend URL:** http://127.0.0.1:8000
- **Frontend URL:** http://localhost:3000
- **Database:** MySQL (kultura)
- **Seeded Data:** Yes (via `php artisan db:seed`)

---

## Test Accounts

| Account Type | Email | Password | Role |
|-------------|-------|----------|------|
| Weaver | weaver@example.com | password | weaver |
| Customer | user@example.com | password | user |

---

## Test Case Categories

1. [Authentication & Registration](#1-authentication--registration)
2. [Product Management](#2-product-management-weaver)
3. [Shopping & Cart](#3-shopping--cart-customer)
4. [Checkout & Orders](#4-checkout--orders)
5. [Order Management](#5-order-management-weaver)
6. [Stock Management](#6-stock-management)

---

## 1. Authentication & Registration

### TC-001: User Registration with Terms and Conditions

**Objective:** Verify that users can register with terms acceptance

**Preconditions:** User is on registration page

**Test Steps:**
1. Navigate to `/register`
2. Fill in registration form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "password123"
   - Account Type: "Customer"
3. Do NOT check Terms and Conditions checkbox
4. Click "Create Account" button
5. Check Terms and Conditions checkbox
6. Click "Create Account" button

**Expected Results:**
- ✅ Step 4: Submit button should be disabled OR show error "Please accept the Terms and Conditions"
- ✅ Step 6: Account created successfully
- ✅ Redirected to login page
- ✅ Success message displayed

**Test Data:**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "user"
}
```

---

### TC-002: Terms and Conditions Modal

**Objective:** Verify Terms modal displays and works correctly

**Test Steps:**
1. Navigate to `/register`
2. Click "Terms and Conditions" link in checkbox label
3. Read the modal content
4. Click "I Agree" button
5. Verify checkbox is checked

**Expected Results:**
- ✅ Modal opens with full terms content
- ✅ Modal is scrollable
- ✅ Contains sections: Platform Terms, User Responsibilities, Privacy Policy, etc.
- ✅ "I Agree" button checks the checkbox automatically
- ✅ Modal closes after clicking "I Agree"

---

### TC-003: User Login

**Objective:** Verify user can login successfully

**Test Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: "user@example.com"
   - Password: "password"
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to homepage
- ✅ User name displayed in header
- ✅ Appropriate navigation menu shown (Cart icon for customers)

---

### TC-004: Weaver Login

**Objective:** Verify weaver can login and access dashboard

**Test Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: "weaver@example.com"
   - Password: "password"
3. Click "Sign In"
4. Navigate to `/dashboard`

**Expected Results:**
- ✅ Login successful
- ✅ Can access Weaver Dashboard
- ✅ "View Orders" button visible
- ✅ Product management form visible

---

### TC-005: Logout

**Objective:** Verify logout functionality

**Test Steps:**
1. Login with any account
2. Click "Logout" button in header
3. Try to access protected routes

**Expected Results:**
- ✅ User logged out successfully
- ✅ Redirected to homepage or login
- ✅ Cannot access protected routes
- ✅ Token removed from localStorage

---

## 2. Product Management (Weaver)

### TC-006: Add Product with Minimal Fields

**Objective:** Verify weaver can add product with required fields only

**Preconditions:** Logged in as weaver

**Test Steps:**
1. Navigate to Weaver Dashboard
2. Fill product form:
   - Title: "Handwoven Basket"
   - Story: "Traditional basket made with bamboo"
   - Price: 500
   - Stock: 10
3. Click "Add Product"

**Expected Results:**
- ✅ Product created successfully
- ✅ Success message displayed
- ✅ Product appears in "Your Products" table
- ✅ Form cleared after submission
- ✅ Stock shows 10

**Test Data:**
```json
{
  "title": "Handwoven Basket",
  "story": "Traditional basket made with bamboo",
  "price": 500,
  "stock": 10
}
```

---

### TC-007: Add Product - Validation

**Objective:** Verify product validation works

**Test Steps:**
1. Navigate to Weaver Dashboard
2. Try to submit empty form
3. Fill only title, click submit
4. Fill all required fields correctly

**Expected Results:**
- ✅ Step 2: Form validation prevents submission
- ✅ Step 3: Shows validation errors for missing fields
- ✅ Step 4: Product created successfully

---

### TC-008: Delete Product

**Objective:** Verify weaver can delete their product

**Test Steps:**
1. Login as weaver
2. Navigate to Weaver Dashboard
3. Find a product in the table
4. Click "Delete" button
5. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Product deleted from database
- ✅ Product removed from table
- ✅ Success message displayed

---

### TC-009: View Products List

**Objective:** Verify weaver can view their products

**Test Steps:**
1. Login as weaver
2. Navigate to Weaver Dashboard
3. View "Your Products" section

**Expected Results:**
- ✅ Shows only products created by logged-in weaver
- ✅ Displays: Title, Story (truncated), Stock, Price
- ✅ Shows action buttons (Delete)
- ✅ Empty state if no products

---

## 3. Shopping & Cart (Customer)

### TC-010: Browse Products

**Objective:** Verify customer can browse products

**Preconditions:** Products exist in database

**Test Steps:**
1. Navigate to `/products`
2. View product list
3. Check product details displayed

**Expected Results:**
- ✅ All products displayed
- ✅ Shows: Title, Price, Stock
- ✅ Products are clickable
- ✅ Pagination works (if applicable)

---

### TC-011: View Product Detail

**Objective:** Verify product detail page works

**Test Steps:**
1. Navigate to `/products`
2. Click on a product
3. View product details

**Expected Results:**
- ✅ Redirected to `/products/{id}`
- ✅ Shows: Title, Story, Price, Stock
- ✅ Shows product image (if available)
- ✅ "Add to Cart" button visible
- ✅ Heritage origin displayed (if available)

---

### TC-012: Add to Cart - Not Logged In

**Objective:** Verify authentication required for cart

**Test Steps:**
1. Logout if logged in
2. Navigate to product detail
3. Click "Add to Cart"

**Expected Results:**
- ✅ Alert: "Please login first"
- ✅ Redirected to login page
- ✅ Product NOT added to cart

---

### TC-013: Add to Cart - Success

**Objective:** Verify customer can add product to cart

**Preconditions:** Logged in as customer

**Test Steps:**
1. Navigate to product detail
2. Note the product stock
3. Click "Add to Cart"
4. Navigate to `/cart`

**Expected Results:**
- ✅ Success message: "Product added to cart"
- ✅ Product appears in cart
- ✅ Quantity: 1
- ✅ Price displayed correctly
- ✅ Cart badge shows item count

---

### TC-014: View Cart

**Objective:** Verify cart displays correctly

**Preconditions:** Items in cart

**Test Steps:**
1. Login as customer
2. Navigate to `/cart`
3. View cart items

**Expected Results:**
- ✅ All cart items displayed
- ✅ Shows: Title, Quantity, Price, Total
- ✅ Subtotal calculated correctly
- ✅ "Remove" button for each item
- ✅ "Proceed to Checkout" button visible

---

### TC-015: Remove from Cart

**Objective:** Verify removing items from cart

**Test Steps:**
1. Navigate to `/cart`
2. Click "Remove" on an item
3. Confirm removal

**Expected Results:**
- ✅ Item removed from cart
- ✅ Cart total updated
- ✅ Success message displayed
- ✅ Cart badge updated

---

### TC-016: Empty Cart Message

**Objective:** Verify empty cart state

**Test Steps:**
1. Remove all items from cart
2. View cart page

**Expected Results:**
- ✅ Shows "Your cart is empty" message
- ✅ Shows cart icon
- ✅ "Browse Products" button displayed
- ✅ No checkout button

---

## 4. Checkout & Orders

### TC-017: Checkout Process - Complete

**Objective:** Verify complete checkout flow

**Preconditions:** 
- Logged in as customer
- Items in cart
- Product stock available

**Test Steps:**
1. Add product to cart (note stock: e.g., 10)
2. Navigate to `/cart`
3. Click "Proceed to Checkout"
4. Fill shipping information:
   - Address: "123 Test Street, Manila, Philippines"
   - Contact: "09123456789"
   - Notes: "Please call before delivery"
5. Click "Place Order"
6. Note order ID from confirmation

**Expected Results:**
- ✅ Redirected to checkout page
- ✅ Order summary displayed
- ✅ Total calculated with tax (12%)
- ✅ Payment method: Cash on Delivery
- ✅ Order created successfully
- ✅ Redirected to order confirmation page
- ✅ Cart cleared after order
- ✅ **Product stock reduced** (e.g., 10 → 9)

**Test Data:**
```json
{
  "shipping_address": "123 Test Street, Manila, Philippines",
  "contact_number": "09123456789",
  "notes": "Please call before delivery",
  "payment_method": "cash_on_delivery"
}
```

---

### TC-018: Checkout - Insufficient Stock

**Objective:** Verify stock validation during checkout

**Test Steps:**
1. Add product to cart with quantity > stock
2. Attempt checkout

**Expected Results:**
- ✅ Error message: "Not enough stock available"
- ✅ Checkout prevented
- ✅ User informed of available stock

---

### TC-019: Checkout - Weaver Cannot Order

**Objective:** Verify weavers cannot place orders

**Test Steps:**
1. Login as weaver
2. Try to access checkout page

**Expected Results:**
- ✅ Error: "Weavers cannot place orders"
- ✅ Checkout prevented
- ✅ Appropriate error message displayed

---

### TC-020: Order Confirmation Page

**Objective:** Verify order confirmation displays correctly

**Test Steps:**
1. Complete checkout
2. View order confirmation page

**Expected Results:**
- ✅ Shows order ID
- ✅ Shows order items
- ✅ Shows total amount
- ✅ Shows shipping address
- ✅ Shows order status (Pending)
- ✅ Success message displayed

---

## 5. Order Management (Weaver)

### TC-021: View Orders - Weaver Dashboard

**Objective:** Verify weaver can view orders

**Preconditions:** 
- Customer placed order with weaver's product
- Logged in as weaver

**Test Steps:**
1. Navigate to Weaver Dashboard
2. Click "View Orders" button
3. View orders page

**Expected Results:**
- ✅ Redirected to `/weaver/orders`
- ✅ Orders table displayed
- ✅ Shows orders containing weaver's products ONLY
- ✅ Displays: Order #, Customer, Products, Amount, Status, Date
- ✅ Shows customer name and email
- ✅ Shows correct product details

---

### TC-022: Confirm Order - Processing

**Objective:** Verify weaver can confirm order

**Test Steps:**
1. Navigate to `/weaver/orders`
2. Find order with status "Pending"
3. Click "Update Status" button
4. Select status: "Processing"
5. Add note: "Order confirmed, preparing items"
6. Click "Update Order"

**Expected Results:**
- ✅ Modal opens with status options
- ✅ Status updated to "Processing"
- ✅ Notes saved with weaver name prefix
- ✅ Success message displayed
- ✅ Status badge changes to blue "📦 Processing"
- ✅ Order list refreshes

---

### TC-023: Update Order - Shipped

**Objective:** Verify weaver can mark order as shipped

**Test Steps:**
1. Find order with status "Processing"
2. Click "Update Status"
3. Select: "Shipped"
4. Add note: "Shipped via LBC, Tracking: ABC123"
5. Click "Update Order"

**Expected Results:**
- ✅ Status updated to "Shipped"
- ✅ Tracking info saved in notes
- ✅ Status badge changes to "🚚 Shipped"
- ✅ Success message displayed

---

### TC-024: Complete Order - Delivered

**Objective:** Verify weaver can mark order as delivered

**Test Steps:**
1. Find order with status "Shipped"
2. Click "Update Status"
3. Select: "Delivered"
4. Add note: "Successfully delivered"
5. Click "Update Order"

**Expected Results:**
- ✅ Status updated to "Delivered"
- ✅ Status badge changes to "✅ Delivered"
- ✅ "Update Status" button disappears
- ✅ Order cannot be modified further

---

### TC-025: Cannot Modify Completed Order

**Objective:** Verify delivered orders are locked

**Test Steps:**
1. Find order with status "Delivered"
2. Look for "Update Status" button

**Expected Results:**
- ✅ No "Update Status" button visible
- ✅ Order is read-only
- ✅ Cannot change status

---

### TC-026: Weaver Order Filtering

**Objective:** Verify weaver only sees their orders

**Test Steps:**
1. Login as weaver
2. View orders
3. Check all displayed products

**Expected Results:**
- ✅ Only shows orders with weaver's products
- ✅ Weaver subtotal calculated correctly
- ✅ Filters out other weavers' products
- ✅ Multi-weaver orders show only weaver's items

---

## 6. Stock Management

### TC-027: Stock Deduction on Checkout

**Objective:** Verify stock is deducted automatically

**Test Steps:**
1. Note product stock (e.g., Stock: 15)
2. Login as customer
3. Add product to cart (Qty: 3)
4. Complete checkout
5. Check product stock again

**Expected Results:**
- ✅ Initial stock: 15
- ✅ Order quantity: 3
- ✅ **New stock: 12** (15 - 3)
- ✅ Stock updated immediately after checkout
- ✅ Stock visible on product page

**Calculation:**
```
Initial Stock: 15
Order Quantity: 3
Expected Stock: 15 - 3 = 12 ✅
```

---

### TC-028: Stock Validation - Prevent Overselling

**Objective:** Verify cannot order more than available

**Test Steps:**
1. Find product with stock = 5
2. Try to add 10 to cart
3. Attempt checkout

**Expected Results:**
- ✅ Error: "Not enough stock available"
- ✅ Shows available stock count
- ✅ Checkout prevented
- ✅ Stock unchanged

---

### TC-029: Stock Restoration on Cancellation

**Objective:** Verify stock restored when order cancelled

**Test Steps:**
1. Note product stock (e.g., 10)
2. Place order (Qty: 2)
3. Stock should be 8
4. Cancel the order
5. Check stock again

**Expected Results:**
- ✅ Initial: 10, After order: 8
- ✅ Order cancelled successfully
- ✅ **Stock restored: 10** (8 + 2)
- ✅ Stock immediately updated

---

### TC-030: Multiple Orders - Stock Management

**Objective:** Verify stock handles multiple orders

**Test Steps:**
1. Product stock: 20
2. Customer A orders: 5
3. Customer B orders: 8
4. Check stock

**Expected Results:**
- ✅ After A's order: 15 (20 - 5)
- ✅ After B's order: 7 (15 - 8)
- ✅ Both orders successful
- ✅ Stock accurate

---

## 7. Integration Test Scenarios

### TC-031: Complete User Journey - Customer

**Objective:** End-to-end customer flow

**Test Steps:**
1. Register new customer account with terms acceptance
2. Login
3. Browse products
4. View product detail
5. Add 2 products to cart
6. View cart
7. Proceed to checkout
8. Complete order
9. View order confirmation

**Expected Results:**
- ✅ All steps complete without errors
- ✅ Terms must be accepted to register
- ✅ Products added to cart
- ✅ Stock deducted correctly
- ✅ Order created successfully
- ✅ Cart cleared after order

---

### TC-032: Complete User Journey - Weaver

**Objective:** End-to-end weaver flow

**Test Steps:**
1. Register weaver account with terms
2. Login as weaver
3. Add new product (Stock: 20)
4. Logout
5. Login as customer
6. Order the product (Qty: 3)
7. Logout
8. Login as weaver
9. View orders
10. Confirm order (Processing)
11. Update to Shipped
12. Update to Delivered

**Expected Results:**
- ✅ Product created with stock 20
- ✅ Customer orders successfully
- ✅ Stock becomes 17 (20 - 3)
- ✅ Order appears in weaver dashboard
- ✅ Weaver sees customer details
- ✅ All status updates work
- ✅ Order locked after delivery

---

### TC-033: Multi-Weaver Order

**Objective:** Order with products from different weavers

**Test Steps:**
1. Create Weaver A with Product A (Stock: 10)
2. Create Weaver B with Product B (Stock: 15)
3. Customer adds both products to cart
4. Complete checkout
5. Login as Weaver A - check orders
6. Login as Weaver B - check orders

**Expected Results:**
- ✅ Order created with both products
- ✅ Stock A: 9, Stock B: 14
- ✅ Weaver A sees only Product A in order
- ✅ Weaver B sees only Product B in order
- ✅ Each weaver sees their subtotal
- ✅ Each can update status independently

---

## 8. Error Handling & Edge Cases

### TC-034: Invalid Login Credentials

**Test Steps:**
1. Navigate to login
2. Enter wrong email/password
3. Submit

**Expected Results:**
- ✅ Error message: "Login failed"
- ✅ Not redirected
- ✅ Form remains filled
- ✅ No token stored

---

### TC-035: Expired Token Handling

**Test Steps:**
1. Login successfully
2. Manually expire/delete token
3. Try to access protected route

**Expected Results:**
- ✅ 401 Unauthorized
- ✅ Auto-redirect to login
- ✅ Token cleared from localStorage

---

### TC-036: Cart - Product Out of Stock

**Test Steps:**
1. Add product to cart (Stock: 5, Qty: 2)
2. Another user buys all stock
3. Try to checkout

**Expected Results:**
- ✅ Error: "Not enough stock"
- ✅ Shows current stock (0)
- ✅ Suggests removing item

---

### TC-037: Order - Invalid Shipping Info

**Test Steps:**
1. Proceed to checkout
2. Leave address blank
3. Submit

**Expected Results:**
- ✅ Validation error
- ✅ Required field highlighted
- ✅ Order not created

---

## 9. Performance & Load Testing

### TC-038: Multiple Simultaneous Orders

**Objective:** Test concurrent order processing

**Test Steps:**
1. Product stock: 100
2. 10 users order simultaneously (10 each)
3. Check final stock

**Expected Results:**
- ✅ All orders processed
- ✅ Stock: 0 (100 - 100)
- ✅ No negative stock
- ✅ No race conditions

---

## Test Execution Summary Template

```
TEST EXECUTION REPORT
=====================
Date: __________
Tester: __________
Environment: Development / Staging / Production

Total Test Cases: 38
Passed: ___
Failed: ___
Blocked: ___
Not Executed: ___

Pass Rate: ____%

Critical Issues Found:
1. 
2. 

Medium Issues Found:
1. 
2. 

Notes:
- 
- 
```

---

## Priority Classification

### 🔴 **Critical (P0)** - Must Pass
- TC-003: User Login
- TC-006: Add Product
- TC-013: Add to Cart
- TC-017: Checkout Process
- TC-027: Stock Deduction
- TC-021: View Orders (Weaver)
- TC-022: Confirm Order

### 🟡 **High (P1)** - Should Pass
- TC-001: Registration with Terms
- TC-010: Browse Products
- TC-015: Remove from Cart
- TC-023: Update Order Status
- TC-029: Stock Restoration

### 🟢 **Medium (P2)** - Nice to Have
- TC-002: Terms Modal
- TC-008: Delete Product
- TC-020: Order Confirmation
- TC-025: Cannot Modify Completed

### 🔵 **Low (P3)** - Optional
- TC-016: Empty Cart Message
- TC-034: Invalid Login
- TC-037: Invalid Shipping

---

## Automated Test Script Example

```javascript
// Example Cypress test
describe('Checkout Flow', () => {
  it('TC-017: Complete checkout process', () => {
    // Login
    cy.visit('/login')
    cy.get('[type="email"]').type('user@example.com')
    cy.get('[type="password"]').type('password')
    cy.get('[type="submit"]').click()
    
    // Get initial stock
    cy.visit('/products')
    cy.get('.product-stock').first().invoke('text').as('initialStock')
    
    // Add to cart
    cy.get('.product-card').first().click()
    cy.get('[data-testid="add-to-cart"]').click()
    
    // Checkout
    cy.visit('/cart')
    cy.get('[data-testid="checkout-btn"]').click()
    
    // Fill shipping
    cy.get('[name="shipping_address"]').type('123 Test St')
    cy.get('[name="contact_number"]').type('09123456789')
    cy.get('[type="submit"]').click()
    
    // Verify
    cy.url().should('include', '/order-confirmation')
    cy.get('.order-status').should('contain', 'Pending')
    
    // Verify stock reduced
    cy.visit('/products')
    cy.get('.product-stock').first().should('not.contain', '@initialStock')
  })
})
```

---

## Test Data Requirements

### Users
```sql
-- Weaver
INSERT INTO users (name, email, password, role) 
VALUES ('John Weaver', 'weaver@example.com', '$2y$12$...', 'weaver');

-- Customer  
INSERT INTO users (name, email, password, role)
VALUES ('Jane User', 'user@example.com', '$2y$12$...', 'user');
```

### Products
```sql
INSERT INTO products (title, story, price, stock, weaver_id)
VALUES 
('Handwoven Basket', 'Traditional bamboo basket', 500.00, 20, 1),
('Woven Mat', 'Traditional sleeping mat', 800.00, 15, 1);
```

---

## Notes for Testers

1. **Always start with fresh seeded data** for consistent results
2. **Test on different browsers**: Chrome, Firefox, Safari, Edge
3. **Test responsive design**: Desktop, Tablet, Mobile
4. **Clear browser cache** between test runs
5. **Check browser console** for JavaScript errors
6. **Verify network requests** in DevTools
7. **Test with slow internet** connection
8. **Verify database changes** after operations

---

## Success Criteria

✅ All P0 (Critical) tests pass  
✅ 95%+ of P1 (High) tests pass  
✅ No critical security vulnerabilities  
✅ Stock management is accurate  
✅ Order flow works end-to-end  
✅ Authentication is secure  
✅ No data loss or corruption  

---

**Document Version:** 1.0  
**Last Updated:** October 13, 2025  
**Status:** Ready for Testing 🚀

