export interface DistrictOfficer {
  id: string;
  name: string;
  title: string;
  club_name?: string;
  photo_url?: string;
  order_position: number;
  year: string;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  location?: string;
  meeting_day?: string;
  meeting_time?: string;
  meeting_venue?: string;
  president_name?: string;
  secretary_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
}

export interface ClubProject {
  id: string;
  club_id?: string;
  title: string;
  description?: string;
  category: string;
  image_url?: string;
  date: string;
  created_at: string;
  club?: Club;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  organizer?: string;
  created_at: string;
}

export interface Newsletter {
  id: string;
  title: string;
  month: string;
  year: string;
  pdf_url?: string;
  published_date: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  updated_at: string;
}
