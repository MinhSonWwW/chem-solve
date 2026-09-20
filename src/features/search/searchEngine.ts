import substancesData from '@/content/kb/substances.json';
import reactionsData from '@/content/kb/reactions.json';
import { SKILLS, Skill } from '@/content/skills';
import { CURRICULUM } from '@/content/curriculum';

export interface SubstanceResult {
  formula: string;
  nameVi: string;
  type: string;
  molarMass?: number;
}

export interface ReactionResult {
  id: string;
  equation: string;
  phenomenon?: string;
  grade?: number;
}

export interface SearchResultsGrouped {
  substances: SubstanceResult[];
  reactions: ReactionResult[];
  skills: Skill[];
  lessons: Array<{ id: string; title: string; grade: number; chapterTitle: string }>;
  minigames: Array<{ id: string; name: string; desc: string }>;
}

const MINIGAMES_CATALOG = [
  { id: 'match', name: 'Ghép đôi chất & loại', desc: 'Nhận diện chất & loại hợp chất (Acid, Base, Oxide, Muối)' },
  { id: 'formula-builder', name: 'Ghép công thức (Formula Builder)', desc: 'Cân bằng điện tích ion ∑q = 0 tạo phân tử' },
  { id: 'equation-balance', name: 'Cân bằng PTHH', desc: 'Điền hệ số cân bằng phản ứng hóa học' },
  { id: 'sort', name: 'Phân loại hợp chất', desc: 'Phân loại chất vào 4 nhóm Axit, Bazơ, Oxide, Muối' },
  { id: 'true-false', name: 'Đúng hay Sai', desc: 'Phản xạ nhanh với nhận định Hóa học then chốt' },
  { id: 'speed', name: 'Thử thách tốc độ (60s)', desc: '60 giây trắc nghiệm tốc độ' },
];

/**
 * Normalizes strings by removing Vietnamese accents, non-alphanumerics and lowercasing
 * Example: "Axit sunfuric" -> "axit sunfuric" -> "axit sunfuric"
 * Example: "NaOH" -> "naoh"
 */
export function normalizeSearchTerm(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Searches multi-source chemical knowledge base with case- and accent-insensitive matching
 */
export function searchChemicalData(query: string): SearchResultsGrouped {
  const normQ = normalizeSearchTerm(query);

  if (!normQ || normQ.length < 1) {
    return {
      substances: [],
      reactions: [],
      skills: [],
      lessons: [],
      minigames: [],
    };
  }

  // 1. Search Substances
  const substances: SubstanceResult[] = (substancesData as SubstanceResult[]).filter((s) => {
    const normFormula = normalizeSearchTerm(s.formula);
    const normName = normalizeSearchTerm(s.nameVi);
    const normType = normalizeSearchTerm(s.type);
    return normFormula.includes(normQ) || normName.includes(normQ) || normType.includes(normQ);
  }).slice(0, 6);

  // 2. Search Reactions
  const reactions: ReactionResult[] = (reactionsData as ReactionResult[]).filter((r) => {
    const normEq = normalizeSearchTerm(r.equation);
    const normPhen = r.phenomenon ? normalizeSearchTerm(r.phenomenon) : '';
    return normEq.includes(normQ) || normPhen.includes(normQ);
  }).slice(0, 6);

  // 3. Search Skills
  const skills = SKILLS.filter((sk) => {
    const normName = normalizeSearchTerm(sk.name);
    const normDesc = normalizeSearchTerm(sk.description);
    return normName.includes(normQ) || normDesc.includes(normQ);
  }).slice(0, 6);

  // 4. Search Lessons
  const allCurriculum = [
    ...(CURRICULUM[7]?.chapters || []).map((c) => ({ chapter: c, grade: 7 })),
    ...(CURRICULUM[8]?.chapters || []).map((c) => ({ chapter: c, grade: 8 })),
    ...(CURRICULUM[9]?.chapters || []).map((c) => ({ chapter: c, grade: 9 })),
  ];

  const lessons: SearchResultsGrouped['lessons'] = [];
  for (const item of allCurriculum) {
    for (const l of item.chapter.lessons) {
      const normTitle = normalizeSearchTerm(l.title);
      const normChap = normalizeSearchTerm(item.chapter.title);
      if (normTitle.includes(normQ) || normChap.includes(normQ)) {
        lessons.push({
          id: l.id,
          title: l.title,
          grade: item.grade,
          chapterTitle: item.chapter.title,
        });
      }
    }
  }

  // 5. Search Minigames
  const minigames = MINIGAMES_CATALOG.filter((g) => {
    const normName = normalizeSearchTerm(g.name);
    const normDesc = normalizeSearchTerm(g.desc);
    return normName.includes(normQ) || normDesc.includes(normQ);
  });

  return {
    substances,
    reactions,
    skills,
    lessons: lessons.slice(0, 6),
    minigames,
  };
}
