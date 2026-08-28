/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalInfo {
  name: string;
  title: string;
  institution: string;
  department: string;
  location: string;
  qualification: string;
  experienceYears: number;
  publicationsCount: number;
  patentsCount: number;
  guidedUG: number;
  grantsAmount: string;
  email: string;
  linkedin: string;
  googleScholar: string;
  orcid: string;
  scopus: string;
  bio: string;
  aboutStatement: string;
  profileImage?: string;
  googleScholarStats?: {
    totalCitations: number;
    hIndex: number;
    i10Index: number;
    lastUpdated?: string;
  };
}

export interface AcademicCredential {
  degree: string;
  field: string;
  institution: string;
  year: string;
  details: string;
}

export interface ExperienceItem {
  role: string;
  institution: string;
  duration: string;
  type: string;
  description: string;
  tags: string[];
}

export interface PublicationItem {
  title: string;
  authors: string;
  journal: string;
  year: string;
  category: string;
  link: string;
  citations: number;
  tags: string[];
}

export interface PatentItem {
  title: string;
  status: 'Granted' | 'Published' | 'Filed';
  registrationNo: string;
  date: string;
  inventors: string;
  description: string;
  type: string;
  link?: string;
}

export interface BookItem {
  title: string;
  role: string;
  publisher: string;
  year: string;
  isbn: string;
  description: string;
  coAuthors: string[];
  coverImage?: string;
  link?: string;
}

export interface ResearchGuidanceItem {
  level: string;
  count: number;
  description: string;
  highlights: string;
}

export interface GrantItem {
  title: string;
  fundingAgency: string;
  amount: string;
  year: string;
  status: 'Completed' | 'Ongoing';
  description: string;
}

export interface AwardItem {
  title: string;
  agency: string;
  year: string;
  description: string;
}

export interface ConferenceItem {
  title: string;
  role: string;
  organizer: string;
  year: string;
  location: string;
}

export interface ResponsibilityItem {
  title: string;
  organization: string;
  duration: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface LectureItem {
  id: string;
  title: string;
  subject: string;
  url: string;
  duration?: string;
  dateAdded: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileSize?: string;
  url: string;
  dateAdded: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  url?: string;
}

export interface EngagementItem {
  title: string;
  role: string;
  organizer: string;
  date: string;
  location?: string;
  category: 'representation' | 'workshop_fdp' | 'expert_talk' | 'evaluator_judge' | 'felicitation' | 'governance' | 'certificate';
  description?: string;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  lastVisitedAt: string;
  isLive?: boolean;
}

export interface PortfolioData {
  personal: PersonalInfo;
  credentials: AcademicCredential[];
  experience: ExperienceItem[];
  publications: PublicationItem[];
  patents: PatentItem[];
  books: BookItem[];
  researchGuidance: ResearchGuidanceItem[];
  grants: GrantItem[];
  awards: AwardItem[];
  conferences: ConferenceItem[];
  responsibilities: ResponsibilityItem[];
  skills: SkillCategory[];
  engagements?: EngagementItem[];
}
