# Internship Report

## Introduction

This internship project focused on extending an existing full-stack social media application named miniX. miniX is a Twitter/X-inspired platform where users can register, login, create posts, like, comment, follow users, bookmark posts, search users, and receive notifications.

The assigned internship tasks were implemented inside the existing miniX application instead of building separate projects. This helped keep the work integrated, realistic, and aligned with the application structure.

## Background

The miniX project was built using a modern full-stack architecture. The frontend uses Next.js, TypeScript, and Tailwind CSS. Authentication is handled using Firebase Authentication. The backend uses Node.js, Express.js, MongoDB, Mongoose, and Firebase Admin SDK.

The internship assignments required implementing advanced features such as browser notifications, audio tweets, OTP verification, forgot password, payment-based subscriptions, multi-language support, and login security tracking.

## Learning Objectives

The main learning objectives were:

- Understand how to extend an existing full-stack project
- Implement secure OTP-based verification flows
- Work with browser APIs such as Notification API and MediaRecorder API
- Store and manage user activity data in MongoDB
- Integrate payment gateway functionality
- Add subscription-based feature limits
- Implement multi-language support
- Improve authentication security using browser, device, and IP tracking
- Prepare production-level code structure and documentation

## Activities and Tasks

### Browser Notification API

A browser notification feature was implemented to detect tweets containing important keywords such as `cricket` or `science`. When a matching tweet is created, the browser shows a popup notification with the full tweet content. Users can enable or disable this feature from settings.

### Audio Tweet Feature

An audio tweet feature was added to allow users to record or upload audio. OTP verification is required before uploading an audio tweet. The system validates the audio file size, duration, and upload time window. Audio uploads are allowed only between 2:00 PM and 7:00 PM IST.

### Forgot Password Feature

A forgot password page was implemented where users can reset their password using registered email or phone number. The system allows only one password reset request per day. A random password is generated using only uppercase and lowercase letters and is updated using Firebase Admin SDK.

### Subscription and Payment Feature

Subscription-based tweet limits were implemented using Free, Bronze, Silver, and Gold plans. Razorpay payment integration was added for paid plans. After successful payment verification, the user’s plan is updated, an invoice is generated, and an invoice email is sent.

### Multi-language Support

Multi-language support was added for English, Spanish, Hindi, Portuguese, Chinese, and French. A language settings section allows users to request language changes. French language switching requires email OTP, while other languages require mobile OTP flow.

### Login History and Security

Login history tracking was implemented to store browser type, operating system, device category, IP address, login time, and login status. Login security rules were also added. Chrome login requires email OTP, Microsoft Edge login is allowed without OTP, and mobile login is restricted to 10:00 AM to 1:00 PM IST.

## Skills and Competencies

During this internship work, the following skills were practiced and improved:

- Next.js frontend development
- TypeScript usage
- Tailwind CSS UI development
- Express.js backend development
- MongoDB and Mongoose schema design
- Firebase Authentication
- Firebase Admin SDK
- OTP verification flow
- Email sending using Nodemailer
- Cloudinary file upload
- Razorpay payment integration
- Browser Notification API
- MediaRecorder API
- User-agent parsing
- API security and middleware design
- Deployment debugging

## Feedback and Evidence

Evidence for the completed work includes:

- Source code files
- Running frontend and backend application
- Screenshots of implemented features
- Browser notification popup screenshots
- OTP email screenshots
- Audio tweet upload screenshots
- Login history screenshots
- Subscription plan screenshots
- Razorpay checkout screenshots
- Invoice email screenshots
- Language settings screenshots

## Challenges and Solutions

### Challenge 1: Integrating tasks into existing project

The assignment required all features to be integrated into the existing application instead of being created separately.

Solution:
All features were implemented inside the miniX project structure using existing authentication, backend APIs, MongoDB models, and frontend pages.

### Challenge 2: Firebase authentication with custom backend logic

Firebase handles login and password authentication, but the tasks required custom backend rules such as Chrome OTP login and forgot password limits.

Solution:
Firebase login was completed first, then backend protected routes were used to apply additional custom rules using Firebase Admin SDK and MongoDB tracking models.

### Challenge 3: OTP reuse across multiple features

Multiple features required OTP verification.

Solution:
A reusable OTP model and OTP APIs were created with purpose-based verification. The same OTP system can support audio upload, language switching, forgot password, and login verification.

### Challenge 4: Time-based restrictions

Audio uploads and payments required time restrictions based on IST.

Solution:
Backend time checks were implemented using `Intl.DateTimeFormat` with the `Asia/Kolkata` timezone.

### Challenge 5: Live deployment issues

Some features worked locally but did not immediately reflect on live deployment.

Solution:
Frontend deployment on Vercel and backend deployment on Render were checked separately. Environment variables, CORS, branch deployment, and redeploy steps were reviewed.

## Outcomes and Impact

The miniX project was enhanced from a basic social media clone into a more advanced full-stack platform with security, payments, audio uploads, multilingual support, and user activity tracking.

The project now demonstrates real-world full-stack development concepts such as authentication, protected APIs, file uploads, payment verification, email services, database models, user preferences, and deployment workflows.

## Conclusion

This internship project helped improve practical full-stack development skills by implementing advanced features inside an existing application. The work provided deeper understanding of frontend-backend communication, authentication, OTP verification, payment integration, database design, browser APIs, and deployment debugging.

The final miniX project is a complete full-stack application with multiple real-world features and a structured codebase suitable for demonstration, submission, and further improvement.