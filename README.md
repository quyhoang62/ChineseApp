# Hoc Tieng Trung

Ung dung hoc tu vung tieng Trung voi kien truc tach rieng **frontend** va **backend**:

- Frontend: React Native + Expo
- Backend: Node.js + Express + MySQL

## Tong quan kien truc

```text
frontend/  -> giao dien mobile/web, quan ly state, goi REST API
backend/   -> API, xu ly nghiep vu, truy van MySQL
```

Frontend la noi hien thi giao dien hoc tu vung, them tu, tim kiem va flashcard. Backend la noi xu ly du lieu tu vung, luu trang thai da thuoc/chua thuoc va cap nhat MySQL.

## Tinh nang chinh

- Them tu vung moi
- Hoc bang flashcard
- Tim kiem, xoa, cap nhat trang thai da thuoc/chua thuoc
- Tach ro du lieu frontend/backend
- Du lieu luu trong MySQL, khong con phu thuoc AsyncStorage

## Cong nghe su dung

### Frontend

- Expo SDK 54
- React Native
- React Navigation (Bottom Tabs)
- Context API + useReducer
- Animated + PanResponder cho thao tac lat the/quet the

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
    chinese_learning_hsk1_hsk4_seed_vi.sql
  .env.example
  package.json

frontend/
  App.js
  app.json
  index.js
  package.json
  src/
    components/
      StatPill.js
    config/
      api.js
    constants/
      theme.js
    context/
      VocabularyContext.js
    navigation/
      TabNavigator.js
    screens/
      LearnScreen.js
      AddWordScreen.js
      SearchScreen.js
    services/
      wordApi.js
    styles/
      commonStyles.js
```

## Vai tro tung thu muc

### `backend/`

Day la lop API va logic xu ly du lieu.

- `src/server.js`: file khoi dong Express, gan middleware, tao route `/api`, va them endpoint `/health` de kiem tra backend + MySQL.
- `src/db.js`: cau hinh pool ket noi MySQL bang `mysql2/promise`.
- `src/controllers/wordController.js`: lop xu ly nghiep vu cho tu vung, bao gom:
  - lay danh sach tu
  - them tu moi
  - cap nhat learned true/false
  - xoa tu
  - chuyen du lieu MySQL ve format frontend can dung
- `src/routes/wordRoutes.js`: dinh nghia cac REST endpoint va map vao controller.
- `sql/schema.sql`: tao database va bang `words`.
- `sql/chinese_learning_hsk1_hsk4_seed_vi.sql`: file seed du lieu HSK 1 -> HSK 4.
- `.env.example`: mau bien moi truong cho backend.
- `package.json`: script chay backend, phu thuoc `express`, `mysql2`, `dotenv`, `cors`.

### `frontend/`

Day la lop giao dien va trang thai cua ung dung hoc tu vung.

- `App.js`: component goc, boc `VocabularyProvider` va `NavigationContainer`.
- `index.js`: diem khoi dong cua app Expo.
- `app.json`: cau hinh Expo app.
- `src/config/api.js`: xac dinh `API_BASE_URL` theo moi truong (web, emulator, dien thoai that).
- `src/services/wordApi.js`: lop trung gian goi REST API backend.
- `src/context/VocabularyContext.js`: provider quan ly state toan app bang `useReducer`, cung cap cac action nhu `addWord`, `deleteWord`, `toggleLearned`, `setLearned`.
- `src/navigation/TabNavigator.js`: cau hinh bottom tabs cho cac man Học từ vựng / Thêm từ mới / Tìm kiếm.
- `src/screens/LearnScreen.js`: man hoc chinh, gom folder HSK, danh sach lesson, flashcard, lat the, vuot trai/phai.
- `src/screens/AddWordScreen.js`: man them tu vung moi.
- `src/screens/SearchScreen.js`: man tim kiem, loc, xoa, doi trang thai da thuoc/chua thuoc.
- `src/components/StatPill.js`: component hien thi so lieu tong quan.
- `src/constants/theme.js`: mau sac va shadow chung.
- `src/styles/commonStyles.js`: bo style dung chung cho cac man.
- `package.json`: script chay frontend Expo va cac phu thuoc UI.

## Vai tro cac lop/chuc nang quan trong

### Frontend

#### `VocabularyProvider` trong `src/context/VocabularyContext.js`

- La lop quan ly trang thai trung tam.
- Tai du lieu tu backend khi app khoi dong.
- Luu danh sach words vao memory cua app.
- Cung cap function cho cac man:
  - `addWord(wordData)`
  - `deleteWord(id)`
  - `toggleLearned(id)`
  - `setLearned(id, learned)`

#### `wordApi` trong `src/services/wordApi.js`

- Dong vai tro client API.
- Goi cac endpoint:
  - `list()` -> `GET /api/words`
  - `create(payload)` -> `POST /api/words`
  - `updateLearned(id, learned)` -> `PATCH /api/words/:id/learned`
  - `remove(id)` -> `DELETE /api/words/:id`

#### `LearnScreen`

- Hien thi folder HSK 1, HSK 2, HSK 3, HSK 4, Khac.
- Khi chon folder, hien danh sach lesson thuoc folder do.
- Khi chon lesson, hien flashcard cua lesson.
- Cho phep lat the bang cham, vuot trai/phai de cap nhat trang thai.

#### `SearchScreen`

- Tim kiem theo Chữ Hán, pinyin, nghia, lesson.
- Sap xep ket qua de uu tien khop lesson chinh xac.

#### `AddWordScreen`

- Form them tu moi, gan lesson/chu de cho tu vung.

### Backend

#### `wordController.js`

- La lop xu ly logic du lieu.
- Chuyen doi du lieu MySQL sang format JSON frontend dung.
- Dam bao cac truong nhu `learned` duoc tra ve dang boolean.

#### `wordRoutes.js`

- La lop dinh tuyen HTTP.
- Tach ro route voi controller de code de doc va de bao tri.

#### `server.js`

- Khoi dong server Express.
- Gan CORS, body parser JSON, health check, va error handler.

## Cau truc du lieu `words`

Bang `words` trong MySQL gom cac cot:

- `id`: khoa chinh
- `hanzi`: chu Han
- `pinyin`: phien am
- `meaning`: nghia tieng Viet
- `lesson`: ten lesson, vi du `HSK1-Lesson01`
- `example`: cau vi du
- `note`: ghi chu
- `learned`: trang thai da thuoc/chua thuoc
- `created_at`, `updated_at`: thoi gian tao/cap nhat

## Cach cai dat va chay

### 1) Cai backend

```bash
cd backend
npm install
copy .env.example .env
```

Cap nhat thong tin MySQL trong `.env` neu can.

### 2) Tao database

Import file `backend/sql/schema.sql` vao MySQL.

Neu ban muon co du lieu mau, import them `backend/sql/chinese_learning_hsk1_hsk4_seed_vi.sql`.

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

- `GET /api/words`: lay danh sach tu vung
- `POST /api/words`: tao tu moi
- `PATCH /api/words/:id/learned`: cap nhat trang thai learned
- `DELETE /api/words/:id`: xoa tu vung
- `GET /health`: kiem tra backend va ket noi MySQL

## Ghi chu ve du an

- Source code dang dung nam trong `frontend/` va `backend/`.
- Thu muc `src/` o root da duoc xoa de tranh nham lan.
- Neu test tren Android Emulator, API host co the su dung `10.0.2.2`.
- Neu test tren dien thoai that qua Expo Go, can dung IP LAN cua may tinh trong `frontend/src/config/api.js`.
