import {
  SportEvent,
  ParticipantRegistration,
  OrganizationSettings,
  SponsorPartner,
  GalleryItem,
  PaymentStatus,
  IDCardTemplate,
  ParticipantIDCardRecord,
  IDCardStatus,
  EventIDCardConfig
} from '../types';

import nightRun from '../../assets/images/night_run_poster_1793544244194.jpg';
import sportsHero from '../../assets/images/sports_hero_banner_1793544243318.jpg';
import cyclingTour from '../../assets/images/cycling_tour_poster_1793544244532.jpg';
import badmintonAction from '../../assets/images/badminton_action_poster_1793544244424.jpg';

const STORAGE_KEYS = {
  EVENTS: 'kinetix_events',
  REGISTRATIONS: 'kinetix_registrations',
  SETTINGS: 'kinetix_org_settings',
  SPONSORS: 'kinetix_sponsors',
  GALLERY: 'kinetix_gallery',
  ADMIN_AUTH: 'kinetix_admin_auth',
  IDCARD_TEMPLATES: 'kinetix_idcard_templates',
  PARTICIPANT_IDCARDS: 'kinetix_participant_idcards'
};

const DEFAULT_SETTINGS: OrganizationSettings = {
  name: 'KINETIX Sports Organizer',
  tagline: 'Make Every Moment a New Challenge',
  description: 'Organisasi penyelenggara berbagai kompetisi dan event olahraga bertaraf nasional dan regional, berkomitmen membangun semangat sportivitas dan gaya hidup sehat komunitas Indonesia.',
  vision: 'Menjadi platform dan penyelenggara event olahraga terdepan dan terpercaya di Indonesia yang menghubungkan jutaan atlet dan masyarakat.',
  mission: 'Menyelenggarakan kompetisi olahraga yang aman, profesional, inklusif, dan memberikan pengalaman berharga bagi setiap peserta.',
  email: 'info@kinetix.id',
  whatsapp: '+62 812-3456-7890',
  address: 'Gelora Sports Hub, Lantai 3, Jl. Pemuda Olahraga No. 88, Jawa Timur, Indonesia',
  instagram: '@kinetix.sports',
  youtube: 'KINETIX Sports Channel',
  qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126570014ID.LINKAJA.WWW01189360091430000000000215ID10200238475900303UMI51440014ID.CO.QRIS.WWW0215ID10200238475900303UMI5204581253033605802ID5921KINETIX%20SPORTS%20ORG6009BONDOWOSO61056821162070703A016304E85C',
  qrisMerchantName: 'KINETIX SPORTS INDONESIA',
  bankName: 'Bank Central Asia (BCA)',
  bankAccountNumber: '8220-891-234',
  bankAccountHolder: 'Yayasan Kinetix Olahraga Indonesia'
};

const DEFAULT_SPONSORS: SponsorPartner[] = [
  { id: 'sp-1', name: 'Garmin Official Timing', category: 'Title Sponsor', logoText: 'GARMIN' },
  { id: 'sp-2', name: 'Pocari Sweat Hydration', category: 'Official Partner', logoText: 'POCARI SWEAT' },
  { id: 'sp-3', name: 'Ortuseight Sportswear', category: 'Official Partner', logoText: 'ORTUSEIGHT' },
  { id: 'sp-4', name: 'Kompas Gramedia Sport', category: 'Media Partner', logoText: 'KOMPAS MEDIA' },
  { id: 'sp-5', name: 'KONI Jawa Timur', category: 'Supporting Partner', logoText: 'KONI JATIM' },
  { id: 'sp-6', name: 'RS Siloam Emergency Medical', category: 'Official Partner', logoText: 'SILOAM HOSPITALS' }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Gema Night Run Finishers Celebration',
    category: 'Running',
    imageUrl: nightRun,
    date: 'Desember 2025'
  },
  {
    id: 'gal-2',
    title: 'Morning Track & Field Sprint Session',
    category: 'Athletics',
    imageUrl: sportsHero,
    date: 'Januari 2026'
  },
  {
    id: 'gal-3',
    title: 'Peloton Ascending Ijen Highland Road',
    category: 'Cycling',
    imageUrl: cyclingTour,
    date: 'Februari 2026'
  },
  {
    id: 'gal-4',
    title: 'Final Match Indonesia Open Smash',
    category: 'Badminton',
    imageUrl: badmintonAction,
    date: 'Maret 2026'
  }
];

// --- BUILT-IN DEFAULT ID CARD TEMPLATES ---
const DEFAULT_ID_CARD_TEMPLATES: IDCardTemplate[] = [
  {
    id: 'tpl-athletic-neon',
    name: 'KINETIX Pro Athletic Neon (Badge)',
    description: 'Template modern bertema Padeluxe: background obsidian gelap, aksen lime neon, nomor BIB super jelas, dan QR code check-in tajam.',
    sizePreset: 'Badge',
    customWidthMm: 90,
    customHeightMm: 120,
    orientation: 'portrait',
    backgroundColor: '#101713',
    accentColor: '#9BE34A',
    textColor: '#FFFFFF',
    isDefault: true,
    isActive: true,
    version: 1,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
    elements: [
      { id: 'el-1', key: 'org_logo', label: 'Logo Organisasi', visible: true, x: 50, y: 6, fontSize: 13, fontWeight: 'black', color: '#FFFFFF', align: 'center', fontFamily: 'heading' },
      { id: 'el-2', key: 'event_name', label: 'Nama Event', visible: true, x: 50, y: 13, fontSize: 13, fontWeight: 'bold', color: '#9BE34A', align: 'center', fontFamily: 'heading' },
      { id: 'el-3', key: 'participant_photo', label: 'Foto Peserta', visible: true, x: 50, y: 28, align: 'center' },
      { id: 'el-4', key: 'bib_number', label: 'Nomor BIB', visible: true, x: 50, y: 50, fontSize: 32, fontWeight: 'black', color: '#9BE34A', align: 'center', fontFamily: 'mono' },
      { id: 'el-5', key: 'participant_name', label: 'Nama Peserta', visible: true, x: 50, y: 62, fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', align: 'center', fontFamily: 'heading' },
      { id: 'el-6', key: 'category', label: 'Kategori Race', visible: true, x: 50, y: 69, fontSize: 12, fontWeight: 'bold', color: '#101713', align: 'center', fontFamily: 'heading' },
      { id: 'el-7', key: 'reg_number', label: 'Nomor Registrasi', visible: true, x: 50, y: 77, fontSize: 10, fontWeight: 'normal', color: '#94A3B8', align: 'center', fontFamily: 'mono' },
      { id: 'el-8', key: 'qr_code', label: 'QR Code Check-In', visible: true, x: 50, y: 88, align: 'center' },
      { id: 'el-9', key: 'custom_badge_note', label: 'Status / Akses Badge', visible: true, x: 50, y: 97, fontSize: 9, fontWeight: 'bold', color: '#9BE34A', align: 'center', fontFamily: 'heading' }
    ]
  },
  {
    id: 'tpl-clean-white',
    name: 'Minimalist Elite White (Standard CR80)',
    description: 'Ukuran kartu kredit CR80 standar (86x54 mm). Bersih, minimalis, kontras tinggi, ideal untuk ID card pvc laminasi atau badge saku.',
    sizePreset: 'CR80',
    customWidthMm: 86,
    customHeightMm: 54,
    orientation: 'landscape',
    backgroundColor: '#FFFFFF',
    accentColor: '#9BE34A',
    textColor: '#101713',
    isDefault: false,
    isActive: true,
    version: 1,
    createdAt: '2026-10-05T00:00:00Z',
    updatedAt: '2026-10-05T00:00:00Z',
    elements: [
      { id: 'el-w1', key: 'org_logo', label: 'Logo Organisasi', visible: true, x: 20, y: 14, fontSize: 12, fontWeight: 'black', color: '#101713', align: 'left', fontFamily: 'heading' },
      { id: 'el-w2', key: 'event_name', label: 'Nama Event', visible: true, x: 20, y: 24, fontSize: 10, fontWeight: 'bold', color: '#047857', align: 'left', fontFamily: 'heading' },
      { id: 'el-w3', key: 'participant_photo', label: 'Foto Peserta', visible: true, x: 18, y: 62, align: 'center' },
      { id: 'el-w4', key: 'participant_name', label: 'Nama Peserta', visible: true, x: 52, y: 45, fontSize: 13, fontWeight: 'bold', color: '#101713', align: 'left', fontFamily: 'heading' },
      { id: 'el-w5', key: 'bib_number', label: 'Nomor BIB', visible: true, x: 52, y: 62, fontSize: 22, fontWeight: 'black', color: '#101713', align: 'left', fontFamily: 'mono' },
      { id: 'el-w6', key: 'category', label: 'Kategori Race', visible: true, x: 52, y: 76, fontSize: 10, fontWeight: 'bold', color: '#065F46', align: 'left', fontFamily: 'heading' },
      { id: 'el-w7', key: 'reg_number', label: 'Nomor Registrasi', visible: true, x: 52, y: 88, fontSize: 8, fontWeight: 'normal', color: '#64748B', align: 'left', fontFamily: 'mono' },
      { id: 'el-w8', key: 'qr_code', label: 'QR Code Check-In', visible: true, x: 86, y: 60, align: 'center' }
    ]
  },
  {
    id: 'tpl-titanium-dark',
    name: 'Stealth Championship Dark (Badge)',
    description: 'Desain titanium slate bertekstur garang untuk kejuaraan kompetitif dan balap sepeda/marathon prestisius.',
    sizePreset: 'Badge',
    customWidthMm: 90,
    customHeightMm: 120,
    orientation: 'portrait',
    backgroundColor: '#161F18',
    accentColor: '#A3E635',
    textColor: '#F8FAFC',
    isDefault: false,
    isActive: true,
    version: 1,
    createdAt: '2026-10-10T00:00:00Z',
    updatedAt: '2026-10-10T00:00:00Z',
    elements: [
      { id: 'el-t1', key: 'org_logo', label: 'Logo Organisasi', visible: true, x: 50, y: 6, fontSize: 13, fontWeight: 'black', color: '#FFFFFF', align: 'center', fontFamily: 'heading' },
      { id: 'el-t2', key: 'event_name', label: 'Nama Event', visible: true, x: 50, y: 13, fontSize: 12, fontWeight: 'bold', color: '#A3E635', align: 'center', fontFamily: 'heading' },
      { id: 'el-t3', key: 'participant_photo', label: 'Foto Peserta', visible: true, x: 50, y: 28, align: 'center' },
      { id: 'el-t4', key: 'bib_number', label: 'Nomor BIB', visible: true, x: 50, y: 50, fontSize: 32, fontWeight: 'black', color: '#A3E635', align: 'center', fontFamily: 'mono' },
      { id: 'el-t5', key: 'participant_name', label: 'Nama Peserta', visible: true, x: 50, y: 62, fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', align: 'center', fontFamily: 'heading' },
      { id: 'el-t6', key: 'category', label: 'Kategori Race', visible: true, x: 50, y: 69, fontSize: 11, fontWeight: 'bold', color: '#161F18', align: 'center', fontFamily: 'heading' },
      { id: 'el-t7', key: 'reg_number', label: 'Nomor Registrasi', visible: true, x: 50, y: 77, fontSize: 10, fontWeight: 'normal', color: '#94A3B8', align: 'center', fontFamily: 'mono' },
      { id: 'el-t8', key: 'qr_code', label: 'QR Code Check-In', visible: true, x: 50, y: 88, align: 'center' },
      { id: 'el-t9', key: 'custom_badge_note', label: 'Status / Akses Badge', visible: true, x: 50, y: 97, fontSize: 9, fontWeight: 'bold', color: '#A3E635', align: 'center', fontFamily: 'heading' }
    ]
  }
];

const DEFAULT_EVENTS: SportEvent[] = [
  {
    id: 'event-gnr-2026',
    slug: 'gema-night-run-bondowoso-2026',
    name: 'Gema Night Run Bondowoso 2026',
    sportCategory: 'running',
    sportCategoryLabel: 'Running / Marathon',
    description: 'Rasakan sensasi gemerlap malam di jantung kota Bondowoso! Gema Night Run Bondowoso 2026 menghadirkan rute lari malam yang eksotis mengitari landmark bersejarah dan pusat kebudayaan Alun-alun Ki Ronggo Bondowoso dengan lighting megah dan hiburan musik di sepanjang race route.',
    posterUrl: nightRun,
    eventDate: '2026-12-15',
    eventTime: '18:30 WIB (Flag-off)',
    location: 'Alun-alun Bondowoso',
    locationDetails: 'Titik Kumpul: Depan Monumen Gerbong Maut, Alun-alun Ki Ronggo, Bondowoso, Jawa Timur',
    registrationDeadline: '2026-12-01',
    status: 'published',
    isFeatured: true,
    organizerName: 'KINETIX Sports & Dispora Bondowoso',
    organizerContact: '+62 812-3456-7890',
    idCardConfig: {
      enabled: true,
      templateId: 'tpl-athletic-neon',
      sizePreset: 'Badge',
      orientation: 'portrait',
      allowPhotoUpload: true,
      showParticipantPhoto: true,
      customBadgeNote: 'ALL ACCESS ATHLETE'
    },
    facilitiesOverview: [
      'Nomor BIB dengan RFID Timing Chip',
      'Exclusive Finisher Medal (Zinc Alloy Glow-in-the-dark)',
      'Sublimation Dri-Fit Running Jersey',
      'Official Participant ID Card / Badge',
      'Race Pack Goodie Bag & Sponsor Gifts',
      'Water Station setiap 2.5 KM & Refreshment',
      'Asuransi Perlindungan Kecelakaan Diri',
      'Medical Support Ambulance & Tim Medis Siaga'
    ],
    rulesAndPodium: 'Podium Terbuka untuk Kategori 10K dan 21K (Juara 1, 2, dan 3 Kategori Putra & Putri). Total hadiah senilai puluhan juta rupiah, piala kejuaraan, serta sertifikat resmi.',
    faqList: [
      {
        question: 'Kapan dan di mana pengambilan Race Pack (RPC) dan ID Card?',
        answer: 'Pengambilan Race Pack & ID Card fisik dilaksanakan pada H-2 dan H-1 sebelum event di Pendopo Kabupaten Bondowoso, pukul 09.00 - 20.00 WIB dengan menunjukkan E-Ticket / Digital ID Card di smartphone dan identitas asli.'
      },
      {
        question: 'Apakah ID Card memiliki QR Code untuk check-in?',
        answer: 'Ya, ID Card resmi dilengkapi QR Code unik yang terhubung langsung dengan database registrasi untuk verifikasi di Gate Masuk & pos pengambilan race kit.'
      },
      {
        question: 'Apakah foto wajah wajib diunggah?',
        answer: 'Pengunggahan foto wajah bersifat opsional. Jika tidak diunggah, ID Card akan menampilkan siluet monogram atlet resmi.'
      }
    ],
    categories: [
      {
        id: 'cat-5k',
        name: '5K Fun Run',
        description: 'Jarak bersahabat untuk pemula, keluarga, dan komunitas santai.',
        price: 125000,
        quota: 500,
        registeredCount: 382,
        isActive: true,
        facilities: ['Nomor BIB', 'ID Card', 'Medali Finisher', 'Jersey Event', 'Race Pack', 'Refreshment']
      },
      {
        id: 'cat-10k',
        name: '10K Challenge',
        description: 'Tantangan menengah dengan cut-off time 2 jam dan podium juara putra/putri.',
        price: 150000,
        quota: 400,
        registeredCount: 295,
        isActive: true,
        facilities: ['Nomor BIB Timing Chip', 'Official ID Card', 'Medali Finisher', 'Jersey Event', 'Race Pack', 'Hydration', 'Podium Prize']
      },
      {
        id: 'cat-21k',
        name: '21K Half Marathon',
        description: 'Rute prestisius menguji ketahanan stamina melintasi perimeter kota malam.',
        price: 200000,
        quota: 250,
        registeredCount: 198,
        isActive: true,
        facilities: ['Nomor BIB Timing Chip', 'Official ID Card VIP', 'Medali Finisher Eksklusif', 'Jersey Finisher & Event', 'Race Pack VIP', 'Isotonic Stations', 'Podium Prize']
      }
    ],
    formFields: [
      { id: 'f-1', label: 'Kategori Race', fieldName: 'categoryId', type: 'select', required: true, helperText: 'Pilih jarak tempuh race Anda' },
      { id: 'f-2', label: 'Ukuran Jersey Event Finisher', fieldName: 'jerseySize', type: 'select', required: true, options: ['S', 'M', 'L', 'XL', 'XXL'], helperText: 'Pilih ukuran jersey event lari Anda' },
      { id: 'f-3', label: 'Nama Lengkap', fieldName: 'fullName', type: 'text', required: true, placeholder: 'Nama lengkap sesuai KTP / KIA / Kartu Pelajar' },
      { id: 'f-4', label: 'Jenis Kelamin', fieldName: 'gender', type: 'select', required: true, options: ['Laki-laki', 'Perempuan'], helperText: 'Kategori podium Putra dan Putri dipisahkan' },
      { id: 'f-5', label: 'Tempat Lahir', fieldName: 'birthPlace', type: 'text', required: true, placeholder: 'Contoh: Bondowoso' },
      { id: 'f-6', label: 'Tanggal Lahir', fieldName: 'birthDate', type: 'date', required: true, helperText: 'Format DD/MM/YYYY' },
      { id: 'f-7', label: 'Alamat Domisili Lengkap', fieldName: 'address', type: 'textarea', required: true, placeholder: 'Contoh: Jl. Diponegoro No. 12, Kel. Kotakulon, Bondowoso' },
      { id: 'f-8', label: 'Nomor WhatsApp / HP', fieldName: 'phone', type: 'tel', required: true, placeholder: '081234567890' },
      { id: 'f-9', label: 'Alamat Email', fieldName: 'email', type: 'email', required: true, placeholder: 'nama@email.com', helperText: 'E-ticket dan ID Card QR Code akan dikirim ke email ini' }
    ]
  },
  {
    id: 'event-ijen-cycling-2026',
    slug: 'ijen-volcano-cycling-challenge-2026',
    name: 'Ijen Volcano Cycling Challenge 2026',
    sportCategory: 'cycling',
    sportCategoryLabel: 'Cycling / Sepeda',
    description: 'Taklukkan tanjakan legendaris Gunung Ijen dalam ajang gran fondo road bike paling menantang di Jawa Timur dengan elevasi gain hingga 1.800 mdpl dikelilingi hutan pinus nan asri.',
    posterUrl: cyclingTour,
    eventDate: '2026-11-28',
    eventTime: '06:00 WIB',
    location: 'Banyuwangi - Bondowoso - Paltuding Ijen',
    locationDetails: 'Start: Taman Blambangan, Finish: Paltuding Ijen Resort',
    registrationDeadline: '2026-11-15',
    status: 'published',
    isFeatured: true,
    organizerName: 'KINETIX Sports & East Java Cycling Federation',
    organizerContact: '+62 813-9876-5432',
    idCardConfig: {
      enabled: true,
      templateId: 'tpl-titanium-dark',
      sizePreset: 'Badge',
      orientation: 'portrait',
      allowPhotoUpload: true,
      showParticipantPhoto: true,
      customBadgeNote: 'RIDER PASS'
    },
    facilitiesOverview: [
      'Timing Transponder & BIB Frame',
      'Official Rider ID Badge',
      'Cycling Jersey Castelli Material',
      'Finisher Medal & Certificate',
      'Buffet Lunch di Paltuding Ijen'
    ],
    categories: [
      {
        id: 'cat-granfondo',
        name: 'Gran Fondo 120K KOM Challenge',
        price: 450000,
        quota: 300,
        registeredCount: 210,
        isActive: true,
        facilities: ['Jersey Premium', 'ID Badge', 'Transponder Timing', 'Medali Finisher', 'Makan Siang Buffet']
      },
      {
        id: 'cat-mediofondo',
        name: 'Medio Fondo 60K Scenic Ride',
        price: 325000,
        quota: 250,
        registeredCount: 180,
        isActive: true,
        facilities: ['Jersey Event', 'ID Badge', 'Medali Finisher', 'Refreshment']
      }
    ],
    formFields: [
      { id: 'f-c1', label: 'Kategori Tour', fieldName: 'categoryId', type: 'select', required: true },
      { id: 'f-c2', label: 'Ukuran Jersey Cycling', fieldName: 'jerseySize', type: 'select', required: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'f-c3', label: 'Nama Lengkap Peserta', fieldName: 'fullName', type: 'text', required: true, placeholder: 'Sesuai KTP' },
      { id: 'f-c4', label: 'Nama Komunitas / Team Sepeda', fieldName: 'teamName', type: 'text', required: false, placeholder: 'Contoh: Ijen Road Club' },
      { id: 'f-c5', label: 'Golongan Darah', fieldName: 'bloodType', type: 'select', required: true, options: ['A', 'B', 'AB', 'O'] },
      { id: 'f-c6', label: 'Kontak Darurat (Nama & No HP)', fieldName: 'emergencyContact', type: 'text', required: true, placeholder: 'Nama Kerabat - 0812xxxx' },
      { id: 'f-c7', label: 'Nomor WhatsApp', fieldName: 'phone', type: 'tel', required: true, placeholder: '081234567890' },
      { id: 'f-c8', label: 'Email', fieldName: 'email', type: 'email', required: true, placeholder: 'nama@email.com' }
    ]
  },
  {
    id: 'event-badminton-open-2026',
    slug: 'east-java-badminton-open-2026',
    name: 'East Java Badminton Open Championship 2026',
    sportCategory: 'badminton',
    sportCategoryLabel: 'Badminton / Bulutangkis',
    description: 'Kejuaraan bulutangkis terbuka se-Jawa & Bali mempertandingkan kategori Tunggal Putra, Tunggal Putri, dan Ganda Campuran dengan sistem gugur BWF Standard.',
    posterUrl: badmintonAction,
    eventDate: '2026-12-20',
    eventTime: '08:00 WIB',
    location: 'GOR Bulutangkis Gelora Merdeka',
    locationDetails: 'Jl. Ahmad Yani No. 45, GOR Utama Karpet Yonex BWF Grade 2',
    registrationDeadline: '2026-12-10',
    status: 'published',
    isFeatured: false,
    organizerName: 'PBSI Pengprov & KINETIX Sports',
    organizerContact: '+62 821-4455-6677',
    idCardConfig: {
      enabled: true,
      templateId: 'tpl-clean-white',
      sizePreset: 'CR80',
      orientation: 'landscape',
      allowPhotoUpload: true,
      showParticipantPhoto: true,
      customBadgeNote: 'PLAYER BADGE'
    },
    facilitiesOverview: [
      'Official Player ID Card',
      'Official Tournament Shirt',
      'Shuttlecock Yonex AS-30 Official',
      'Wasit Bersertifikat Nasional',
      'Total Hadiah Uang Pembinaan Rp 50.000.000'
    ],
    categories: [
      {
        id: 'cat-bad-singles',
        name: 'Tunggal Putra Open',
        price: 175000,
        quota: 64,
        registeredCount: 48,
        isActive: true,
        facilities: ['ID Card', 'Tournament Shirt', 'Sertifikat', 'Shuttlecock Match']
      },
      {
        id: 'cat-bad-doubles',
        name: 'Ganda Campuran Open',
        price: 250000,
        quota: 32,
        registeredCount: 26,
        isActive: true,
        facilities: ['2x ID Card', '2x Tournament Shirt', 'Sertifikat', 'Shuttlecock Match']
      }
    ],
    formFields: [
      { id: 'f-b1', label: 'Kategori Tanding', fieldName: 'categoryId', type: 'select', required: true },
      { id: 'f-b2', label: 'Nama Atlet / Pemain 1', fieldName: 'fullName', type: 'text', required: true, placeholder: 'Nama Lengkap' },
      { id: 'f-b3', label: 'Nama Pemain 2 (Untuk Kategori Ganda)', fieldName: 'partnerName', type: 'text', required: false, placeholder: 'Nama Pasangan Tanding' },
      { id: 'f-b4', label: 'Nama PB / Klub Asal', fieldName: 'clubName', type: 'text', required: true, placeholder: 'Contoh: PB Rajawali' },
      { id: 'f-b5', label: 'Nomor WhatsApp', fieldName: 'phone', type: 'tel', required: true, placeholder: '081234567890' },
      { id: 'f-b6', label: 'Email', fieldName: 'email', type: 'email', required: true, placeholder: 'nama@email.com' }
    ]
  }
];

const DEFAULT_REGISTRATIONS: ParticipantRegistration[] = [
  {
    id: 'reg-001',
    registrationNumber: 'GNR-2026-8812',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    categoryId: 'cat-5k',
    categoryName: '5K Fun Run',
    amount: 125000,
    status: 'waiting_verification',
    registeredAt: '2026-10-30T14:22:00Z',
    fullName: 'Dimas Prasetyo',
    email: 'dimas.prasetyo@example.com',
    phone: '081234567811',
    gender: 'Laki-laki',
    birthPlace: 'Bondowoso',
    birthDate: '1998-05-14',
    address: 'Jl. Diponegoro No. 12, Kel. Kotakulon, Bondowoso',
    jerseySize: 'L',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    paymentProofUploadedAt: '2026-10-30T14:35:00Z',
    isCheckedIn: false,
    idCardStatus: 'not_generated'
  },
  {
    id: 'reg-002',
    registrationNumber: 'GNR-2026-9041',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    categoryId: 'cat-10k',
    categoryName: '10K Challenge',
    amount: 150000,
    status: 'approved',
    registeredAt: '2026-10-28T09:10:00Z',
    fullName: 'Siti Nur Aisyah',
    email: 'siti.aisyah@example.com',
    phone: '081987654321',
    gender: 'Perempuan',
    birthPlace: 'Jember',
    birthDate: '2000-08-21',
    address: 'Jl. Trunojoyo No. 44, Patrang, Jember',
    jerseySize: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    paymentProofUploadedAt: '2026-10-28T09:20:00Z',
    paymentVerifiedAt: '2026-10-28T10:15:00Z',
    ticketCode: 'TK-GNR26-9041-A89F',
    bibNumber: 'BIB-1042',
    isCheckedIn: false,
    idCardStatus: 'published',
    idCardIssuedAt: '2026-10-28T10:15:00Z'
  },
  {
    id: 'reg-003',
    registrationNumber: 'GNR-2026-7734',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    categoryId: 'cat-21k',
    categoryName: '21K Half Marathon',
    amount: 200000,
    status: 'approved',
    registeredAt: '2026-10-25T11:00:00Z',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    phone: '082133445566',
    gender: 'Laki-laki',
    birthPlace: 'Surabaya',
    birthDate: '1992-11-03',
    address: 'Jl. Manyar Kertoarjo No. 10, Surabaya',
    jerseySize: 'XL',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    paymentProofUploadedAt: '2026-10-25T11:15:00Z',
    paymentVerifiedAt: '2026-10-25T13:00:00Z',
    ticketCode: 'TK-GNR26-7734-C33B',
    bibNumber: 'BIB-2015',
    isCheckedIn: true,
    checkedInAt: '2026-11-01T06:15:00Z',
    checkedInBy: 'Panitia Gate A',
    idCardStatus: 'published',
    idCardIssuedAt: '2026-10-25T13:00:00Z'
  },
  {
    id: 'reg-004',
    registrationNumber: 'GNR-2026-4419',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    categoryId: 'cat-5k',
    categoryName: '5K Fun Run',
    amount: 125000,
    status: 'pending_payment',
    registeredAt: '2026-10-31T16:40:00Z',
    fullName: 'Rizky Maulana',
    email: 'rizky.m@example.com',
    phone: '085712349988',
    gender: 'Laki-laki',
    birthPlace: 'Situbondo',
    birthDate: '2002-02-17',
    address: 'Jl. Merak No. 8, Situbondo',
    jerseySize: 'L',
    isCheckedIn: false,
    idCardStatus: 'not_generated'
  },
  {
    id: 'reg-005',
    registrationNumber: 'GNR-2026-2210',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    categoryId: 'cat-5k',
    categoryName: '5K Fun Run',
    amount: 125000,
    status: 'rejected',
    registeredAt: '2026-10-29T10:00:00Z',
    fullName: 'Agus Setiawan',
    email: 'agus.setiawan@example.com',
    phone: '081399887766',
    gender: 'Laki-laki',
    birthPlace: 'Bondowoso',
    birthDate: '1995-07-09',
    address: 'Jl. Santawi No. 19, Bondowoso',
    jerseySize: 'M',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    paymentProofUploadedAt: '2026-10-29T10:10:00Z',
    rejectionReason: 'Nominal transfer pada resi tidak sesuai (hanya tertera Rp 50.000, seharusnya Rp 125.000). Silakan upload bukti pelunasan.',
    isCheckedIn: false,
    idCardStatus: 'not_generated'
  }
];

// Pre-seeded ID Card Records
const DEFAULT_PARTICIPANT_IDCARDS: ParticipantIDCardRecord[] = [
  {
    id: 'idc-reg-002',
    registrationId: 'reg-002',
    registrationNumber: 'GNR-2026-9041',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    participantName: 'Siti Nur Aisyah',
    bibNumber: 'BIB-1042',
    categoryName: '10K Challenge',
    status: 'published',
    templateId: 'tpl-athletic-neon',
    templateVersion: 1,
    templateSnapshot: DEFAULT_ID_CARD_TEMPLATES[0],
    qrToken: 'TK-GNR26-9041-A89F',
    participantPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    generatedAt: '2026-10-28T10:15:00Z',
    auditLogs: [
      {
        action: 'generated',
        timestamp: '2026-10-28T10:15:00Z',
        actor: 'Sistem Pembayaran Auto-Verify'
      },
      {
        action: 'published',
        timestamp: '2026-10-28T10:15:05Z',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'idc-reg-003',
    registrationId: 'reg-003',
    registrationNumber: 'GNR-2026-7734',
    eventId: 'event-gnr-2026',
    eventName: 'Gema Night Run Bondowoso 2026',
    participantName: 'Budi Santoso',
    bibNumber: 'BIB-2015',
    categoryName: '21K Half Marathon',
    status: 'published',
    templateId: 'tpl-athletic-neon',
    templateVersion: 1,
    templateSnapshot: DEFAULT_ID_CARD_TEMPLATES[0],
    qrToken: 'TK-GNR26-7734-C33B',
    participantPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    generatedAt: '2026-10-25T13:00:00Z',
    auditLogs: [
      {
        action: 'generated',
        timestamp: '2026-10-25T13:00:00Z',
        actor: 'Admin'
      },
      {
        action: 'published',
        timestamp: '2026-10-25T13:01:00Z',
        actor: 'Admin'
      }
    ]
  }
];

class StorageService {
  private notifyListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('kinetix_data_changed'));
    }
  }

  // --- EVENTS ---
  getEvents(): SportEvent[] {
    if (typeof window === 'undefined') return DEFAULT_EVENTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
        return DEFAULT_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_EVENTS;
    }
  }

  getEventBySlug(slug: string): SportEvent | undefined {
    return this.getEvents().find(e => e.slug === slug);
  }

  getEventById(id: string): SportEvent | undefined {
    return this.getEvents().find(e => e.id === id);
  }

  saveEvent(event: SportEvent): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index >= 0) {
      events[index] = event;
    } else {
      events.unshift(event);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.notifyListeners();
  }

  deleteEvent(id: string): void {
    const events = this.getEvents().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.notifyListeners();
  }

  // --- REGISTRATIONS ---
  getRegistrations(): ParticipantRegistration[] {
    if (typeof window === 'undefined') return DEFAULT_REGISTRATIONS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(DEFAULT_REGISTRATIONS));
        return DEFAULT_REGISTRATIONS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_REGISTRATIONS;
    }
  }

  getRegistrationById(id: string): ParticipantRegistration | undefined {
    return this.getRegistrations().find(r => r.id === id);
  }

  getRegistrationByNumber(regNumber: string): ParticipantRegistration | undefined {
    const cleanNumber = regNumber.trim().toUpperCase();
    return this.getRegistrations().find(r => r.registrationNumber.toUpperCase() === cleanNumber);
  }

  findRegistration(regNumber: string, email: string): ParticipantRegistration | undefined {
    const cleanNum = regNumber.trim().toUpperCase();
    const cleanMail = email.trim().toLowerCase();
    return this.getRegistrations().find(
      r => r.registrationNumber.toUpperCase() === cleanNum && r.email.trim().toLowerCase() === cleanMail
    );
  }

  saveRegistration(reg: ParticipantRegistration): void {
    const list = this.getRegistrations();
    const index = list.findIndex(r => r.id === reg.id);
    if (index >= 0) {
      list[index] = reg;
    } else {
      list.unshift(reg);
      // Increment event category registration count
      const events = this.getEvents();
      const ev = events.find(e => e.id === reg.eventId);
      if (ev) {
        const cat = ev.categories.find(c => c.id === reg.categoryId);
        if (cat) {
          cat.registeredCount = (cat.registeredCount || 0) + 1;
          this.saveEvent(ev);
        }
      }
    }
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
    this.notifyListeners();
  }

  updateRegistrationStatus(
    id: string,
    status: PaymentStatus,
    options?: { rejectionReason?: string; verifiedBy?: string }
  ): ParticipantRegistration | null {
    const list = this.getRegistrations();
    const item = list.find(r => r.id === id);
    if (!item) return null;

    item.status = status;
    if (status === 'approved') {
      item.paymentVerifiedAt = new Date().toISOString();
      if (!item.ticketCode) {
        item.ticketCode = `TK-${item.registrationNumber}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      }
      if (!item.bibNumber) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        item.bibNumber = `BIB-${randomNum}`;
      }
      item.rejectionReason = undefined;

      // Automatically generate ID Card if event has ID card enabled
      const event = this.getEventById(item.eventId);
      if (event?.idCardConfig?.enabled !== false) {
        this.generateParticipantIDCard(item.id, options?.verifiedBy || 'Admin Verifikasi');
      }
    } else if (status === 'rejected') {
      item.rejectionReason = options?.rejectionReason || 'Bukti pembayaran tidak sesuai atau tidak terbaca.';
    }

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
    this.notifyListeners();
    return item;
  }

  verifyCheckIn(ticketOrRegCode: string, checkedInBy: string = 'Admin Scanner'): {
    success: boolean;
    message: string;
    participant?: ParticipantRegistration;
    alreadyCheckedIn?: boolean;
  } {
    const query = ticketOrRegCode.trim().toUpperCase();
    const list = this.getRegistrations();
    const participant = list.find(
      r => r.ticketCode?.toUpperCase() === query || r.registrationNumber.toUpperCase() === query
    );

    if (!participant) {
      return {
        success: false,
        message: 'QR Code atau Nomor Registrasi tidak terdaftar di sistem.'
      };
    }

    if (participant.status !== 'approved') {
      return {
        success: false,
        message: `Status pembayaran peserta adalah "${participant.status.replace('_', ' ').toUpperCase()}". Check-in hanya untuk peserta yang telah disetujui (Approved).`,
        participant
      };
    }

    if (participant.isCheckedIn) {
      return {
        success: false,
        alreadyCheckedIn: true,
        message: `Peserta SUDAH Check-in sebelumnya pada ${new Date(participant.checkedInAt || '').toLocaleString('id-ID')} oleh ${participant.checkedInBy || 'Petugas'}. Check-in ganda DITOLAK.`,
        participant
      };
    }

    // Mark as checked in
    participant.isCheckedIn = true;
    participant.checkedInAt = new Date().toISOString();
    participant.checkedInBy = checkedInBy;

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list));
    this.notifyListeners();

    return {
      success: true,
      message: 'Check-in BERHASIL! Selamat bertanding!',
      participant
    };
  }

  // --- ID CARD TEMPLATES ---
  getIDCardTemplates(): IDCardTemplate[] {
    if (typeof window === 'undefined') return DEFAULT_ID_CARD_TEMPLATES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDCARD_TEMPLATES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.IDCARD_TEMPLATES, JSON.stringify(DEFAULT_ID_CARD_TEMPLATES));
        return DEFAULT_ID_CARD_TEMPLATES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ID_CARD_TEMPLATES;
    }
  }

  getIDCardTemplateById(id: string): IDCardTemplate | undefined {
    return this.getIDCardTemplates().find(t => t.id === id);
  }

  saveIDCardTemplate(template: IDCardTemplate): void {
    const templates = this.getIDCardTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    template.updatedAt = new Date().toISOString();
    
    if (index >= 0) {
      template.version = (templates[index].version || 1) + 1;
      templates[index] = template;
    } else {
      template.version = 1;
      template.createdAt = new Date().toISOString();
      templates.unshift(template);
    }

    localStorage.setItem(STORAGE_KEYS.IDCARD_TEMPLATES, JSON.stringify(templates));
    this.notifyListeners();
  }

  deleteIDCardTemplate(id: string): { success: boolean; message: string } {
    // Check if any event is currently using this template
    const events = this.getEvents();
    const usingEvent = events.find(e => e.idCardConfig?.templateId === id);
    if (usingEvent) {
      return {
        success: false,
        message: `Template sedang digunakan oleh event "${usingEvent.name}". Ubah template event terlebih dahulu sebelum menghapus.`
      };
    }

    const templates = this.getIDCardTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.IDCARD_TEMPLATES, JSON.stringify(templates));
    this.notifyListeners();
    return { success: true, message: 'Template ID Card berhasil dihapus.' };
  }

  // --- PARTICIPANT ID CARDS ---
  getParticipantIDCards(): ParticipantIDCardRecord[] {
    if (typeof window === 'undefined') return DEFAULT_PARTICIPANT_IDCARDS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_IDCARDS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PARTICIPANT_IDCARDS, JSON.stringify(DEFAULT_PARTICIPANT_IDCARDS));
        return DEFAULT_PARTICIPANT_IDCARDS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PARTICIPANT_IDCARDS;
    }
  }

  getParticipantIDCardByRegId(registrationId: string): ParticipantIDCardRecord | undefined {
    return this.getParticipantIDCards().find(c => c.registrationId === registrationId);
  }

  getParticipantIDCardByRegNumber(regNumber: string): ParticipantIDCardRecord | undefined {
    const cleanNum = regNumber.trim().toUpperCase();
    return this.getParticipantIDCards().find(c => c.registrationNumber.toUpperCase() === cleanNum);
  }

  generateParticipantIDCard(registrationId: string, actor: string = 'Admin'): ParticipantIDCardRecord | null {
    const reg = this.getRegistrationById(registrationId);
    if (!reg) return null;

    const event = this.getEventById(reg.eventId);
    if (!event) return null;

    const templateId = event.idCardConfig?.templateId || 'tpl-athletic-neon';
    const template = this.getIDCardTemplateById(templateId) || this.getIDCardTemplates()[0];

    const qrToken = reg.ticketCode || reg.registrationNumber;

    const cards = this.getParticipantIDCards();
    const existingIndex = cards.findIndex(c => c.registrationId === registrationId);

    const record: ParticipantIDCardRecord = {
      id: existingIndex >= 0 ? cards[existingIndex].id : `idc-${reg.id}`,
      registrationId: reg.id,
      registrationNumber: reg.registrationNumber,
      eventId: reg.eventId,
      eventName: reg.eventName,
      participantName: reg.fullName,
      bibNumber: reg.bibNumber || 'BIB-0000',
      categoryName: reg.categoryName,
      status: 'published',
      templateId: template.id,
      templateVersion: template.version,
      templateSnapshot: JSON.parse(JSON.stringify(template)),
      qrToken,
      participantPhotoUrl: reg.photoUrl,
      generatedAt: existingIndex >= 0 ? cards[existingIndex].generatedAt : new Date().toISOString(),
      lastRegeneratedAt: existingIndex >= 0 ? new Date().toISOString() : undefined,
      regeneratedBy: existingIndex >= 0 ? actor : undefined,
      auditLogs: existingIndex >= 0 ? [
        ...cards[existingIndex].auditLogs,
        {
          action: 'regenerated',
          timestamp: new Date().toISOString(),
          actor,
          reason: 'Penerbitan ulang snapshot data & template'
        }
      ] : [
        {
          action: 'generated',
          timestamp: new Date().toISOString(),
          actor
        },
        {
          action: 'published',
          timestamp: new Date().toISOString(),
          actor
        }
      ]
    };

    if (existingIndex >= 0) {
      cards[existingIndex] = record;
    } else {
      cards.unshift(record);
    }

    // Update registration state
    reg.idCardStatus = 'published';
    reg.idCardIssuedAt = record.generatedAt;
    this.saveRegistration(reg);

    localStorage.setItem(STORAGE_KEYS.PARTICIPANT_IDCARDS, JSON.stringify(cards));
    this.notifyListeners();
    return record;
  }

  regenerateParticipantIDCard(registrationId: string, actor: string = 'Admin', reason?: string): ParticipantIDCardRecord | null {
    const reg = this.getRegistrationById(registrationId);
    if (!reg) return null;

    const event = this.getEventById(reg.eventId);
    if (!event) return null;

    const templateId = event.idCardConfig?.templateId || 'tpl-athletic-neon';
    const template = this.getIDCardTemplateById(templateId) || this.getIDCardTemplates()[0];

    const cards = this.getParticipantIDCards();
    const existingIndex = cards.findIndex(c => c.registrationId === registrationId);

    const prevAuditLogs = existingIndex >= 0 ? cards[existingIndex].auditLogs : [];

    const record: ParticipantIDCardRecord = {
      id: existingIndex >= 0 ? cards[existingIndex].id : `idc-${reg.id}`,
      registrationId: reg.id,
      registrationNumber: reg.registrationNumber,
      eventId: reg.eventId,
      eventName: reg.eventName,
      participantName: reg.fullName,
      bibNumber: reg.bibNumber || 'BIB-0000',
      categoryName: reg.categoryName,
      status: 'published',
      templateId: template.id,
      templateVersion: template.version,
      templateSnapshot: JSON.parse(JSON.stringify(template)),
      qrToken: reg.ticketCode || reg.registrationNumber,
      participantPhotoUrl: reg.photoUrl,
      generatedAt: existingIndex >= 0 ? cards[existingIndex].generatedAt : new Date().toISOString(),
      lastRegeneratedAt: new Date().toISOString(),
      regeneratedBy: actor,
      auditLogs: [
        ...prevAuditLogs,
        {
          action: 'regenerated',
          timestamp: new Date().toISOString(),
          actor,
          reason: reason || 'Regenerasi eksplisit oleh Admin'
        }
      ]
    };

    if (existingIndex >= 0) {
      cards[existingIndex] = record;
    } else {
      cards.unshift(record);
    }

    reg.idCardStatus = 'published';
    this.saveRegistration(reg);

    localStorage.setItem(STORAGE_KEYS.PARTICIPANT_IDCARDS, JSON.stringify(cards));
    this.notifyListeners();
    return record;
  }

  updateIDCardStatus(idCardRecordId: string, status: IDCardStatus, actor: string = 'Admin', reason?: string): boolean {
    const cards = this.getParticipantIDCards();
    const card = cards.find(c => c.id === idCardRecordId);
    if (!card) return false;

    card.status = status;
    card.auditLogs.push({
      action: status === 'revoked' ? 'revoked' : 'published',
      timestamp: new Date().toISOString(),
      actor,
      reason
    });

    // Update in participant record too
    const reg = this.getRegistrationById(card.registrationId);
    if (reg) {
      reg.idCardStatus = status;
      this.saveRegistration(reg);
    }

    localStorage.setItem(STORAGE_KEYS.PARTICIPANT_IDCARDS, JSON.stringify(cards));
    this.notifyListeners();
    return true;
  }

  bulkGenerateIDCards(registrationIds: string[], actor: string = 'Admin'): { successCount: number; errors: string[] } {
    let count = 0;
    const errors: string[] = [];

    for (const regId of registrationIds) {
      const reg = this.getRegistrationById(regId);
      if (!reg) {
        errors.push(`ID ${regId} tidak ditemukan.`);
        continue;
      }
      if (reg.status !== 'approved') {
        errors.push(`${reg.fullName} (${reg.registrationNumber}) belum approved.`);
        continue;
      }
      const res = this.generateParticipantIDCard(regId, actor);
      if (res) count++;
    }

    return { successCount: count, errors };
  }

  // --- SETTINGS ---
  getSettings(): OrganizationSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: OrganizationSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notifyListeners();
  }

  // --- SPONSORS ---
  getSponsors(): SponsorPartner[] {
    if (typeof window === 'undefined') return DEFAULT_SPONSORS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPONSORS);
      return data ? JSON.parse(data) : DEFAULT_SPONSORS;
    } catch {
      return DEFAULT_SPONSORS;
    }
  }

  saveSponsors(sponsors: SponsorPartner[]): void {
    localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(sponsors));
    this.notifyListeners();
  }

  // --- GALLERY ---
  getGallery(): GalleryItem[] {
    if (typeof window === 'undefined') return DEFAULT_GALLERY;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return data ? JSON.parse(data) : DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  }

  saveGallery(gallery: GalleryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    this.notifyListeners();
  }

  // --- ADMIN AUTH ---
  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  adminLogin(password: string): boolean {
    if (password === 'admin123' || password === 'admin') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      this.notifyListeners();
      return true;
    }
    return false;
  }

  adminLogout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    this.notifyListeners();
  }
}

export const storageService = new StorageService();
