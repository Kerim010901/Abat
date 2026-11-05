// Nusga (mock) maglumatlar — demo üçin.
// Hakyky ulgamda bu maglumatlar serwerden / maglumat bazasyndan geler.

const STAGES = ['Kabul edildi', 'Barlagda', 'Abatlanýar', 'Taýýar'];

const STAGE_DESCRIPTIONS = [
  'Enjam merkeze kabul edildi.',
  'Enjamyň näsazlygy anyklanýar we abatlaýyş bahasy bellenýär.',
  'Ussa enjamyňyzy abatlaýar.',
  'Enjamyňyz taýýar. Merkezden alyp bilersiňiz.',
];

const MASTERS = ['Batyr Hojaýew', 'Myrat Gurbanow', 'Aman Rejepow'];

const MOCK_ORDERS = [
  {
    code: 'AB-2416', name: 'Gülşat Berdiýewa', phone: '+993 65 41-22-90',
    device: 'iPhone 14', problem: 'Suwa düşdi, açylmaýar',
    cost: null, stage: 0, master: null, date: '04.10.2026', time: '10:25', note: '',
    history: [{ text: 'Enjam kabul edildi', time: '04.10.2026 · 10:25' }],
  },
  {
    code: 'AB-2415', name: 'Merdan Saparow', phone: '+993 62 18-07-44',
    device: 'Samsung Galaxy S23', problem: 'Ses çykmaýar',
    cost: null, stage: 0, master: null, date: '04.10.2026', time: '09:50', note: '',
    history: [{ text: 'Enjam kabul edildi', time: '04.10.2026 · 09:50' }],
  },
  {
    code: 'AB-2414', name: 'Aýgül Meredowa', phone: '+993 61 77-31-05',
    device: 'Samsung Galaxy A22', problem: 'Batareýasy çalt gutarýar',
    cost: null, stage: 0, master: null, date: '04.10.2026', time: '09:10', note: '',
    history: [{ text: 'Enjam kabul edildi', time: '04.10.2026 · 09:10' }],
  },
  {
    code: 'AB-2413', name: 'Döwlet Amanow', phone: '+993 65 03-58-12',
    device: 'Xiaomi Redmi Note 12', problem: 'Zarýad almaýar',
    cost: null, stage: 1, master: 'Aman Rejepow', date: '03.10.2026', time: '17:40',
    note: 'Zarýad birleşdirijisi barlanýar.',
    history: [
      { text: 'Enjam kabul edildi', time: '03.10.2026 · 17:40' },
      { text: 'Barlagda · Ussa: Aman Rejepow', time: '04.10.2026 · 09:05' },
    ],
  },
  {
    code: 'AB-2412', name: 'Serdar Ataýew', phone: '+993 63 92-14-60',
    device: 'Samsung Galaxy A54', problem: 'Ekrany açylmaýar',
    cost: 650, stage: 1, master: 'Batyr Hojaýew', date: '03.10.2026', time: '16:50',
    note: 'Ekran çalşylmaly. Bölek sargyt edildi.',
    history: [
      { text: 'Enjam kabul edildi', time: '03.10.2026 · 16:50' },
      { text: 'Barlagda · Baha: 650 TMT', time: '03.10.2026 · 18:15' },
    ],
  },
  {
    code: 'AB-2411', name: 'Leýli Orazgeldiýewa', phone: '+993 64 25-66-81',
    device: 'Huawei P30 Lite', problem: 'Mikrofon işlemeýär',
    cost: 220, stage: 1, master: 'Myrat Gurbanow', date: '03.10.2026', time: '15:20',
    note: 'Mikrofon moduly barlanýar.',
    history: [
      { text: 'Enjam kabul edildi', time: '03.10.2026 · 15:20' },
      { text: 'Barlagda · Baha: 220 TMT', time: '03.10.2026 · 16:40' },
    ],
  },
  {
    code: 'AB-2410', name: 'Maksat Orazow', phone: '+993 65 11-48-27',
    device: 'iPhone 13 Pro', problem: 'Ekrany döwlen',
    cost: 850, stage: 2, master: 'Batyr Hojaýew', date: '02.10.2026', time: '11:15',
    note: 'Täze ekran oturdylýar.',
    history: [
      { text: 'Enjam kabul edildi', time: '02.10.2026 · 11:15' },
      { text: 'Barlagda · Baha: 850 TMT', time: '02.10.2026 · 12:30' },
      { text: 'Abatlanýar', time: '03.10.2026 · 10:10' },
    ],
  },
  {
    code: 'AB-2409', name: 'Mähri Annagulyýewa', phone: '+993 62 70-19-33',
    device: 'iPhone 11', problem: 'Kamerasy işlemeýär',
    cost: 380, stage: 2, master: 'Myrat Gurbanow', date: '02.10.2026', time: '10:05',
    note: 'Kamera moduly çalşylýar.',
    history: [
      { text: 'Enjam kabul edildi', time: '02.10.2026 · 10:05' },
      { text: 'Barlagda · Baha: 380 TMT', time: '02.10.2026 · 11:40' },
      { text: 'Abatlanýar', time: '03.10.2026 · 14:20' },
    ],
  },
  {
    code: 'AB-2408', name: 'Rowşen Nurmuhammedow', phone: '+993 61 34-85-02',
    device: 'Redmi Note 11', problem: 'Sensor ekranyň ýarysynda işlemeýär',
    cost: 540, stage: 2, master: 'Aman Rejepow', date: '01.10.2026', time: '18:00',
    note: 'Displeý moduly çalşylýar.',
    history: [
      { text: 'Enjam kabul edildi', time: '01.10.2026 · 18:00' },
      { text: 'Barlagda · Baha: 540 TMT', time: '02.10.2026 · 09:30' },
      { text: 'Abatlanýar', time: '03.10.2026 · 09:45' },
    ],
  },
  {
    code: 'AB-2407', name: 'Selbi Ataýewa', phone: '+993 65 58-20-76',
    device: 'iPhone 12', problem: 'Batareýasyny çalyşmak',
    cost: 450, stage: 3, master: 'Batyr Hojaýew', date: '01.10.2026', time: '16:30',
    note: 'Batareýa çalşyldy we enjam barlandy.',
    history: [
      { text: 'Enjam kabul edildi', time: '01.10.2026 · 16:30' },
      { text: 'Barlagda · Baha: 450 TMT', time: '01.10.2026 · 17:10' },
      { text: 'Abatlanýar', time: '02.10.2026 · 10:00' },
      { text: 'Taýýar', time: '02.10.2026 · 13:25' },
    ],
  },
  {
    code: 'AB-2406', name: 'Aýna Myradowa', phone: '+993 64 09-63-18',
    device: 'Xiaomi Redmi 10', problem: 'Zarýad girişini arassalamak',
    cost: 100, stage: 3, master: 'Aman Rejepow', date: '01.10.2026', time: '15:40',
    note: 'Zarýad girişi arassalandy. Enjam kadaly işleýär.',
    history: [
      { text: 'Enjam kabul edildi', time: '01.10.2026 · 15:40' },
      { text: 'Abatlanýar · Baha: 100 TMT', time: '01.10.2026 · 16:05' },
      { text: 'Taýýar', time: '01.10.2026 · 16:50' },
    ],
  },
  {
    code: 'AB-2405', name: 'Begenç Hydyrow', phone: '+993 63 47-15-29',
    device: 'Samsung Galaxy A32', problem: 'Programma üpjünçiligi gaty haýal',
    cost: 0, stage: 3, master: 'Myrat Gurbanow', date: '30.09.2026', time: '12:20',
    note: 'Ulgam täzelendi. Kepillik boýunça mugt.',
    history: [
      { text: 'Enjam kabul edildi', time: '30.09.2026 · 12:20' },
      { text: 'Abatlanýar · Baha: 0 TMT', time: '30.09.2026 · 14:00' },
      { text: 'Taýýar', time: '30.09.2026 · 17:35' },
    ],
  },
];

const MOCK_EVENTS = [
  { text: 'AB-2416 · Täze enjam kabul edildi', time: '04.10.2026 · 10:25' },
  { text: 'AB-2415 · Täze enjam kabul edildi', time: '04.10.2026 · 09:50' },
  { text: 'AB-2413 · Barlagda', time: '04.10.2026 · 09:05' },
  { text: 'AB-2412 · Baha: 650 TMT', time: '03.10.2026 · 18:15' },
];
