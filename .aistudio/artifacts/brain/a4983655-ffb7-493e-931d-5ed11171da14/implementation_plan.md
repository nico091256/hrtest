# Discover Invest — Masterlar Attestatsiyasi va HR Test Tizimi

Qurilish va muhandislik yo'nalishidagi yangi xodimlarni ishga qabul qilish hamda ustalarni attestatsiyadan o'tkazish uchun mo'ljallangan, O'zbek va Rus tillarida ishlovchi web-ilova. Tizim nomzodlardan uchta murakkablik darajasida (`Basic`, `Intermediate`, `Advanced`) test olish, natijalarni rasmiy 100 ballik shkala bo'yicha avtomatik baholash hamda HR komissiyasi uchun javob kalitlari, savollar bazasi va hisobotlarni boshqarish imkonini beradi.

### User Review & Critical Decisions

> [!IMPORTANT]
> Suhbat davomida tasdiqlangan qarorlar va amaliy qismsiz 100 ballik baholash mexanizmi:

- **Tasdiqlangan Qaror 1 (Til va Yo'nalish)**: Ilova interfeysi va dastlabki 30 ta professional savollar bazasi (har bir daraja uchun 10 tadan) to'liq **O'zbek va Rus tillarida**, qurilish me'yorlari (SHNK/СНиП), monolit-beton ishlari, mehnat muhofazasi va muhandislik sifat nazorati yo'nalishida shakllantiriladi.
- **Tasdiqlangan Qaror 2 (Amaliy qismsiz 100 ballik hisoblash)**: Amaliy qism olib tashlangani sababli, 100 ballik baholash shkalasi (`0–49`, `50–64`, `65–79`, `80–89`, `90–100`) to'liq ishlashi uchun har bir darajadagi **10 ta test savolining har biri 10 balldan (10 × 10 = 100 ball)** baholanadi.
- **Tasdiqlangan Qaror 3 (HR va Komissiya Funksiyalari)**: Alohida himoyalangan Komissiya panelida nomzodlar natijalari jadvali, alohida varaqda komissiya javob kalitlari (`A/B/C/D`), savollarni tahrirlash/qo'shish moduli hamda CSV/JSON eksport-import va chop etish (Bayonnoma) funksiyalari bo'ladi.
- **Tasdiqlangan Qaror 4 (Ma'lumotlar Saqlash)**: Barcha savollar va topshirilgan test natijalari tezkor `LocalStorage` xotirasida saqlanadi hamda zaxira fayli sifatida yuklab olish / qayta yuklash imkoniyati taqdim etiladi.

---

### 1. Overview & Core Concept

- **Nima vazifa bajaradi**:
  1. **Nomzodlar uchun (Test topshirish rejimi)**: Yangi ishga kirayotgan usta yoki muhandis o'z ma'lumotlarini (F.I.Sh., telefon, mutaxassislik, qurilish ob'ekti) kiritadi, o'ziga belgilangan darajani (`Basic`, `Intermediate` yoki `Advanced`) tanlaydi va 10 ta `A / B / C / D` variantli test savollariga belgilangan vaqt ichida javob beradi.
  2. **HR va Attestatsiya Komissiyasi uchun (Boshqaruv rejimi)**: Nomzodlarning to'plagan ballari, 5 bosqichli shkala bo'yicha xulosa darajasi, har bir savol bo'yicha xatolar tahlili, alohida **Komissiya javob kalitlari varag'i** va savollar konstruktori bitta markazlashgan konsolda boshqariladi.
- **Foydalanuvchilar**: Discover Invest HR mutaxassislari, attestatsiya komissiyasi a'zolari, bosh muhandislar hamda ishga kiruvchi ustalar/brigadirlar.
- **Asosiy Qiymat**: Qog'ozdagi test varaqlarini raqamlashtirib, inson omili xatolarini yo'qotadi, bir zumda shkala bo'yicha malaka darajasini aniqlaydi va rasmiy attestatsiya bayonnomasini shakllantiradi.

---

### 2. User Experience & Visual Design

- **Asosiy Foydalanuvchi Oqimlari (User Flows)**:
  1. **Til va Rejim Tanlash**: Yuqori navigatsiya panelidan bir klik bilan `O'zbekcha` yoki `Русский` tiliga o'tish, hamda `Nomzod testi` va `HR Komissiya paneli` o'rtasida almashish.
  2. **Nomzodni Ro'yxatga Olish va Daraja Tanlash**: Nomzod o'z F.I.Sh., lavozimi (masalan: *Monolit-beton ustasi*, *Armatura va payvandlash ustasi*, *Umumqurilish uchastka ustasi*, *Muhandis-geodezist*) va ob'ekt nomini kiritadi, so'ngra `Basic`, `Intermediate` yoki `Advanced` darajasini tanlab testni boshlaydi.
  3. **Interaktiv Test Jarayoni**: Ekranda bir vaqtda savol matni, 4 ta aniq variant (`A`, `B`, `C`, `D`), qolgan vaqt taymeri va 1 dan 10 gacha savollar navigatori ko'rinadi. Nomzod istalgan savolga qaytishi va yakunda javoblarni tasdiqlashi mumkin.
  4. **Yakuniy Natija va Shkala Xulosasi**: Test yakunlangach, to'plangan ball (0–100) va Discover Invest shkalasi bo'yicha rasmiy maqom ko'rsatiladi:
     - `0–49 ball` — **Mos emas / Не соответствует**
     - `50–64 ball` — **Rivojlanish talab etiladi / Требуется развитие**
     - `65–79 ball` — **Mos keladi / Соответствует**
     - `80–89 ball` — **Yuqori daraja / Высокий уровень**
     - `90–100 ball` — **Kadrlar zaxirasi / Кадровый резерв**
  5. **HR va Komissiya Boshqaruvi**:
     - **Natijalar Jadvali**: Barcha nomzodlarni daraja (`Basic`/`Intermediate`/`Advanced`), maqom yoki ism bo'yicha filtrlash, har bir nomzodning javoblar varag'ini ochib ko'rish va chop etish.
     - **Komissiya Kalitlari Varag'i**: Uchala daraja bo'yicha to'g'ri javoblar (`A/B/C/D`) va me'yoriy izohlar jadvali (faqat komissiya uchun mo'ljallangan maxsus ko'rinish).
     - **Savollar Tahriri**: Mavjud savollarni o'zgartirish, yangi ikki tilli savol qo'shish va JSON/CSV formatda eksport-import qilish.

- **Visual Identity & Theme**:
  - *Estetik Yo'nalish*: Korporativ muhandislik va sanoat aniqligi (Enterprise Architectural & Engineering SaaS) — toza chiziqlar, yuqori kontrastli jadval ma'lumotlari va Discover Invest uslubidagi jiddiy ko'k-po'lat ohanglar.
  - *Ranglar Palitrasi (60-30-10 qoidasi)*:
    - **Asosiy Fon (60%)**: Toza oq va och kulrang-po'lat maydon (`#F8FAFC` / `#FFFFFF`), o'qish uchun maksimal qulaylik.
    - **Strukturaviy Yuzalar (30%)**: Yengil chegarali panellar (`#E2E8F0`), chuqur slanets matnlar (`#0F172A`) va ikkilamchi ma'lumotlar (`#475569`).
    - **Korporativ Urg'u (10%)**: Rasmiy hujjat sarlavhasidagi chuqur ko'k-po'lat rang (`#1D4E78` / `#1E3A5F`) hamda baholash shkalasi uchun semantik holat ranglari (`#DC2626` qizil — mos emas, `#D97706` kahrabo — rivojlanish kerak, `#2563EB` ko'k — mos keladi, `#059669` zumrad — yuqori daraja va kadrlar zaxirasi).
  - *Tipografiya va Ierarxiya*:
    - **Sarlavhalar va Navigatsiya**: `Plus Jakarta Sans` (aniq geometrik va zamonaviy korporativ qiyofa).
    - **Asosiy Matn va Test Savollari**: `DM Sans` (uzun qurilish-texnik savollarni charchoqsis o'qish uchun).
    - **Ballar, Taymer va Jadval Raqamlari**: `JetBrains Mono` (`tabular-nums` bilan — barcha ballar, foizlar va sanalar vertikal chiziqda tekis turishi uchun).
  - *Komponentlar va Joylashuv (1440px Desktop & Responsive)*:
    - Yuqori panel 3 ta zonadan iborat: chapda **DISCOVER INVEST** brend nomi, markazda asosiy bo'lim havolalari (`Test Topshirish`, `Natijalar`, `Komissiya Kalitlari`, `Savollar Bazasi`), o'ngda til almashtirgich (`O'Z / РУ`) va asosiy harakat tugmasi.
    - Barcha metama'lumotlar (sana, daraja, ob'ekt nomi) ortiqcha kapsulalarsiz, nuqtali ajratgichlar (`·`) bilan toza tipografik ko'rinishda beriladi.

---

### 3. Key Product Decisions & Trade-Offs

- **Qaror 1: Amaliy qismsiz 100 ballik shkalani saqlab qolish**
  - *Tanlangan yondashuv*: Har bir darajadagi 10 ta nazariy/vaziyatli savolning har biriga 10 ball berish (jami 100 ball).
  - *Sababi*: Rasmdagi 5 bosqichli baholash shkalasi (`0–49`, `50–64`, `65–79`, `80–89`, `90–100`) 100 ballik mezonga asoslangan. Har bir savolni 10 balldan hisoblash orqali amaliy qism bo'lmasa ham komissiya shkalasi o'zgarishsiz va tushunarli ishlaydi.
- **Qaror 2: Komissiya panelini PIN-kod / tezkor ruxsat bilan ajratish**
  - *Tanlangan yondashuv*: Nomzod test topshirayotgan paytda javob kalitlari varag'iga kirib ketmasligi uchun `HR / Komissiya` bo'limiga o'tishda oddiy komissiya PIN-kodi (standart `2026`, ekranda HR uchun eslatma bilan va o'zgartirish imkoniyati bilan) qo'llaniladi.
  - *Sababi*: Bitta kompyuter yoki planshetda ham nomzoddan test olish, ham HR xodimi darhol kalitlar va natijalarni tekshirishi xavfsiz bo'ladi.
- **Qaror 3: Tayyor qurilish-muhandislik savollar bazasi + To'liq tahrirlash**
  - *Tanlangan yondashuv*: Ilova ilk ochilgandayoq `Basic`, `Intermediate` va `Advanced` darajalari uchun jami 30 ta haqiqiy qurilish va mehnat xavfsizligi savollari (O'zbek va Rus tillarida) bilan tayyor ishlaydi, HR esa ularni istalgancha tahrirlashi yoki yangilarini qo'shishi mumkin.
  - *Sababi*: HR bo'limi ilovani darhol amaliyotda sinab ko'rishi va o'z ob'ekt talablariga moslashtirishi mumkin bo'ladi.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Arxitektura va Komponentlar Diagrammasi**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   DISCOVER INVEST HR ATTESTATION WEB APP                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Navigation Bar: [Brand Wordmark] ── [4 Nav Views] ── [Lang + CTA]      │
└──────────────────┬───────────────────────────────────────┬──────────────────┘
                   │                                       │
                   ▼                                       ▼
┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐
│      CANDIDATE ASSESSMENT FLOW      │ │       HR & COMMISSION CONSOLE       │
├─────────────────────────────────────┤ ├─────────────────────────────────────┤
│ 1. Candidate Intake Form            │ │ 1. Results & Analytics Table        │
│    - F.I.Sh., Lavozim, Ob'ekt       │ │    - 5-Tier Scale Classification    │
│    - Level: Basic / Inter / Adv     │ │    - Search, Level & Status Filter  │
│                                     │ │    - Candidate Protocol Modal/Print │
│ 2. Interactive Test Runner          │ │                                     │
│    - 10 Questions × 10 pts = 100    │ │ 2. Commission Answer Keys Sheet     │
│    - A / B / C / D Selector         │ │    - Level Tabs (Basic/Inter/Adv)   │
│    - Question Navigator & Timer     │ │    - Answer Matrix + Normative Note │
│                                     │ │                                     │
│ 3. Instant Score & Qualification    │ │ 3. Question Bank Manager + Export   │
│    - 0-100 Score & Scale Verdict    │ │    - Bilingual (UZ/RU) CRUD Editor  │
│    - Option to Print / New Test     │ │    - CSV Export & JSON Backup/Load  │
└──────────────────┬──────────────────┘ └──────────────────┬──────────────────┘
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             LOCAL PERSISTENCE & SCORING ENGINE (LocalStorage)               │
│  - Scoring Engine: Evaluates A/B/C/D -> 0-100 pts -> 5-Tier Verdict         │
│  - Seed Data: 30 Bilingual Construction/Engineering Questions + Demo Runs   │
│  - Data Sync: Instant LocalStorage persistence + CSV/JSON File I/O          │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Ma'lumotlar Modeli (Data Model)**:
  - `Question`: `id`, `level` (`basic` | `intermediate` | `advanced`), `questionUz`, `questionRu`, `optionsUz` (`A`, `B`, `C`, `D`), `optionsRu` (`A`, `B`, `C`, `D`), `correctOption` (`A` | `B` | `C` | `D`), `categoryUz`, `categoryRu`, `normativeRef` (me'yoriy hujjat / izoh).
  - `Submission`: `id`, `candidateName`, `position`, `siteObject`, `phone`, `level`, `answers` (savol ID -> tanlangan harf), `score` (0–100), `correctCount` (0–10), `durationSeconds`, `qualificationTier` (`not_qualified` | `needs_development` | `qualified` | `high_level` | `talent_pool`), `submittedAt`.
- **Interaktiv Holatlar va Boshqaruv (State Mapping)**:
  - **Forma validatsiyasi**: Nomzod F.I.Sh., lavozim va ob'ekt kiritilmaguncha test boshlanmaydi; barcha 10 ta savolga javob berilmaguncha yakunlash tugmasi ogohlantirish ko'rsatadi.
  - **Dinamik filtrlash va qidiruv**: HR natijalar jadvalida daraja (`Basic`, `Intermediate`, `Advanced`), baholash shkalasi (`Kadrlar zaxirasi`, `Mos keladi` va h.k.) hamda nomzod ismi/ob'ekti bo'yicha real vaqtda qidirish.
  - **Eksport va Chop etish**: Natijalarni `.csv` (Excel uchun UTF-8 BOM bilan) va `.json` formatida yuklab olish, shuningdek har bir nomzod uchun rasmiy **Attestatsiya Bayonnomasi (Протокол аттестации)** oynasini chop etish.
