export interface User {
  id: string;
  username: string;
  role: 'super_admin' | 'office_admin' | 'pic';
  officeId?: string;
}

export interface Office {
  id: string;
  officeName: string;
  contactEmail?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  officeId: string;
  eventName: string;
  eventDate: string;
  location?: string;
  isActive: boolean;
  logo?: string;
  twibbonBackground?: string;
  twibbonConfig?: string;
  heroImage?: string;
  backsound?: string;
  gallery?: string;
  mapsLink?: string;
  letterContent?: string;
  letterBackground?: string;
  letterSize?: string;
  themePrimary?: string;
  themeSecondary?: string;
}

export interface Guest {
  id: string;
  eventId: string;
  picId?: string;
  guestName: string;
  company?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  barcodeUid: string;
  rsvpStatus?: 'pending' | 'attending' | 'not_attending';
  isVip?: boolean;
  paxCount?: number;
  status?: 'attended' | 'invalid' | null;
  scannedAt?: string | null;
}

export interface Attendance {
  id: string;
  guestId: string;
  eventId: string;
  scannedAt: string;
  status: 'attended' | 'invalid';
}
