# Quick Reference Card - Watchlist API

## 🚀 Quick Start

### Run Backend
```bash
cd PriceBazar_Client
node server.js
# Server running on port 3000
```

### Run Frontend  
```bash
npm run dev
# Local: http://localhost:5173
```

---

## 📡 API Endpoints (Quick Reference)

### 1. GET Watchlist (Enriched Data)
```
GET http://localhost:3000/api/watchlist/USER_UID
```
**Returns:** Full product details for all watchlisted items

### 2. Add to Watchlist
```
POST http://localhost:3000/api/watchlist
Body: { userId, productId }
```
**Returns:** Success message + item count

### 3. Remove from Watchlist
```
DELETE http://localhost:3000/api/watchlist/USER_UID/PRODUCT_ID
```
**Returns:** Success message

---

## 📊 Data Model

### Watchlist Item (Enriched)
```javascript
{
  _id: "MongoDB ObjectId",           // Product ID
  name: "Product Name",              // Display name
  itemName: "Product Name",          // Alternative name
  marketName: "BDT",                 // Market/Currency
  price: 9999.99,                    // Product price
  image: "https://...",              // Product image URL
  description: "Description",        // Product description
  vendor: "Vendor Name",             // Seller info
  addedDate: "2025-04-11T19:59:15"  // When added to watchlist
}
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Express backend with enriched APIs |
| `src/layouts/DashBoardComponents/Watchlist.jsx` | Watchlist display component |
| `src/pages/Products/ProductDetails.jsx` | Add to watchlist button |
| `API_DOCUMENTATION.md` | Complete API reference |
| `IMPLEMENTATION_SUMMARY.md` | What changed & why |
| `WATCHLIST_INTEGRATION_GUIDE.md` | Detailed integration guide |
| `CODE_CHANGES_DETAILED.md` | Before/after code |

---

## 🎯 Frontend Usage

### Get User's Watchlist
```javascript
const response = await axios.get(
  `http://localhost:3000/api/watchlist/${user.uid}`
);
const { watchlistItems } = response.data;
// watchlistItems is array of enriched product objects
```

### Add to Watchlist
```javascript
await axios.post('http://localhost:3000/api/watchlist', {
  userId: user.uid,
  productId: product._id
});
```

### Remove from Watchlist
```javascript
await axios.delete(
  `http://localhost:3000/api/watchlist/${user.uid}/${productId}`
);
```

---

## 🔄 Component Flow

```
Watchlist.jsx
├── useEffect()
│   └── fetchWatchlist()
│       └── GET /api/watchlist/:userId
│           └── Response: { watchlistItems: [...] }
│               └── setWatchlistItems(response.data.watchlistItems)
│                   └── Render table with items
├── handleAddMore()
│   └── navigate('/products')
├── handleRemoveClick(item)
│   └── setShowModal(true)
│   └── setSelectedItem(item)
├── handleConfirmRemove()
│   └── DELETE /api/watchlist/:userId/:productId
│       └── Remove from local state
│       └── Close modal
└── handleCancelRemove()
    └── Close modal
```

---

## ✅ Features Checklist

### Watchlist Display
- [x] Product image with fallback
- [x] Product name
- [x] Market name badge
- [x] Price in Bengali currency
- [x] Add More button
- [x] Remove button with confirmation
- [x] Total items counter
- [x] Empty state UI

### Animations & Effects
- [x] Framer Motion entrance animations
- [x] Hover effects on buttons
- [x] Loading spinner
- [x] Modal animations
- [x] Table row stagger animation

### User Experience
- [x] Toast notifications
- [x] Confirmation modal
- [x] Error handling
- [x] Loading states
- [x] Responsive design
- [x] Gradient headers
- [x] Professional styling

---

## 🐛 Debugging Checklist

### Server Issues
- [ ] Is `node server.js` running?
- [ ] Check MongoDB connection
- [ ] Look for API errors in console
- [ ] Verify port 3000 is not in use

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify API response in Network tab
- [ ] Check React DevTools for state
- [ ] Ensure user is logged in

### Data Issues
- [ ] Verify product IDs are ObjectIds
- [ ] Check MongoDB collections exist
- [ ] Ensure products have images
- [ ] Validate price field exists

---

## 📈 Performance Notes

### Database Optimization
- ✅ Single query instead of two
- ✅ Products collection must have indexes
- ✅ ObjectId conversion handled server-side

### Frontend Optimization
- ✅ Direct state update (no full re-fetch)
- ✅ Key prop on list items
- ✅ Memoized components
- ✅ Lazy image loading

### Network Optimization
- ✅ One API call per page load
- ✅ No unnecessary re-renders
- ✅ Proper error handling

---

## 🔐 Security Checklist

- [x] Uses Firebase UID for identification
- [x] Input validation on endpoints
- [x] ObjectId type checking
- [x] CORS enabled
- [x] Error messages don't leak data
- [x] No sensitive data in logs

---

## 📱 Testing URLs

### Local Testing
```
Frontend: http://localhost:5173
Backend: http://localhost:3000
Watchlist Page: http://localhost:5173/dashboard/watchlist
Product Details: http://localhost:5173/products/[productId]
```

### API Testing (with cURL)
```bash
# Get watchlist
curl http://localhost:3000/api/watchlist/USER_UID

# Add to watchlist
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"userId":"UID","productId":"ID"}'

# Remove from watchlist
curl -X DELETE \
  http://localhost:3000/api/watchlist/USER_UID/PRODUCT_ID
```

---

## 📚 Import Statements

### Frontend Imports (Watchlist.jsx)
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FaBookmark, FaPlus, FaTrash, FaExclamationTriangle, FaShoppingBag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
```

### Backend Imports (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
```

---

## 🎓 Key Concepts

1. **Enrichment** - Adding product details to watchlist response
2. **Aggregation** - Combining data from multiple collections
3. **Idempotency** - Operations can be repeated safely
4. **State Management** - React hooks for component state
5. **Error Handling** - Try-catch with user feedback
6. **Async/Await** - Promise handling
7. **REST API** - GET/POST/DELETE operations
8. **Database Indexing** - Fast query performance

---

## 🚀 Common Tasks

### Add New Feature
1. Update API endpoint in `server.js`
2. Update frontend component in `Watchlist.jsx`
3. Test API response in Postman/cURL
4. Test UI in browser
5. Verify error handling

### Debug Watchlist Not Showing
1. Check browser console
2. Verify API response in Network tab
3. Ensure user is logged in
4. Check MongoDB has watchlist data
5. Verify product IDs are valid ObjectIds

### Add More Products to Watchlist
1. Navigate to Products page
2. Click "Add to Watchlist" (only visible for regular users)
3. Button changes to show "Remove from Watchlist"
4. Check watchlist page - product appears
5. Price and image should display correctly

---

## 📞 Support Resources

### Documentation Files
- `API_DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Changes overview
- `WATCHLIST_INTEGRATION_GUIDE.md` - Integration guide
- `CODE_CHANGES_DETAILED.md` - Before/after code
- `QUICK_REFERENCE.md` - This file

### External Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Hooks](https://react.dev/reference/react)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios Documentation](https://axios-http.com/)

---

## ✨ Pro Tips

1. **Enable Console Logging** - Use `console.log()` to debug data flow
2. **Use Browser DevTools** - Network tab shows API responses
3. **Test API Separately** - Use cURL or Postman before testing UI
4. **Check MongoDB** - Verify data exists in collections
5. **Clear Cache** - Browser cache might show old data
6. **Use React DevTools** - Check component state and props
7. **Test Error Cases** - Try removing last item, empty watchlist, etc.
8. **Performance Monitor** - Check Network tab for slow requests

---

## 🎉 You're Ready!

The watchlist system is now fully implemented with:
- ✅ Enriched backend API
- ✅ Simplified frontend component
- ✅ Complete documentation
- ✅ Error handling
- ✅ Professional UI/UX
- ✅ Animations and transitions
- ✅ Toast notifications
- ✅ Confirmation modals

**Happy coding!** 🚀

