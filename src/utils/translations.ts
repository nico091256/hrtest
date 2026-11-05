import { DifficultyLevel, Language, QualificationTier } from '../types';

export const UI_TEXT = {
  uz: {
    brandTitle: 'DISCOVER INVEST',
    bannerTitle: 'DISCOVER INVEST — АТТЕСТАЦИЯ МАСТЕРОВ / MASTERLAR ATTESTATSIYASI',
    bannerLevels: 'Uchta murakkablik darajasi: Basic, Intermediate, Advanced.',
    bannerScoring: 'Har bir daraja: 10 ta savol × 10 ball = 100 ball (amaliy qismsiz, to‘liq test asosida).',
    bannerChoice: 'Daraja varag‘ida xodim A / B / C / D javobini tanlaydi. Kalitlar komissiyaning alohida varag‘ida joylashgan.',
    bannerScale: 'Shkala: 0–49 — mos emas; 50–64 — rivojlanish talab etiladi; 65–79 — mos keladi; 80–89 — yuqori daraja; 90–100 — kadrlar zaxirasi.',
    bannerDisclaimer: 'Bu ichki attestatsiya va yangi xodimlarni qabul qilish tizimi. Rasmiy joriy etishdan oldin ob’ekt talablari, amaldagi me’yorlar va kompaniya tartiblariga moslashtiring.',

    navCandidate: 'Test Topshirish',
    navResults: 'Natijalar Jadvali',
    navKeys: 'Komissiya Kalitlari',
    navQuestions: 'Savollar Bazasi',
    ctaStartNew: 'Yangi Test',

    // Candidate Intake
    intakeTitle: 'Yangi Xodim va Ustalarni Ro‘yxatga Olish',
    intakeSubtitle: 'Testni boshlash uchun nomzod ma’lumotlarini kiriting va tegishli murakkablik darajasini tanlang.',
    labelFullName: 'Nomzod F.I.Sh.',
    placeholderFullName: 'Masalan: Rustamov Sardorbek Alisher o‘g‘li',
    labelPosition: 'Lavozim / Mutaxassislik',
    placeholderPosition: 'Masalan: Monolit-beton uchastka ustasi',
    labelSiteObject: 'Qurilish ob’ekti / Loyiha',
    placeholderSiteObject: 'Masalan: Gardens Residence, 4-blok',
    labelPhone: 'Telefon raqami yoki Tabel ID',
    placeholderPhone: '+998 90 123 45 67',
    labelLevel: 'Murakkablik darajasi (Level)',
    startTestBtn: 'Attestatsiya Testini Boshlash',
    quickFillDemoBtn: 'Namuna ma’lumot bilan to‘ldirish',
    validationError: 'Iltimos, barcha maydonlarni to‘liq va to‘g‘ri kiriting (kamida 3 ta belgi).',

    // Level descriptions
    levelTitle: {
      basic: 'Basic — Boshlang‘ich daraja',
      intermediate: 'Intermediate — O‘rta muhandislik darajasi',
      advanced: 'Advanced — Yuqori va katta usta darajasi',
    } as Record<DifficultyLevel, string>,
    levelDesc: {
      basic: 'Mehnat muhofazasi (TB), dastlabki qurilish me’yorlari, asbob-uskunalar va oddiy texnologik jarayonlar.',
      intermediate: 'SHNK/СНиП me’yorlari, geodezik nazorat, armatura-beton tugunlari, yashirin ishlar dalolatnomalari.',
      advanced: 'PPR/ish grafigi, seysmik talablar, murakkab konstruksiyalar sifat nazorati va ijro hujjatlari.',
    } as Record<DifficultyLevel, string>,

    // Test Runner
    questionLabel: 'Savol',
    ofLabel: 'dan',
    timeElapsedLabel: 'Sarflangan vaqt',
    pointsNotice: 'Har bir to‘g‘ri javob: 10 ball · Jami: 100 ball',
    answeredCountLabel: 'Belgilangan javoblar',
    prevQuestionBtn: 'Oldingi savol',
    nextQuestionBtn: 'Keyingi savol',
    finishTestBtn: 'Testni Yakunlash va Baholash',
    unansweredWarning: 'Diqqat: Siz hali barcha 10 ta savolga javob bermadingiz. Белгиланмаган savollar 0 ball bilan baholanadi.',
    confirmSubmitBtn: 'Tasdiqlash va Natijani Ko‘rish',
    cancelTestBtn: 'Bekor qilish',

    // Result Screen
    resultHeader: 'Attestatsiya Testi Natijasi',
    totalScoreLabel: 'Umumiy To‘plangan Ball',
    correctAnswersLabel: 'To‘g‘ri Javoblar Soni',
    qualificationVerdictLabel: 'Komissiya Shkalasi Bo‘yicha Xulosa',
    printProtocolBtn: 'Bayonnomani Chop Etish',
    newCandidateBtn: 'Keyingi Nomzod Testiga O‘tish',
    openHrResultsBtn: 'HR Natijalar Jadvalini Ko‘rish',
    questionBreakdownTitle: 'Savollar Bo‘yicha Batafsil Tahlil',
    candidateChoiceLabel: 'Nomzod javobi',
    correctKeyLabel: 'To‘g‘ri kalit',
    noAnswerLabel: 'Belgilanmagan',
    normativeBasisLabel: 'Me’yoriy asos',

    // Qualification Tiers
    tierNames: {
      not_qualified: 'Mos emas',
      needs_development: 'Rivojlanish talab etiladi',
      qualified: 'Mos keladi',
      high_level: 'Yuqori daraja',
      talent_pool: 'Kadrlar zaxirasi',
    } as Record<QualificationTier, string>,
    tierRanges: {
      not_qualified: '0–49 ball',
      needs_development: '50–64 ball',
      qualified: '65–79 ball',
      high_level: '80–89 ball',
      talent_pool: '90–100 ball',
    } as Record<QualificationTier, string>,
    tierRecommendations: {
      not_qualified: 'Nomzod bilim darajasi tasdiqlangan minimal me’yorlarga javob bermaydi. Qayta tayyorlovdan so‘ng qayta topshirish tavsiya etiladi.',
      needs_development: 'Asosiy tushunchalar mavjud, biroq SHNK me’yorlari va texnik nazorat bo‘yicha qo‘shimcha o‘qitish hamda ustoz biriktirish zarur.',
      qualified: 'Nomzod lavozim talablariga to‘liq javob beradi va qurilish ob’ektida mustaqil usta sifatida ishlashga tavsiya etiladi.',
      high_level: 'Chuqur muhandislik bilimi va me’yoriy hujjatlar bilan ishlash ko‘nikmasi tasdiqlandi. Mas’uliyatli uchastkalarga tavsiya etiladi.',
      talent_pool: 'A’lo natija. Katta usta, uchastka boshlig‘i yoki kadrlar zaxirasiga kiritish uchun ustuvor nomzod.',
    } as Record<QualificationTier, string>,

    // Commission Gate
    commissionGateTitle: 'HR va Attestatsiya Komissiyasi Bo‘limi',
    commissionGateDesc: 'Nomzodlar test topshirayotgan vaqtda javob kalitlari va komissiya hisobotlariga kirishni cheklash uchun komissiya PIN-kodini kiriting.',
    pinPlaceholder: 'PIN-kod (Standart: 2026)',
    unlockBtn: 'Bo‘limni Ochish',
    quickUnlockBtn: 'Komissiya sifatida darhol kirish (2026)',
    pinError: 'Noto‘g‘ri PIN-kod. Standart komissiya kodi: 2026',

    // HR Results View
    resultsTitle: 'Nomzodlar va Attestatsiya Natijalari',
    resultsSubtitle: 'Topshirilgan barcha testlar, 100 ballik shkala tahlili va rasmiy bayonnomalar.',
    searchPlaceholder: 'F.I.Sh., lavozim yoki ob’ekt bo‘yicha qidirish...',
    filterAllLevels: 'Barcha darajalar',
    filterAllTiers: 'Barcha maqomlar',
    exportCsvBtn: 'Excel / CSV Yuklab Olish',
    clearFilterBtn: 'Filtrlarni tozalash',
    viewProtocolBtn: 'Bayonnoma',
    deleteRecordBtn: 'O‘chirish',
    emptyResultsText: 'Tanlangan mezonlar bo‘yicha natijalar topilmadi.',

    // Commission Keys Sheet
    keysTitle: 'Komissiya Javob Kalitlari Varag‘i',
    keysSubtitle: 'Har bir daraja (Basic, Intermediate, Advanced) bo‘yicha rasmiy A/B/C/D kalitlari va me’yoriy asoslar.',
    printKeysBtn: 'Kalitlar Varag‘ini Chop Etish',

    // Question Bank Manager
    questionsTitle: 'Savollar Bazasi va Konstruktor',
    questionsSubtitle: 'O‘zbek va Rus tillaridagi savollarni tahrirlash, yangi savol qo‘shish hamda JSON zaxira nusxasini boshqarish.',
    addQuestionBtn: 'Yangi Savol Qo‘shish',
    exportJsonBtn: 'Bazani Yuklab Olish (JSON)',
    importJsonBtn: 'Bazani Yuklash (JSON)',
    resetDefaultBtn: 'Standart 30 ta savolni tiklash',
    editBtn: 'Tahrirlash',
    saveBtn: 'Saqlash',
    cancelBtn: 'Bekor qilish',
  },
  ru: {
    brandTitle: 'DISCOVER INVEST',
    bannerTitle: 'DISCOVER INVEST — АТТЕСТАЦИЯ МАСТЕРОВ / МАСТЕРЛАР АТТЕСТАЦИЯСИ',
    bannerLevels: 'Три уровня сложности: Basic, Intermediate, Advanced.',
    bannerScoring: 'Каждый уровень: 10 вопросов × 10 баллов = 100 баллов (без практической части, 100% оценка по тесту).',
    bannerChoice: 'В листе уровня сотрудник выбирает A / B / C / D. Ключи находятся на отдельных листах комиссии.',
    bannerScale: 'Шкала: 0–49 — не соответствует; 50–64 — требуется развитие; 65–79 — соответствует; 80–89 — высокий уровень; 90–100 — кадровый резерв.',
    bannerDisclaimer: 'Это внутренний проект аттестации и приёма новых сотрудников. Перед официальным внедрением адаптируйте под требования объекта и стандарты компании.',

    navCandidate: 'Сдать Тест',
    navResults: 'Таблица Результатов',
    navKeys: 'Лист Ключей Комиссии',
    navQuestions: 'База Вопросов',
    ctaStartNew: 'Новый Тест',

    // Candidate Intake
    intakeTitle: 'Регистрация Кандидата / Мастера',
    intakeSubtitle: 'Заполните анкетные данные сотрудника и выберите уровень сложности аттестационного листа.',
    labelFullName: 'Ф.И.О. сотрудника / кандидата',
    placeholderFullName: 'Например: Рустамов Сардорбек Алишерович',
    labelPosition: 'Должность / Специализация',
    placeholderPosition: 'Например: Мастер монолитно-бетонных работ',
    labelSiteObject: 'Строительный объект / Проект',
    placeholderSiteObject: 'Например: Gardens Residence, Блок 4',
    labelPhone: 'Телефон или Табельный ID',
    placeholderPhone: '+998 90 123 45 67',
    labelLevel: 'Уровень сложности (Level)',
    startTestBtn: 'Начать Аттестационный Тест',
    quickFillDemoBtn: 'Заполнить демо-данными',
    validationError: 'Пожалуйста, корректно заполните все обязательные поля анкеты.',

    // Level descriptions
    levelTitle: {
      basic: 'Basic — Базовый уровень',
      intermediate: 'Intermediate — Средний инженерный уровень',
      advanced: 'Advanced — Продвинутый уровень (Старший мастер)',
    } as Record<DifficultyLevel, string>,
    levelDesc: {
      basic: 'Охрана труда и ТБ, базовые строительные правила, уход за бетоном, кирпичная кладка и инвентарь.',
      intermediate: 'Допуски СНиП/ШНК, геодезический контроль, защитный слой арматуры, акты скрытых работ.',
      advanced: 'ППР и график работ, сейсмостойкое строительство, неразрушающий контроль бетона и исполнительная документация.',
    } as Record<DifficultyLevel, string>,

    // Test Runner
    questionLabel: 'Вопрос',
    ofLabel: 'из',
    timeElapsedLabel: 'Время теста',
    pointsNotice: 'Каждый правильный ответ: 10 баллов · Всего: 100 баллов',
    answeredCountLabel: 'Отвечено вопросов',
    prevQuestionBtn: 'Предыдущий вопрос',
    nextQuestionBtn: 'Следующий вопрос',
    finishTestBtn: 'Завершить Тест и Рассчитать Балл',
    unansweredWarning: 'Внимание: Вы ответили не на все 10 вопросов. Пропущенные вопросы оцениваются в 0 баллов.',
    confirmSubmitBtn: 'Подтвердить и Показать Результат',
    cancelTestBtn: 'Отмена',

    // Result Screen
    resultHeader: 'Результат Аттестационного Тестирования',
    totalScoreLabel: 'Итоговый Балл',
    correctAnswersLabel: 'Правильных Ответов',
    qualificationVerdictLabel: 'Заключение По Шкале Комиссии',
    printProtocolBtn: 'Печать Протокола',
    newCandidateBtn: 'Следующий Кандидат',
    openHrResultsBtn: 'Открыть Таблицу HR',
    questionBreakdownTitle: 'Детальный Разбор Ответов По Листу Уровня',
    candidateChoiceLabel: 'Ответ сотрудника',
    correctKeyLabel: 'Ключ комиссии',
    noAnswerLabel: 'Нет ответа',
    normativeBasisLabel: 'Нормативная база',

    // Qualification Tiers
    tierNames: {
      not_qualified: 'Не соответствует',
      needs_development: 'Требуется развитие',
      qualified: 'Соответствует',
      high_level: 'Высокий уровень',
      talent_pool: 'Кадровый резерв',
    } as Record<QualificationTier, string>,
    tierRanges: {
      not_qualified: '0–49 баллов',
      needs_development: '50–64 балла',
      qualified: '65–79 баллов',
      high_level: '80–89 баллов',
      talent_pool: '90–100 баллов',
    } as Record<QualificationTier, string>,
    tierRecommendations: {
      not_qualified: 'Уровень знаний не соответствует минимальным требованиям. Рекомендуется повторная подготовка перед пересдачей.',
      needs_development: 'Базовые знания присутствуют, но требуется дополнительное обучение по допускам СНиП/ШНК и работа под контролем наставника.',
      qualified: 'Сотрудник полностью соответствует занимаемой должности мастера и допускается к самостоятельной работе на объекте.',
      high_level: 'Подтверждена высокая инженерная квалификация и отличное знание строительных норм. Рекомендован на ответственные участки.',
      talent_pool: 'Отличный результат. Рекомендован к включению в кадровый резерв на позицию старшего мастера / начальника участка.',
    } as Record<QualificationTier, string>,

    // Commission Gate
    commissionGateTitle: 'Панель HR и Аттестационной Комиссии',
    commissionGateDesc: 'Введите PIN-код комиссии для доступа к листам ключей, сводной ведомости кандидатов и редактору базы вопросов.',
    pinPlaceholder: 'PIN-код (По умолчанию: 2026)',
    unlockBtn: 'Открыть Панель Комиссии',
    quickUnlockBtn: 'Войти как член комиссии (2026)',
    pinError: 'Неверный PIN-код. Код комиссии по умолчанию: 2026',

    // HR Results View
    resultsTitle: 'Ведомость Результатов Аттестации',
    resultsSubtitle: 'Все протестированные кандидаты, классификация по 100-балльной шкале и протоколы.',
    searchPlaceholder: 'Поиск по Ф.И.О., должности или объекту...',
    filterAllLevels: 'Все уровни',
    filterAllTiers: 'Все статусы шкалы',
    exportCsvBtn: 'Скачать Excel / CSV',
    clearFilterBtn: 'Сбросить фильтры',
    viewProtocolBtn: 'Протокол',
    deleteRecordBtn: 'Удалить',
    emptyResultsText: 'По выбранным параметрам фильтрации записей не найдено.',

    // Commission Keys Sheet
    keysTitle: 'Лист Ключей Аттестационной Комиссии',
    keysSubtitle: 'Официальные ключи ответов A/B/C/D и нормативные ссылки для уровней Basic, Intermediate и Advanced.',
    printKeysBtn: 'Распечатать Лист Ключей',

    // Question Bank Manager
    questionsTitle: 'Управление Базой Вопросов',
    questionsSubtitle: 'Редактирование вопросов на узбекском и русском языках, добавление новых заданий и резервное копирование.',
    addQuestionBtn: 'Добавить Вопрос',
    exportJsonBtn: 'Экспорт Базы (JSON)',
    importJsonBtn: 'Импорт Базы (JSON)',
    resetDefaultBtn: 'Восстановить 30 стандартных вопросов',
    editBtn: 'Изменить',
    saveBtn: 'Сохранить',
    cancelBtn: 'Отмена',
  },
};

export function getText(lang: Language) {
  return UI_TEXT[lang];
}
