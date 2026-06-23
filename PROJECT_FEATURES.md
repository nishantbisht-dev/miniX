# miniX Project Features

miniX is a full-stack social media platform inspired by Twitter/X. The project was built using Next.js, TypeScript, Tailwind CSS, Firebase Authentication, Node.js, Express.js, MongoDB, Mongoose, Firebase Admin SDK, Vercel, Render, Cloudinary, Nodemailer, and Razorpay.

## Core Features

- User registration and login using Firebase Authentication
- User profile creation and profile update
- Create text posts
- Like posts
- Comment on posts
- Follow and unfollow users
- Bookmark posts
- Search users
- View notifications
- View user profiles
- Responsive user interface

## Internship Task Features

### 1. Browser Notification API

The platform supports browser popup notifications when a tweet contains important keywords.

Implemented functionality:

- Detects tweets containing `cricket` or `science`
- Shows browser popup notification with full tweet content
- Allows users to enable or disable browser keyword notifications from settings
- Respects user notification preference
- Uses browser Notification API

### 2. Audio Tweet Feature

The platform supports audio tweets.

Implemented functionality:

- Users can record audio using microphone
- Users can upload audio files
- Audio OTP verification is required before upload
- Audio duration limit is 5 minutes
- Audio file size limit is 100 MB
- Audio tweets are allowed only between 2:00 PM and 7:00 PM IST
- Audio files are uploaded to Cloudinary
- Audio tweets are displayed with an audio player

### 3. Forgot Password Feature

The platform includes a custom forgot password system.

Implemented functionality:

- Dedicated forgot password page
- Users can reset password using registered email or phone number
- Password reset can be requested only once per day
- Shows warning if user tries again on the same day
- Generates a random password using only uppercase and lowercase letters
- Updates password using Firebase Admin SDK
- Sends generated password to registered email

### 4. Subscription Plans and Payment

The platform supports subscription-based tweet limits.

Plans:

- Free Plan: 1 tweet per month
- Bronze Plan: ₹100/month, 3 tweets per month
- Silver Plan: ₹300/month, 5 tweets per month
- Gold Plan: ₹1000/month, unlimited tweets

Implemented functionality:

- Subscription plans page
- Tweet limit middleware
- Monthly tweet limit check
- Automatic downgrade to free if subscription expires
- Razorpay order creation
- Razorpay payment verification
- Invoice generation
- Invoice email after successful payment
- Payment allowed only between 10:00 AM and 11:00 AM IST

### 5. Multi-language Support

The platform supports six languages.

Supported languages:

- English
- Spanish
- Hindi
- Portuguese
- Chinese
- French

Implemented functionality:

- Preferred language stored in user profile
- Language settings page
- Translation dictionary
- Basic UI translation support
- French language switch requires email OTP
- Other language switches require mobile OTP structure
- Language is changed only after OTP verification

### 6. Login History and Login Security

The platform stores login session details for transparency and security.

Implemented functionality:

- Stores browser type
- Stores operating system
- Stores device category
- Stores IP address
- Stores login status and reason
- Shows login history in settings
- Chrome login requires email OTP verification
- Microsoft Edge login is allowed without extra OTP
- Mobile login is allowed only between 10:00 AM and 1:00 PM IST

## Deployment

Frontend:

- Vercel

Backend:

- Render

Database:

- MongoDB Atlas

Authentication:

- Firebase Authentication

File Upload:

- Cloudinary

Payment:

- Razorpay