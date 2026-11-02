export type SportCategory = 'running' | 'football' | 'badminton' | 'cycling' | 'basketball' | 'other';

export type EventStatus = 'draft' | 'published' | 'closed' | 'completed';

export type PaymentStatus = 'pending_payment' | 'waiting_verification' | 'approved' | 'rejected';

export type IDCardStatus = 'not_generated' | 'generated' | 'published' | 'revoked';

export type IDCardSizePreset = 'CR80' | 'Badge' | 'Custom'; // CR80 (86x54mm), Badge (90x120mm)

export type IDCardOrientation = 'portrait' | 'landscape';

export type IDCardElementKey =
  | 'org_logo'
  | 'event_name'
  | 'participant_name'
  | 'participant_photo'
  | 'bib_number'
  | 'reg_number'
  | 'category'
  | 'qr_code'
  | 'sponsor_logo'
  | 'custom_badge_note';

export interface IDCardElementConfig {
  id: string;
  key: IDCardElementKey;
  label: string;
  visible: boolean;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize?: number; // px
  fontWeight?: 'normal' | 'medium' | 'bold' | 'extrabold' | 'black';
  color?: string; // hex
  align?: 'left' | 'center' | 'right';
  fontFamily?: 'heading' | 'sans' | 'mono';
}

export interface IDCardTemplate {
  id: string;
  name: string;
  description: string;
  sizePreset: IDCardSizePreset;
  customWidthMm?: number;
  customHeightMm?: number;
  orientation: IDCardOrientation;
  backgroundColor: string;
  backgroundImageUrl?: string;
  accentColor: string;
  textColor: string;
  orgLogoUrl?: string;
  sponsorLogoUrl?: string;
  isDefault?: boolean;
  isActive: boolean;
  version: number;
  elements: IDCardElementConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface EventIDCardConfig {
  enabled: boolean;
  templateId: string;
  sizePreset: IDCardSizePreset;
  orientation: IDCardOrientation;
  allowPhotoUpload: boolean;
  showParticipantPhoto: boolean;
  customBadgeNote?: string;
}

export interface EventRaceCategory {
  id: string;
  name: string;
  description?: string;
  price: number;
  quota: number;
  registeredCount: number;
  isActive: boolean;
  facilities: string[];
}

export interface DynamicFormField {
  id: string;
  label: string;
  fieldName: string;
  type: 'text' | 'number' | 'select' | 'date' | 'tel' | 'email' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface SportEvent {
  id: string;
  slug: string;
  name: string;
  sportCategory: SportCategory;
  sportCategoryLabel: string;
  description: string;
  posterUrl: string;
  eventDate: string;
  eventTime: string;
  location: string;
  locationDetails: string;
  registrationDeadline: string;
  status: EventStatus;
  categories: EventRaceCategory[];
  facilitiesOverview: string[];
  rulesAndPodium?: string;
  faqList?: { question: string; answer: string }[];
  formFields: DynamicFormField[];
  organizerName: string;
  organizerContact: string;
  isFeatured?: boolean;
  idCardConfig?: EventIDCardConfig;
}

export interface ParticipantRegistration {
  id: string;
  registrationNumber: string;
  eventId: string;
  eventName: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  status: PaymentStatus;
  registeredAt: string;
  
  // Participant standard data
  fullName: string;
  email: string;
  phone: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  address: string;
  jerseySize?: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  photoUrl?: string; // Optional participant face photo
  
  // Dynamic fields extra payload
  customData?: Record<string, string>;
  
  // Payment info
  paymentProofUrl?: string;
  paymentProofUploadedAt?: string;
  paymentVerifiedAt?: string;
  rejectionReason?: string;
  
  // E-Ticket & Check-in & ID Card
  ticketCode?: string;
  bibNumber?: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  
  // ID Card State
  idCardStatus?: IDCardStatus;
  idCardIssuedAt?: string;
}

export interface IDCardAuditLog {
  action: 'generated' | 'regenerated' | 'published' | 'revoked';
  timestamp: string;
  actor: string;
  reason?: string;
}

export interface ParticipantIDCardRecord {
  id: string;
  registrationId: string;
  registrationNumber: string;
  eventId: string;
  eventName: string;
  participantName: string;
  bibNumber: string;
  categoryName: string;
  status: IDCardStatus;
  templateId: string;
  templateVersion: number;
  templateSnapshot: IDCardTemplate;
  qrToken: string;
  participantPhotoUrl?: string;
  generatedAt: string;
  lastRegeneratedAt?: string;
  regeneratedBy?: string;
  auditLogs: IDCardAuditLog[];
}

export interface OrganizationSettings {
  name: string;
  tagline: string;
  description: string;
  vision: string;
  mission: string;
  email: string;
  whatsapp: string;
  address: string;
  instagram: string;
  youtube: string;
  qrisImageUrl: string;
  qrisMerchantName: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}

export interface SponsorPartner {
  id: string;
  name: string;
  category: 'Title Sponsor' | 'Official Partner' | 'Media Partner' | 'Supporting Partner';
  logoText: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
}
