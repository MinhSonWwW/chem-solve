import { useState, useEffect } from 'react';

export type SubjectId = 'chem' | 'physics' | 'bio';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  badge: string;
  accentColor: string;
  borderColor: string;
  available: boolean;
  statusText?: string;
  topics: string[];
}

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'chem',
    name: 'Hóa học',
    shortName: 'Hóa',
    tagline: 'Phản ứng, nguyên tử, liên kết & tính toán hóa học THCS',
    icon: '🧪',
    badge: 'ĐANG HỌC',
    accentColor: '#0ea5e9',
    borderColor: '#0284c7',
    available: true,
    topics: ['Chất quanh ta (KHTN 6)', 'Nguyên tử & Bảng tuần hoàn (7)', 'Phản ứng & Tính toán Mol (8)', 'Kim loại, Phi kim & Hữu cơ (9)'],
  },
  {
    id: 'physics',
    name: 'Vật lý',
    shortName: 'Lý',
    tagline: 'Cơ học, Nhiệt học, Điện từ học & Quang học THCS',
    icon: '⚡',
    badge: 'ĐANG XÂY DỰNG',
    accentColor: '#eab308',
    borderColor: '#ca8a04',
    available: false,
    statusText: 'Đang chuẩn bị tích hợp ngân hàng bài tập & lý thuyết',
    topics: ['Lực & Chuyển động (Cơ học)', 'Nhiệt năng & Sự truyền nhiệt', 'Điện trở, Định luật Ohm & Mạch điện', 'Khúc xạ, Thấu kính & Ánh sáng'],
  },
  {
    id: 'bio',
    name: 'Sinh học',
    shortName: 'Sinh',
    tagline: 'Tế bào, cơ thể sống, di truyền & sinh thái',
    icon: '🌿',
    badge: 'KẾ HOẠCH',
    accentColor: '#10b981',
    borderColor: '#059669',
    available: false,
    statusText: 'Dự kiến tích hợp trọn bộ KHTN 6-9',
    topics: ['Tế bào - Đơn vị sự sống', 'Cơ thể người & Sức khỏe', 'Quy luật di truyền Mendel', 'Hệ sinh thái & Bảo vệ môi trường'],
  },
];

export function getActiveSubject(): SubjectId {
  if (typeof window === 'undefined') return 'chem';
  return (localStorage.getItem('chem_active_subject') as SubjectId) || 'chem';
}

export function setActiveSubject(subjectId: SubjectId): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chem_active_subject', subjectId);
    window.dispatchEvent(new CustomEvent('chem_subject_changed', { detail: subjectId }));
  }
}

export function useActiveSubject() {
  const [subject, setSubjectState] = useState<SubjectId>(getActiveSubject);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SubjectId>).detail;
      if (detail) setSubjectState(detail);
      else setSubjectState(getActiveSubject());
    };
    window.addEventListener('chem_subject_changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('chem_subject_changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const changeSubject = (sub: SubjectId) => {
    setActiveSubject(sub);
    setSubjectState(sub);
  };

  return { subject, setSubject: changeSubject };
}


