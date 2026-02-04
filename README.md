# BookApp
Project Management
npx create-expo-app Book --template blank
npm install @react-navigation/bottom-tabs
npm install expo
npx expo install react-native-screens react-native-safe-area-context
npm install @react-naviga
npx expo install expo-camera
npm install react-native-image-picker
npm audit fix
npm install react-native-pdf react-native-blob-util
npx expo install react-native-webview


//ตอนรัน ต้องใช้ 2 terminal 
1.node server.js
2.npm run android

//ถ้ายังไม่เคยติดตั้ง 
npm i express mongoose dotenv bcrypt cloudinary nodemailer express-session cors connect-mongo@5 multer


REFLEX
1.Login ได้แม้ไม่ยืนยัน OTP
2.Register ไม่เด้งไปหน้า OTP 
3.กรอกหนังสือแล้วต้อง logout ก่อนถึงขึ้นหนังสือ
4.หน้าProfileไม่ขึ้นข้อมูลผู้ใช้
```
app tt
├─ App.js
├─ Components
│  ├─ AddbyCode.js
│  ├─ Book_Decs.js
│  ├─ Login.js
│  ├─ Main_menu.js
│  ├─ OTP.js
│  ├─ Profile.js
│  ├─ Reader.js
│  ├─ ScanQR.js
│  ├─ Search.js
│  ├─ Sign_in.js
│  ├─ TabNavigator.js
│  └─ Welcome.js
├─ README.md
├─ app.json
├─ assets
│  ├─ adaptive-icon.png
│  ├─ favicon.png
│  ├─ icon.png
│  ├─ libary_bg.jpg
│  └─ splash-icon.png
├─ config
│  ├─ cloudinary.js
│  └─ db.js
├─ eas.json
├─ index.js
├─ package-lock.json
├─ package.json
├─ server
│  ├─ controllers
│  │  ├─ authController.js
│  │  └─ bookController.js
│  ├─ models
│  │  ├─ Book.js
│  │  ├─ BookCode.js
│  │  ├─ Otp.js
│  │  └─ User.js
│  ├─ routes
│  │  ├─ authRoutes.js
│  │  └─ bookRoutes.js
│  └─ utils
│     └─ sendOtpEmail.js
└─ server.js

```