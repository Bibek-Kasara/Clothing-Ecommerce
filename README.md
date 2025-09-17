E-commerce Web Application

This is a modern, responsive e-commerce web application built with React and TypeScript. The application provides users with a seamless shopping experience, featuring a variety of categories, product pages, shopping cart functionality, and a robust checkout system.

Key Features:

Product Pages: Displaying product details, including images, sizes, prices, and reviews.

Cart and Wishlist: Users can add products to their shopping cart and wishlist.

Order Management: Users can track their orders and view their past purchases.

Responsive Design: The application is fully responsive and works across different screen sizes.

Smooth Routing: Using React Router for seamless navigation across different pages of the app.

State Management: Utilizing Zustand for managing global states like the cart, wishlist, and orders.

Requirements to Run the Project:
1. Clone the Repository

First, clone the repository to your local machine:

git clone https://github.com/your-username/ecommerce-project.git
cd ecommerce-project

2. Install Dependencies

To install all required dependencies for the project, run:

npm install


This will install all the basic dependencies for the application.

3. Install Additional Dependencies

Run the following commands to install additional packages required to run the project:

npm add react-router-dom@latest @hookform/resolvers@latest
npm i @radix-ui/react-slot @radix-ui/react-icons
# or use pnpm instead of npm:
# pnpm add @radix-ui/react-slot @radix-ui/react-icons

npm i recharts
npm i @radix-ui/react-navigation-menu
npm i @radix-ui/react-progress
npm i @radix-ui/react-radio-group
npm i @radix-ui/react-scroll-area
npm i @radix-ui/react-select
npm i @radix-ui/react-separator
npm i @radix-ui/react-switch
npm i @radix-ui/react-toast
npm i @radix-ui/react-toggle-group
npm i @radix-ui/react-tooltip

4. Set Up Your Environment Variables

Make sure to set up your environment variables for the project. Create a .env file in the root of your project and include any necessary configuration, like API keys, URLs, and other sensitive data. Example:

VITE_USD_TO_NPR=133  # The exchange rate for USD to NPR
VITE_ESEWA_MERCHANT_ID=your_merchant_id
VITE_ESEWA_SIGNATURE_KEY=your_signature_key
VITE_CLERK_FRONTEND_API=https://your-clerk-front-end-api-url.clerk.dev
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dGVhY2hpbmctamVubmV0LTQuY2xlcmsuYWNjb3VudHMuZGV2JA


5. Run the Application

Once you have installed the dependencies and set up your environment, you can start the application by running:

npm run dev


This will start the development server and you can view the app in your browser at http://localhost:5173.

