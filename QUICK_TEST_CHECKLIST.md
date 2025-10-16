# ✅ Quick Test Checklist - Kultura System

## Pre-Testing Setup
- [ ] Backend running: `http://127.0.0.1:8000`
- [ ] Frontend running: `http://localhost:3000`
- [ ] Database seeded: `php artisan db:seed`
- [ ] Browser DevTools open (check console)

---

## 🔴 Critical Tests (Must Pass)

### 1. Registration & Login
- [ ] ✅ **TC-001:** Register with Terms checkbox
  - [ ] Cannot submit without checking terms
  - [ ] Terms modal opens and displays content
  - [ ] "I Agree" button checks the box
  - [ ] Account created successfully
  
- [ ] ✅ **TC-003:** Customer Login
  - Email: `user@example.com` | Password: `password`
  - [ ] Login successful
  - [ ] Name shows in header
  - [ ] Cart icon visible

- [ ] ✅ **TC-004:** Weaver Login  
  - Email: `weaver@example.com` | Password: `password`
  - [ ] Login successful
  - [ ] Can access `/dashboard`
  - [ ] "View Orders" button visible

---

### 2. Product Management (Weaver)
- [ ] ✅ **TC-006:** Add Product
  - [ ] Fill: Title, Story, Price (500), Stock (20)
  - [ ] Product created successfully
  - [ ] Shows in products table
  - [ ] Stock displays: 20

- [ ] ✅ **TC-008:** Delete Product
  - [ ] Click delete button
  - [ ] Confirmation dialog appears
  - [ ] Product removed from list

---

### 3. Shopping & Cart (Customer)
- [ ] ✅ **TC-010:** Browse Products
  - [ ] Go to `/products`
  - [ ] Products display correctly
  - [ ] Prices and stock visible

- [ ] ✅ **TC-011:** View Product Detail
  - [ ] Click on a product
  - [ ] Full details shown
  - [ ] "Add to Cart" button visible

- [ ] ✅ **TC-012:** Add to Cart (Not Logged In)
  - [ ] Logout first
  - [ ] Try to add product
  - [ ] Redirected to login

- [ ] ✅ **TC-013:** Add to Cart (Success)
  - [ ] Login as customer
  - [ ] Click "Add to Cart"
  - [ ] Success message shown
  - [ ] Item in cart

- [ ] ✅ **TC-015:** Remove from Cart
  - [ ] Go to `/cart`
  - [ ] Click "Remove"
  - [ ] Item removed
  - [ ] Total updated

---

### 4. Checkout & Stock Deduction
- [ ] ✅ **TC-017:** Complete Checkout ⭐ MOST IMPORTANT
  ```
  BEFORE: Product stock = ____
  
  1. Add product to cart
  2. Go to cart → Click "Checkout"
  3. Fill shipping info:
     - Address: "123 Test St, Manila"
     - Contact: "09123456789"
  4. Click "Place Order"
  5. Note Order ID: #____
  
  AFTER: Product stock = ____ (should be reduced!)
  
  ✅ Stock deducted correctly
  ✅ Cart cleared
  ✅ Order confirmation shown
  ```

---

### 5. Order Management (Weaver)
- [ ] ✅ **TC-021:** View Orders
  - [ ] Login as weaver
  - [ ] Click "View Orders"
  - [ ] Order from customer visible
  - [ ] Customer details shown
  - [ ] Products and amount correct

- [ ] ✅ **TC-022:** Confirm Order (Processing)
  - [ ] Find "Pending" order
  - [ ] Click "Update Status"
  - [ ] Select "Processing"
  - [ ] Add note: "Confirmed"
  - [ ] Click "Update Order"
  - [ ] Status changes to 📦 Processing

- [ ] ✅ **TC-023:** Update to Shipped
  - [ ] Click "Update Status"
  - [ ] Select "Shipped"
  - [ ] Add note: "Tracking: TEST123"
  - [ ] Status changes to 🚚 Shipped

- [ ] ✅ **TC-024:** Mark as Delivered
  - [ ] Click "Update Status"
  - [ ] Select "Delivered"
  - [ ] Status changes to ✅ Delivered
  - [ ] "Update Status" button disappears

---

### 6. Stock Management
- [ ] ✅ **TC-027:** Stock Deduction Test
  ```
  Test Case:
  1. Product initial stock: 15
  2. Order quantity: 3
  3. Expected new stock: 12
  
  Actual Result:
  - Initial: ____
  - Ordered: ____  
  - Final: ____ ✅/❌
  ```

- [ ] ✅ **TC-029:** Stock Restoration (Cancel)
  ```
  1. Stock before order: 10
  2. Order quantity: 2
  3. Stock after order: 8
  4. Cancel order
  5. Stock restored to: 10 ✅/❌
  ```

---

## 🟡 Integration Tests

### Complete Customer Flow (TC-031)
- [ ] 1. Register new account with terms ✅
- [ ] 2. Login successfully ✅
- [ ] 3. Browse products ✅
- [ ] 4. Add to cart ✅
- [ ] 5. View cart ✅
- [ ] 6. Checkout ✅
- [ ] 7. Order created ✅
- [ ] 8. Stock deducted ✅

### Complete Weaver Flow (TC-032)
- [ ] 1. Register weaver account ✅
- [ ] 2. Add product (Stock: 20) ✅
- [ ] 3. Customer orders (Qty: 3) ✅
- [ ] 4. Stock becomes 17 ✅
- [ ] 5. View orders ✅
- [ ] 6. Confirm (Processing) ✅
- [ ] 7. Ship order ✅
- [ ] 8. Mark delivered ✅

---

## 🔍 Quick Verification Checklist

### Authentication
- [ ] Terms checkbox required ✅
- [ ] Terms modal works ✅
- [ ] Login redirects correctly ✅
- [ ] Logout clears session ✅

### Product Management
- [ ] Weaver can add products ✅
- [ ] Products show in dashboard ✅
- [ ] Can delete products ✅

### Shopping
- [ ] Products browsable ✅
- [ ] Cart add/remove works ✅
- [ ] Cart shows correct totals ✅

### Checkout
- [ ] Checkout form validates ✅
- [ ] Order creates successfully ✅
- [ ] **Stock deducts immediately** ✅
- [ ] Cart clears after order ✅

### Order Management
- [ ] Weaver sees orders ✅
- [ ] Status updates work ✅
- [ ] Notes save correctly ✅
- [ ] Delivered orders locked ✅

### Stock Management
- [ ] Deducts on checkout ✅
- [ ] Prevents overselling ✅
- [ ] Restores on cancel ✅

---

## 🐛 Common Issues to Check

- [ ] No console errors in browser
- [ ] No 404 errors in network tab
- [ ] Images load correctly
- [ ] Forms validate before submit
- [ ] Success/error messages display
- [ ] Redirects work correctly
- [ ] Database updates persist
- [ ] Stock numbers are accurate
- [ ] Authorization works (role-based)
- [ ] Token expires and redirects

---

## 📊 Test Results Summary

**Date:** ___________  
**Tester:** ___________

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Auth & Registration | 5 | ___ | ___ |
| Product Management | 4 | ___ | ___ |
| Shopping & Cart | 7 | ___ | ___ |
| Checkout & Orders | 4 | ___ | ___ |
| Order Management | 6 | ___ | ___ |
| Stock Management | 4 | ___ | ___ |
| **TOTAL** | **30** | ___ | ___ |

**Pass Rate:** ____%

---

## ✅ Sign-Off

- [ ] All critical tests passed
- [ ] Stock management verified
- [ ] Order flow works end-to-end
- [ ] No critical bugs found
- [ ] Terms & conditions enforced
- [ ] Authentication secure
- [ ] Ready for deployment

**Approved By:** ___________  
**Date:** ___________  
**Signature:** ___________

---

## 🚀 Quick Commands

### Start Backend
```bash
cd backend
php artisan serve
```

### Start Frontend
```bash
cd frontend
npm start
```

### Reset Database
```bash
cd backend
php artisan migrate:fresh --seed
```

### Check Logs
```bash
# Backend logs
tail -f backend/storage/logs/laravel.log

# Frontend console
# Open browser DevTools → Console tab
```

---

## 📝 Notes Section

**Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Observations:**
1. ________________________________
2. ________________________________

**Recommendations:**
1. ________________________________
2. ________________________________

---

**Happy Testing! 🧪✨**

