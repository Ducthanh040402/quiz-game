# Quiz Game

Một ứng dụng quiz game đơn giản sử dụng React và Firebase.

## Tính năng

- Đăng nhập với tên người dùng
- Trả lời câu hỏi với thời gian giới hạn
- Hiệu ứng thời tiết khi trả lời đúng
- Chia sẻ câu chuyện khi trả lời sai
- Theo dõi điểm số và xếp hạng
- Hiển thị hình ảnh gợi ý dần dần

## Cài đặt

1. Clone repository:
```bash
git clone [your-repository-url]
cd quiz-game
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` trong thư mục gốc với nội dung:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Chạy ứng dụng:
```bash
npm start
```

## Cấu trúc thư mục

```
quiz-game/
├── public/
├── src/
│   ├── components/
│   │   ├── Admin.js
│   │   ├── Login.js
│   │   ├── Quiz.js
│   │   ├── WeatherEffect.js
│   │   └── firebase.js
│   ├── data/
│   │   └── questions.json
│   ├── styles/
│   │   ├── index.css
│   │   ├── quiz.css
│   │   └── weather.css
│   ├── App.js
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

## Công nghệ sử dụng

- React
- Firebase (Authentication, Realtime Database)
- TailwindCSS
- CSS3 Animations

## Deploy

1. Build ứng dụng:
```bash
npm run build
```

2. Deploy lên Firebase:
```bash
firebase deploy
```

## Giấy phép

MIT
