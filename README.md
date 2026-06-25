# Hoc Tieng Trung

Ung dung hoc tu vung tieng Trung theo kien truc tach rieng frontend va backend:

- Frontend: React Native + Expo
- Backend: Node.js + Express + MySQL

## Kien truc

```text
Frontend (Expo App)
  -> Goi REST API
Backend (Express)
  -> Truy van MySQL
```

## Tinh nang chinh

- Them tu vung moi
- Hoc bang flashcard
- Tim kiem, xoa, cap nhat trang thai da thuoc/chua thuoc
- Du lieu luu trong MySQL (khong con luu local AsyncStorage)

## Cong nghe su dung

### Frontend

- Expo SDK 54
- React Native
- React Navigation (Bottom Tabs)
- Context API + useReducer

### Backend

- Node.js
- Express
- mysql2
- dotenv
- cors

## Cau truc thu muc

```text
backend/
  src/
    controllers/
      wordController.js
    routes/
      wordRoutes.js
    db.js
    server.js
  sql/
    schema.sql
  .env.example
  package.json

frontend/
  App.js
  app.json
  index.js
  package.json
  src/
    config/
      api.js
    services/
      wordApi.js
    context/
      VocabularyContext.js
    screens/
      LearnScreen.js
      AddWordScreen.js
      SearchScreen.js
    navigation/
      TabNavigator.js
    components/
    constants/
    styles/
```

## Cai dat va chay

### 1) Cai backend

```bash
cd backend
npm install
```

Sao chep file moi truong:

```bash
copy .env.example .env
```

Cap nhat thong tin MySQL trong `.env`.

### 2) Tao database

Chay file `backend/sql/schema.sql` tren MySQL.

### 3) Chay backend

```bash
cd backend
npm run dev
```

Mac dinh backend chay tai `http://localhost:4000`.

### 4) Chay frontend

```bash
cd frontend
npm install
npx expo start
```

## API chinh

- `GET /api/words` lay danh sach tu vung
- `POST /api/words` tao tu moi
- `PATCH /api/words/:id/learned` cap nhat trang thai learned
- `DELETE /api/words/:id` xoa tu vung

## Luu y khi test tren Android Emulator

Trong frontend, API host cho Android emulator dung `10.0.2.2`.
Da duoc cau hinh san trong `frontend/src/config/api.js`.
