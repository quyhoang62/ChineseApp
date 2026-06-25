# Hoc Tieng Trung

Ung dung mobile hoc tu vung tieng Trung duoc xay dung bang React Native + Expo (template blank), toi uu cho nguoi moi hoc lap trinh mobile.

## Muc tieu du an

Ung dung giup nguoi hoc:

- Them tu vung moi (Chu Han, Pinyin, Nghia, Lesson/Chu de, Cau vi du, Ghi chu)
- Hoc bang flashcard
- Tim kiem va quan ly tu vung
- Luu du lieu cuc bo de khong mat du lieu khi dong/mo lai app

## Tinh nang chinh

### 1) Hoc tu (Flashcard)

- Hien Chu Han lon o trung tam the
- Nut `Hien dap an` / `An dap an`
- Hien Pinyin, Nghia, Vi du sau khi mo dap an
- Nut `Danh dau da thuoc`
- Nut `Tu tiep theo`
- Thong ke nhanh: tong so tu, so tu da thuoc, tien do (%)

### 2) Them tu

- Form them tu vung:
  - Chu Han (bat buoc)
  - Pinyin
  - Nghia tieng Viet (bat buoc)
  - Lesson / Chu de
  - Cau vi du
  - Ghi chu
- Validate du lieu co ban truoc khi luu
- Hien thong bao khi loi / khi luu thanh cong
- Cap nhat danh sach ngay lap tuc

### 3) Tim kiem

- Tim theo: Chu Han, Pinyin, Nghia tieng Viet, Lesson
- Loc realtime khi nguoi dung go
- Moi item hien:
  - Chu Han
  - Pinyin
  - Nghia
  - Lesson/Chu de
  - Trang thai da thuoc/chua thuoc
- Ho tro xoa tu
- Ho tro doi trang thai da hoc/chua hoc ngay tren man hinh tim kiem

## Cong nghe su dung

- Expo SDK 54
- React Native
- React Navigation (Bottom Tabs)
- AsyncStorage (luu du lieu cuc bo)
- Context API + useReducer + useState + useEffect

## Quan ly state va luu tru

- State tu vung duoc quan ly tap trung trong `VocabularyContext`
- `useReducer` quan ly cac action:
  - `HYDRATE`
  - `ADD_WORD`
  - `DELETE_WORD`
  - `TOGGLE_LEARNED`
  - `MARK_LEARNED`
- AsyncStorage dung de:
  - Load danh sach tu khi mo app
  - Tu dong save lai moi khi du lieu thay doi

## Cau truc thu muc

```text
src/
  components/
    StatPill.js
  constants/
    theme.js
  context/
    VocabularyContext.js
  data/
    initialVocabulary.js
  navigation/
    TabNavigator.js
  screens/
    LearnScreen.js
    AddWordScreen.js
    SearchScreen.js
  styles/
    commonStyles.js
  utils/
    storage.js
```

## Cai dat va chay du an

### 1) Cai dependency

```bash
npm install
```

### 2) Chay Expo

```bash
npx expo start
```

Sau khi chay len, ban co the:

- Bam `a` de mo Android (neu da cai Android SDK + Emulator)
- Bam `w` de mo web tren laptop
- Quet QR bang Expo Go tren dien thoai

## Chay tren laptop

### Cach nhanh nhat: Web

```bash
npx expo start --web
```

Neu bao thieu goi web, cai:

```bash
npx expo install react-dom react-native-web
```

### Chay bang Android Emulator (Windows)

Can:

- Android Studio
- Android SDK
- Android Emulator
- `adb` trong PATH

Kiem tra nhanh:

```bash
adb --version
emulator -list-avds
```

Neu terminal bao khong tim thay Android SDK hoac `adb`, can set bien moi truong:

- `ANDROID_HOME` = duong dan SDK (vi du `C:\Users\Lenovo\AppData\Local\Android\Sdk`)
- Them vao `Path`:
  - `...\Android\Sdk\platform-tools`
  - `...\Android\Sdk\emulator`

## Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

## Mau du lieu tu vung

```json
{
  "id": "1",
  "hanzi": "你好",
  "pinyin": "ni hao",
  "meaning": "Xin chao",
  "lesson": "Lesson 1",
  "example": "你好！我叫安。",
  "learned": false
}
```

## Huong phat trien tiep

- Bo sung man hinh Trang chu (tong quan tien do)
- Loc nang cao theo lesson/chu de
- Import/Export bo tu vung JSON
- Bo sung animation cho flashcard
