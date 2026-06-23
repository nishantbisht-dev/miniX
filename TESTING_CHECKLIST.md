# miniX Testing Checklist

This checklist is used to verify all core features and internship task features before final submission.

## Basic Project Testing

- [ ] Frontend runs successfully
- [ ] Backend runs successfully
- [ ] MongoDB connection works
- [ ] Firebase Authentication works
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Protected routes work correctly

## Core Social Features

- [ ] User can create text post
- [ ] User can like a post
- [ ] User can unlike a post
- [ ] User can comment on a post
- [ ] User can delete own post
- [ ] User can follow another user
- [ ] User can unfollow another user
- [ ] User can bookmark a post
- [ ] User can remove bookmark
- [ ] User search works
- [ ] Profile page shows user details
- [ ] Settings page allows profile update
- [ ] Notifications page works

## Task 1: Browser Notification API

- [ ] Browser notification toggle is visible in settings
- [ ] User can enable notifications
- [ ] Browser asks for notification permission
- [ ] Tweet containing `cricket` triggers popup notification
- [ ] Tweet containing `science` triggers popup notification
- [ ] Full tweet content is shown in popup
- [ ] Notification does not show when setting is disabled
- [ ] Notification does not show for tweets without target keywords

## Task 2: Audio Tweet Feature

- [ ] User can record audio
- [ ] User can stop recording
- [ ] User can upload audio file
- [ ] Non-audio file is rejected
- [ ] Audio file above 100 MB is rejected
- [ ] Audio duration above 5 minutes is rejected
- [ ] OTP is required before posting audio tweet
- [ ] OTP email is received
- [ ] Wrong OTP is rejected
- [ ] Correct OTP is accepted
- [ ] Audio upload is blocked outside 2:00 PM to 7:00 PM IST
- [ ] Audio tweet is posted during allowed time
- [ ] Audio tweet displays with audio player

## Task 3: Forgot Password

- [ ] Forgot password page opens
- [ ] User can enter registered email
- [ ] User can enter registered phone number
- [ ] Unknown email/phone is rejected
- [ ] Password reset works once per day
- [ ] Second reset attempt on same day is blocked
- [ ] Warning message appears: You can use this option only one time per day.
- [ ] Generated password contains only uppercase/lowercase letters
- [ ] Generated password has no numbers
- [ ] Generated password has no special characters
- [ ] Password is updated in Firebase Auth
- [ ] Generated password email is received
- [ ] User can login with new password

## Task 4: Subscription and Payment

- [ ] Subscription page opens
- [ ] Free plan is visible
- [ ] Bronze plan is visible
- [ ] Silver plan is visible
- [ ] Gold plan is visible
- [ ] Payment is blocked outside 10:00 AM to 11:00 AM IST
- [ ] Razorpay checkout opens during allowed time
- [ ] Razorpay order is created
- [ ] Razorpay payment is verified
- [ ] User plan updates after payment
- [ ] Invoice record is created
- [ ] Invoice email is received
- [ ] Free plan blocks after 1 tweet per month
- [ ] Bronze plan blocks after 3 tweets per month
- [ ] Silver plan blocks after 5 tweets per month
- [ ] Gold plan allows unlimited tweets
- [ ] Expired subscription downgrades to free

## Task 5: Multi-language Support

- [ ] Language settings section is visible
- [ ] English option is visible
- [ ] Spanish option is visible
- [ ] Hindi option is visible
- [ ] Portuguese option is visible
- [ ] Chinese option is visible
- [ ] French option is visible
- [ ] French language sends OTP to email
- [ ] Other languages require mobile OTP
- [ ] Wrong OTP is rejected
- [ ] Correct OTP changes language
- [ ] Preferred language is saved in database
- [ ] Sidebar labels update after language change
- [ ] Post box labels update after language change

## Task 6: Login History and Security

- [ ] Login history is saved after login
- [ ] Browser type is captured
- [ ] Operating system is captured
- [ ] Device category is captured
- [ ] IP address is captured
- [ ] Login history is visible in settings
- [ ] Chrome login requires email OTP
- [ ] Chrome login succeeds after correct OTP
- [ ] Chrome login fails with wrong OTP
- [ ] Microsoft Edge login works without OTP
- [ ] Mobile login is blocked outside 10:00 AM to 1:00 PM IST
- [ ] Blocked mobile login is stored in login history

## Deployment Testing

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Backend health route works
- [ ] Vercel environment variables are correct
- [ ] Render environment variables are correct
- [ ] Firebase authorized domain includes Vercel domain
- [ ] CORS allows frontend domain
- [ ] MongoDB Atlas allows Render connection
- [ ] Live registration works
- [ ] Live login works
- [ ] Live settings page works
- [ ] Live API calls work