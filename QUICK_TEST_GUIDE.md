# Quick Test Guide - Weaver Order Management

## 🚀 Quick Start: Test the Complete Flow

### Prerequisites
✅ Backend seeded with test data (already done)  
✅ Backend running on `http://127.0.0.1:8000`  
✅ Frontend running on `http://localhost:3000`

---

## 📋 Test Accounts

### Weaver Account
- **Email:** weaver@example.com
- **Password:** password
- **Role:** weaver
- **Can:** Manage products, view and confirm orders

### Customer Account
- **Email:** user@example.com
- **Password:** password
- **Role:** user
- **Can:** Browse products, add to cart, checkout

---

## ✅ Complete Test Flow (5 minutes)

### Part 1: Customer Places Order (2 min)

1. **Login as Customer**
   ```
   Email: user@example.com
   Password: password
   ```

2. **Browse Products**
   - Go to "Products" page
   - You should see products from the weaver
   - Click on a product to view details

3. **Add to Cart**
   - Click "Add to Cart" button
   - ✅ Check: Product added successfully message
   - Go to Cart page (🛒 icon in header)

4. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping information:
     ```
     Address: 123 Test Street, Manila
     Contact: 09123456789
     Notes: Test order
     ```
   - Click "Place Order"
   - ✅ Check: Order created successfully
   - ✅ Check: Cart is now empty
   - Note the Order ID

5. **Verify Stock Deduction**
   - Go back to Products
   - View the product you ordered
   - ✅ Check: Stock is reduced

---

### Part 2: Weaver Manages Order (3 min)

6. **Logout and Login as Weaver**
   - Logout from customer account
   - Login with:
     ```
     Email: weaver@example.com
     Password: password
     ```

7. **Access Order Dashboard**
   - Go to "Weaver Dashboard"
   - Click "📋 View Orders" button
   - ✅ Check: You see the order you just placed

8. **View Order Details**
   - ✅ Check: Customer name is "Jane User"
   - ✅ Check: Product details are correct
   - ✅ Check: Status is "⏳ Pending"
   - ✅ Check: Amount matches your product price

9. **Confirm Order (Processing)**
   - Click "📝 Update Status" button
   - Select status: "📦 Processing"
   - Add note: "Order confirmed, preparing items"
   - Click "✅ Update Order"
   - ✅ Check: Status changed to "📦 Processing"
   - ✅ Check: Success message appears

10. **Mark as Shipped**
    - Click "📝 Update Status" again
    - Select status: "🚚 Shipped"
    - Add note: "Shipped via LBC, Tracking: TEST123"
    - Click "✅ Update Order"
    - ✅ Check: Status changed to "🚚 Shipped"

11. **Mark as Delivered**
    - Click "📝 Update Status" again
    - Select status: "✅ Delivered"
    - Add note: "Successfully delivered"
    - Click "✅ Update Order"
    - ✅ Check: Status changed to "✅ Delivered"
    - ✅ Check: "Update Status" button disappears (order complete)

---

## 🎯 What to Verify

### Stock Management ✅
- [ ] Stock deducted when customer checks out
- [ ] Correct quantity is deducted
- [ ] Stock shows updated count in product list

### Order Flow ✅
- [ ] Order appears in weaver's dashboard immediately
- [ ] Weaver sees correct customer details
- [ ] Weaver sees correct product details
- [ ] Weaver sees correct amount

### Status Updates ✅
- [ ] Can update from Pending → Processing
- [ ] Can update from Processing → Shipped
- [ ] Can update from Shipped → Delivered
- [ ] Cannot update Delivered or Cancelled orders
- [ ] Notes are saved with updates
- [ ] Status badges show correct colors

### UI/UX ✅
- [ ] "View Orders" button visible in Weaver Dashboard
- [ ] Orders page loads without errors
- [ ] Modal dialog works for status updates
- [ ] Success/error messages appear
- [ ] Table displays all order information

---

## 🐛 Common Issues & Solutions

### Issue: Order doesn't appear in weaver dashboard
**Solution:** 
- Make sure you're logged in as the weaver who created the product
- Refresh the page
- Check browser console for errors

### Issue: Can't update order status
**Solution:**
- Ensure order is not already Delivered or Cancelled
- Check that you're the weaver who owns the product
- Verify you're logged in with correct account

### Issue: Stock not deducting
**Solution:**
- Check backend logs for errors
- Verify database connection
- Make sure checkout completed successfully

---

## 📊 Expected Results Summary

| Action | Expected Result |
|--------|----------------|
| Customer checkout | ✅ Order created, stock deducted, cart cleared |
| Weaver views orders | ✅ Order appears with correct details |
| Update to Processing | ✅ Status changes, notes saved |
| Update to Shipped | ✅ Status changes, tracking info saved |
| Update to Delivered | ✅ Status changes, order locked from further updates |

---

## 🎨 Visual Guide

### Customer Flow:
```
Login → Browse Products → Add to Cart → Checkout → Order Created
                                                         ↓
                                                   Stock Reduced ✅
```

### Weaver Flow:
```
Login → Dashboard → View Orders → See Customer Order
                                         ↓
                                 Update to Processing
                                         ↓
                                   Update to Shipped
                                         ↓
                                  Update to Delivered ✅
```

---

## ✨ Success Indicators

You've successfully tested the feature when:

1. ✅ Customer can complete checkout
2. ✅ Stock is automatically deducted
3. ✅ Order appears in weaver's dashboard
4. ✅ Weaver can see customer and product details
5. ✅ Weaver can update order status
6. ✅ Status changes are reflected immediately
7. ✅ Completed orders can't be modified
8. ✅ UI is responsive and user-friendly

---

## 🚀 You're All Set!

Your Kultura marketplace now has:
- ✅ Complete authentication system
- ✅ Product management for weavers
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ **Automatic stock management**
- ✅ **Weaver order dashboard**
- ✅ **Order status tracking**

The entire order flow is working from customer checkout to weaver confirmation! 🎉

