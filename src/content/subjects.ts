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
    badge: 'TRỌN BỘ 20 BÀI',
    accentColor: '#eab308',
    borderColor: '#ca8a04',
    available: true,
    statusText: 'Đã hoàn thành trọn bộ 20 bài (Unit 0, 1, 2, 3) Vật lý Lớp 6 KNTT',
    topics: ['Lực & Chuyển động (Cơ học)', 'Nhiệt năng & Sự truyền nhiệt', 'Điện trở, Định luật Ohm & Mạch điện', 'Khúc xạ, Thấu kính & Ánh sáng'],
  },
  {
    id: 'bio',
    name: 'Sinh học',
    shortName: 'Sinh',
    tagline: 'Tế bào, sinh lý, chuyển hóa năng lượng, cảm ứng & sinh sản THCS',
    icon: '🌿',
    badge: 'TRỌN BỘ 64 BÀI',
    accentColor: '#10b981',
    borderColor: '#059669',
    available: true,
    statusText: 'Đã hoàn thành trọn bộ 64 bài: Lớp 6 (24 bài), Lớp 7 (22 bài) & Lớp 8 (18 bài) KNTT',
    topics: [
      'Tế bào & Đa dạng thế giới sống (Lớp 6 - 24 bài)',
      'Trao đổi chất, Cảm ứng, Sinh trưởng & Sinh sản (Lớp 7 - 22 bài)',
      'Cơ thể người: Vận động, Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh (Lớp 8 - Unit 1-3)',
      'Sinh thái học: Môi trường, Quần thể, Quần xã & Hệ sinh thái (Lớp 8 - Unit 4-5)',
    ],
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


