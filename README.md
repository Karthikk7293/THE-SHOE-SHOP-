# The Shoe Shop API

Express and MongoDB shoe-store backend with product, order, coupon, account, and payment routes.

## Project scope

The checked-in application package starts the Express backend. Configure MongoDB and the email, upload, and payment integrations referenced by the controllers before exercising connected workflows.

## Run locally

Install Node.js and the package manager used below. Run each command block from the repository root; separate frontend/backend processes use separate terminals.

Root application:

```sh
npm install
npm run dev
```

## Source guide

- [backend/server.js](backend/server.js)
- [backend/controllers/couponControllers.js](backend/controllers/couponControllers.js)
- [backend/controllers/orderController.js](backend/controllers/orderController.js)
- [backend/controllers/paymentControllers.js](backend/controllers/paymentControllers.js)
- [backend/controllers/productControllers.js](backend/controllers/productControllers.js)
- [backend/controllers/userController.js](backend/controllers/userController.js)
