import type { ChemicalReagent, ReagentId, ChemistryReactionResult } from './types';

export const REAGENTS: Record<ReagentId, ChemicalReagent> = {
  hcl: {
    id: 'hcl',
    name: 'Axit clohiđric',
    formula: 'HCl',
    type: 'acid',
    color: 'rgba(224, 242, 254, 0.4)', // Clear / faint sky
    state: 'liquid',
    description: 'Dung dịch axit vô cơ mạnh, không màu, làm đỏ quỳ tím.',
  },
  naoh: {
    id: 'naoh',
    name: 'Natri hiđroxit',
    formula: 'NaOH',
    type: 'base',
    color: 'rgba(240, 253, 250, 0.4)', // Clear / faint mint
    state: 'liquid',
    description: 'Dung dịch kiềm mạnh (xút ăn da), làm xanh quỳ tím, hóa hồng phenolphthalein.',
  },
  h2so4: {
    id: 'h2so4',
    name: 'Axit sunfuric',
    formula: 'H2SO4',
    type: 'acid',
    color: 'rgba(238, 242, 255, 0.4)', // Clear
    state: 'liquid',
    description: 'Axit sunfuric loãng, tác dụng kim loại đứng trước H và muối bari.',
  },
  water: {
    id: 'water',
    name: 'Nước cất',
    formula: 'H2O',
    type: 'neutral',
    color: 'rgba(186, 230, 253, 0.3)', // Faint blue
    state: 'liquid',
    description: 'Dung môi tinh khiết, môi trường trung tính pH = 7.',
  },
  litmus: {
    id: 'litmus',
    name: 'Dung dịch Quỳ tím',
    formula: 'Quỳ tím',
    type: 'indicator',
    color: '#8b5cf6', // Violet
    state: 'liquid',
    description: 'Chỉ thị màu: đỏ trong axit (pH < 7), xanh trong bazơ (pH > 7).',
  },
  phenol: {
    id: 'phenol',
    name: 'Phenolphthalein',
    formula: 'PP',
    type: 'indicator',
    color: 'rgba(255, 255, 255, 0.3)', // Colorless
    state: 'liquid',
    description: 'Chỉ thị không màu, chuyển sang màu hồng đậm trong môi trường kiềm.',
  },
  zinc: {
    id: 'zinc',
    name: 'Kẽm kim loại',
    formula: 'Zn',
    type: 'metal',
    color: '#94a3b8', // Slate silver
    state: 'solid',
    description: 'Viên kẽm xám sáng, tác dụng mạnh với axit giải phóng khí H2.',
  },
  iron: {
    id: 'iron',
    name: 'Đinh sắt',
    formula: 'Fe',
    type: 'metal',
    color: '#64748b', // Dark slate
    state: 'solid',
    description: 'Đinh sắt xám đen, tác dụng với axit loãng sinh khí H2 và muối Fe(II).',
  },
  copper: {
    id: 'copper',
    name: 'Mảnh đồng',
    formula: 'Cu',
    type: 'metal',
    color: '#f97316', // Red-orange copper
    state: 'solid',
    description: 'Kim loại màu đỏ, đứng sau H trong dãy hoạt động nên KHÔNG tan trong HCl/H2SO4 loãng.',
  },
  bacl2: {
    id: 'bacl2',
    name: 'Bari clorua',
    formula: 'BaCl2',
    type: 'salt',
    color: 'rgba(248, 250, 252, 0.4)', // Clear
    state: 'liquid',
    description: 'Dung dịch muối dùng để nhận biết gốc sunfat SO4^2-.',
  },
  caco3: {
    id: 'caco3',
    name: 'Đá vôi (Canxi cacbonat)',
    formula: 'CaCO3',
    type: 'salt',
    color: '#f1f5f9', // White marble
    state: 'solid',
    description: 'Chất rắn màu trắng, tan trong axit sủi bọt khí CO2.',
  },
};

export function evaluateReaction(reagents: ReagentId[]): ChemistryReactionResult | null {
  if (reagents.length < 2) return null;
  const set = new Set(reagents);

  // 1. Acid (HCl or H2SO4) + Litmus
  if ((set.has('hcl') || set.has('h2so4')) && set.has('litmus')) {
    return {
      equation: 'H^+ + Quỳ tím → Màu đỏ',
      wordEquation: 'Axit + Quỳ tím → Hóa đỏ',
      solutionColor: '#ef4444', // Red
      phenomenon: 'Dung dịch quỳ tím lập tức chuyển từ màu tím sang màu đỏ tươi.',
      explanation: 'Ion H+ trong dung dịch axit làm biến đổi cấu trúc phân tử của phẩm màu quỳ tím, chuyển sang dạng có màu đỏ.',
    };
  }

  // 2. Base (NaOH) + Litmus
  if (set.has('naoh') && set.has('litmus')) {
    return {
      equation: 'OH^- + Quỳ tím → Màu xanh',
      wordEquation: 'Natri hiđroxit + Quỳ tím → Hóa xanh',
      solutionColor: '#0ea5e9', // Blue/Cyan
      phenomenon: 'Dung dịch quỳ tím đổi màu từ tím sang màu xanh lam.',
      explanation: 'Môi trường kiềm chứa ion OH- làm phẩm màu quỳ tím chuyển sang dạng có màu xanh.',
    };
  }

  // 3. Base (NaOH) + Phenolphthalein
  if (set.has('naoh') && set.has('phenol')) {
    return {
      equation: 'OH^- + Phenolphthalein → Màu hồng',
      wordEquation: 'Natri hiđroxit + Phenolphthalein → Hóa hồng',
      solutionColor: '#f43f5e', // Hot pink
      phenomenon: 'Dung dịch không màu lập tức đổi sang màu hồng cánh sen rực rỡ.',
      explanation: 'Phenolphthalein là chất chỉ thị đặc trưng cho môi trường kiềm (pH > 8.3), bị ion hóa tạo cấu trúc quinoid màu hồng.',
    };
  }

  // 4. Acid + Metal Zn
  if (set.has('hcl') && set.has('zinc')) {
    return {
      equation: 'Zn + 2HCl → ZnCl2 + H2↑',
      wordEquation: 'Kẽm + Axit clohiđric → Kẽm clorua + Hiđro',
      solutionColor: 'rgba(224, 242, 254, 0.5)',
      gasReleased: 'H2',
      gasBubbles: true,
      phenomenon: 'Viên kẽm tan dần, bọt khí không màu H2 thoát ra nhanh và sủi bọt liên tục.',
      explanation: 'Kẽm là kim loại hoạt động đứng trước hiđro trong dãy hoạt động hóa học, khử ion H+ trong axit thành khí H2 tự do.',
    };
  }

  if (set.has('h2so4') && set.has('zinc')) {
    return {
      equation: 'Zn + H2SO4 → ZnSO4 + H2↑',
      wordEquation: 'Kẽm + Axit sunfuric → Kẽm sunfat + Hiđro',
      solutionColor: 'rgba(224, 242, 254, 0.5)',
      gasReleased: 'H2',
      gasBubbles: true,
      phenomenon: 'Viên kẽm sủi bọt khí không màu mãnh liệt, dung dịch nóng lên nhẹ.',
      explanation: 'Phản ứng thế giữa kim loại Zn và axit H2SO4 loãng giải phóng khí hiđro.',
    };
  }

  // 5. Acid + Metal Fe
  if ((set.has('hcl') || set.has('h2so4')) && set.has('iron')) {
    return {
      equation: 'Fe + 2HCl → FeCl2 + H2↑',
      wordEquation: 'Sắt + Axit clohiđric → Sắt(II) clorua + Hiđro',
      solutionColor: 'rgba(187, 247, 208, 0.5)', // Pale green FeCl2
      gasReleased: 'H2',
      gasBubbles: true,
      phenomenon: 'Đinh sắt tan chậm, có bọt khí thoát ra, dung dịch dần chuyển sang màu xanh rêu nhạt của ion Fe²⁺.',
      explanation: 'Sắt phản ứng với axit HCl giải phóng khí H2 và tạo muối sắt(II) clorua.',
    };
  }

  // 6. Acid + Metal Cu (NO REACTION)
  if ((set.has('hcl') || set.has('h2so4')) && set.has('copper')) {
    return {
      equation: 'Cu + HCl → Không phản ứng (kđk thường)',
      wordEquation: 'Đồng + Axit clohiđric → Không phản ứng',
      solutionColor: 'rgba(224, 242, 254, 0.3)',
      phenomenon: 'Mảnh đồng vẫn giữ nguyên màu đỏ ánh kim, không có hiện tượng gì xảy ra, không có bọt khí.',
      explanation: 'Trong dãy hoạt động hóa học, đồng (Cu) đứng sau hiđro (H) nên không có khả năng đẩy H+ ra khỏi dung dịch axit loãng.',
    };
  }

  // 7. Barium Chloride + H2SO4 (Precipitate BaSO4)
  if (set.has('bacl2') && set.has('h2so4')) {
    return {
      equation: 'BaCl2 + H2SO4 → BaSO4↓ + 2HCl',
      wordEquation: 'Bari clorua + Axit sunfuric → Bari sunfat↓ + Axit clohiđric',
      solutionColor: 'rgba(255, 255, 255, 0.8)',
      precipitateColor: '#ffffff',
      precipitateName: 'BaSO4 trắng',
      phenomenon: 'Xuất hiện kết tủa trắng đục lắng dần xuống đáy ống nghiệm, không tan trong axit dư.',
      explanation: 'Ion Ba²⁺ kết hợp với ion SO4²⁻ tạo thành hợp chất BaSO4 có độ tan cực kỳ nhỏ trong nước.',
    };
  }

  // 8. Acid + Calcium Carbonate (Limestone CaCO3)
  if ((set.has('hcl') || set.has('h2so4')) && set.has('caco3')) {
    return {
      equation: 'CaCO3 + 2HCl → CaCl2 + H2O + CO2↑',
      wordEquation: 'Canxi cacbonat + Axit clohiđric → Canxi clorua + Nước + Cacbon đioxit',
      solutionColor: 'rgba(241, 245, 249, 0.5)',
      gasReleased: 'CO2',
      gasBubbles: true,
      phenomenon: 'Đá vôi sủi bọt khí CO2 mãnh liệt và tan dần trong dung dịch.',
      explanation: 'Axit mạnh đẩy axit yếu H2CO3 ra khỏi muối; H2CO3 không bền phân hủy ngay thành H2O và khí CO2 bay lên.',
    };
  }

  // 9. Neutralization: Acid (HCl) + Base (NaOH)
  if (set.has('hcl') && set.has('naoh')) {
    return {
      equation: 'HCl + NaOH → NaCl + H2O',
      wordEquation: 'Axit clohiđric + Natri hiđroxit → Natri clorua + Nước',
      solutionColor: 'rgba(240, 249, 255, 0.3)',
      phenomenon: 'Dung dịch vẫn trong suốt không màu, tỏa nhiệt (thành ống nghiệm ấm lên). Nếu có sẵn chỉ thị thì màu chỉ thị bị biến đổi.',
      explanation: 'Phản ứng trung hòa giữa ion H+ và OH- tạo thành nước và muối trung tính NaCl.',
    };
  }

  // 10. Water + Litmus
  if (set.has('water') && set.has('litmus')) {
    return {
      equation: 'H2O + Quỳ tím → Giữ nguyên màu tím',
      wordEquation: 'Nước cất + Quỳ tím → Không đổi màu',
      solutionColor: '#8b5cf6', // Violet
      phenomenon: 'Dung dịch giữ nguyên màu tím đặc trưng của quỳ tím, không đổi màu.',
      explanation: 'Nước cất là môi trường trung tính với nồng độ [H+] = [OH-] = 10^-7 M (pH = 7).',
    };
  }

  return null;
}
