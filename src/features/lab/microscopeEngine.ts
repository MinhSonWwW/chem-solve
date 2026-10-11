import type { MicroscopeSpecimen, SpecimenId } from './types';

export const SPECIMENS: Record<SpecimenId, MicroscopeSpecimen> = {
  'onion-cell': {
    id: 'onion-cell',
    name: 'Tế bào biểu bì vảy hành tây',
    source: 'Thực vật (Hành tây Allium cepa)',
    stain: 'Dung dịch cồn I-ốt loãng',
    description: 'Các tế bào thực vật xếp khít nhau như tổ ong/gạch lát, có thành xenlulôzơ dày và nhân tế bào tròn bắt màu nâu i-ốt.',
    optimalFocus: 55,
    organelles: [
      {
        name: 'Thành tế bào (Cell Wall)',
        description: 'Vách ngoài dày làm bằng xenlulôzơ, giúp bảo vệ và duy trì hình dạng đa giác cố định của tế bào thực vật.',
        x: 48,
        y: 28,
      },
      {
        name: 'Nhân tế bào (Nucleus)',
        description: 'Thể tròn nhỏ bắt màu i-ốt đậm, chứa vật chất di truyền ADN điều khiển mọi hoạt động sống của tế bào.',
        x: 52,
        y: 52,
      },
      {
        name: 'Không bào trung tâm (Vacuole)',
        description: 'Khoang lớn chứa dịch tế bào, điều hòa áp suất thẩm thấu và dự trữ chất dinh dưỡng.',
        x: 35,
        y: 60,
      },
    ],
  },
  'cheek-cell': {
    id: 'cheek-cell',
    name: 'Tế bào niêm mạc khoang miệng',
    source: 'Động vật (Người Homo sapiens)',
    stain: 'Xanh metylen 0.5%',
    description: 'Tế bào động vật hình tròn dẹp không có thành cứng, màng sinh chất mỏng uốn lượn, nhân tế bào bắt màu xanh đậm.',
    optimalFocus: 45,
    organelles: [
      {
        name: 'Màng sinh chất (Cell Membrane)',
        description: 'Lớp màng lipid kép bao bọc bảo vệ tế bào, kiểm soát quá trình trao đổi chất ra vào tế bào.',
        x: 50,
        y: 22,
      },
      {
        name: 'Nhân tế bào (Nucleus)',
        description: 'Hình cầu nằm ở trung tâm tế bào, bắt màu xanh metylen rất đậm và rõ nét.',
        x: 50,
        y: 50,
      },
      {
        name: 'Tế bào chất (Cytoplasm)',
        description: 'Khối dịch keo bán lỏng chứa các bào quan, nơi diễn ra phần lớn các phản ứng trao đổi chất.',
        x: 65,
        y: 42,
      },
    ],
  },
  'leaf-chloroplast': {
    id: 'leaf-chloroplast',
    name: 'Tế bào thịt lá rong đuôi chó',
    source: 'Thực vật thủy sinh (Hydrilla)',
    stain: 'Soi tươi trực tiếp trong nước',
    description: 'Chứa rất nhiều hạt lục lạp (chloroplast) màu xanh lục di chuyển trôi nổi trong dòng tế bào chất (hiện tượng dòng chất tế bào).',
    optimalFocus: 65,
    organelles: [
      {
        name: 'Hạt lục lạp (Chloroplast)',
        description: 'Bào quan chứa chất diệp lục màu xanh, là nơi thực hiện quá trình quang hợp hấp thụ ánh sáng mặt trời tạo chất hữu cơ.',
        x: 42,
        y: 38,
      },
      {
        name: 'Thành tế bào (Cell Wall)',
        description: 'Vách ngăn xenlulôzơ bảo vệ tế bào rong thủy sinh.',
        x: 50,
        y: 18,
      },
      {
        name: 'Tế bào chất (Cytoplasm)',
        description: 'Dòng chảy tế bào chất liên tục xoay tròn mang theo các hạt lục lạp.',
        x: 60,
        y: 58,
      },
    ],
  },
  amoeba: {
    id: 'amoeba',
    name: 'Trùng biến hình (Amoeba)',
    source: 'Vi sinh vật đơn bào nước ngọt',
    stain: 'Soi sống buồng đếm',
    description: 'Động vật nguyên sinh đơn bào, di chuyển và bắt mồi bằng chân giả (pseudopodia).',
    optimalFocus: 50,
    organelles: [
      {
        name: 'Chân giả (Pseudopodia)',
        description: 'Phần tế bào chất nhô ra giúp amip bò trườn và bao vây lấy thức ăn.',
        x: 70,
        y: 35,
      },
      {
        name: 'Không bào co bóp (Contractile Vacuole)',
        description: 'Bong bóng nhỏ co bóp để bài tiết nước thừa, giữ cân bằng áp suất thẩm thấu.',
        x: 35,
        y: 45,
      },
      {
        name: 'Nhân tế bào (Nucleus)',
        description: 'Chỉ huy hoạt động và phân chia cơ thể đơn bào.',
        x: 52,
        y: 54,
      },
    ],
  },
};

export function calculateFocusClarity(fineFocus: number, optimalFocus: number): {
  blurPx: number;
  isSharp: boolean;
  clarityPercent: number;
} {
  const diff = Math.abs(fineFocus - optimalFocus);
  const blurPx = Number(((diff / 100) * 14).toFixed(1));
  const isSharp = diff <= 6;
  const clarityPercent = Math.max(0, Math.min(100, Math.round(100 - diff * 2)));

  return { blurPx, isSharp, clarityPercent };
}
