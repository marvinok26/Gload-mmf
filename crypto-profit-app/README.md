Crypto Profit Mining App
A mobile application built with React Native and Expo that enables users to mine cryptocurrency profits through a virtual mining system. The app allows users to deposit USDT, purchase miners, earn daily profits, and refer friends for additional income.
Features

User Authentication: Complete registration and login system
Crypto Deposits: Generate unique deposit addresses via CoinPayments integration
Virtual Mining: Purchase miners that generate daily profits
Dashboard Visualization: Animated mining visualization and profit stats
Referral System: Earn commissions by inviting friends
Withdrawal System: Request withdrawals to your personal wallet

Tech Stack
Frontend

React Native with Expo
NativeWind (Tailwind CSS for React Native)
Shoutem UI components
React Navigation
React Context API for state management
AsyncStorage for local data persistence

Backend

Node.js with Fastify
MongoDB with Mongoose
JWT Authentication
CoinPayments API integration for crypto transactions
SendGrid/Nodemailer for email notifications

Getting Started
Prerequisites

Node.js (v14 or higher)
npm or yarn
MongoDB instance
CoinPayments account (for production)

Backend Setup

Clone the repository:

  git clone https://github.com/yourusername/crypto-profit-app.git
cd crypto-profit-app/crypto-profit-app-backend

Install dependencies:

  npm install

Create a .env file with the following variables:

 # App
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:19006

# Database
MONGODB_URI=mongodb://localhost:27017/crypto_profit_app

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# CoinPayments API
COINPAYMENTS_API_KEY=your_coinpayments_api_key
COINPAYMENTS_API_SECRET=your_coinpayments_api_secret
COINPAYMENTS_MERCHANT_ID=your_coinpayments_merchant_id
COINPAYMENTS_IPN_SECRET=your_coinpayments_ipn_secret

# Email
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=no-reply@yourdomain.com
EMAIL_NAME=Crypto Profit App

# Admin
ADMIN_EMAIL=admin@yourdomain.com

Start the backend server:

  npm run dev
Frontend Setup

Navigate to the frontend directory:

  cd ../crypto-profit-app

Install dependencies:

 npm install

Update the API base URL in src/constants/api.constants.js to point to your backend server.
Start the Expo development server:

 npm start

Use the Expo Go app on your mobile device or an emulator to run the application.

Project Structure
Frontend
 crypto-profit-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # App screens
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── constants/      # App constants
│   ├── assets/         # Images, animations, icons
│   └── config/         # App configuration
├── App.js              # Main app entry point
Backend
 crypto-profit-app-backend/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── models/             # Database models
├── routes/             # API routes
├── services/           # Business logic services
├── middleware/         # Express middleware
├── utils/              # Utility functions
├── webhooks/           # Payment webhook handlers
├── scripts/            # Utility scripts
└── server.js           # Main server entry point
Usage
For Users

Register an Account: Create a new account with email and password
Make a Deposit: Copy your USDT (TRC20) deposit address and make a deposit
Purchase Miners: Use your deposited funds to buy miners
Earn Profits: Watch your miners generate daily profits
Refer Friends: Share your referral code to earn commissions
Withdraw Funds: Request withdrawals to your personal wallet

For Admins
The admin manages withdrawal requests manually through the database. A future update will include an admin dashboard.
Deployment
Backend

Deploy the Node.js backend to a service like Heroku, DigitalOcean, or AWS
Set up a MongoDB Atlas cluster for the database
Configure environment variables in your deployment platform

Frontend

Build the app for production:

  expo build:android
# or
expo build:ios

Publish to app stores (Google Play Store, Apple App Store)

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgements

CoinPayments for the crypto payment processing API
Expo for the React Native development framework
NativeWind for the styling system
Shoutem UI for additional UI components