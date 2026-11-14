import { z } from 'zod';

/**
 * PhET Interactive Simulations (University of Colorado Boulder) embedded in the virtual lab.
 * Licence: CC BY 4.0 — https://phet.colorado.edu — attribution is shown next to every sim.
 *
 * Only HTML5 sims with an official Vietnamese translation are listed (`<id>_vi.html` exists),
 * so they run on phones and in Vietnamese. `titleVi` follows PhET's Vietnamese title, adjusted to
 * SGK Kết nối tri thức wording where PhET's differs (e.g. "Mật độ" -> "Khối lượng riêng").
 * `summary` / `tryThis` are our own guidance written for the SGK Kết nối tri thức lessons.
 */
export const PhetSimSchema = z.object({
  /** PhET sim name, e.g. "build-an-atom" (used to build the embed URL). */
  id: z.string().regex(/^[a-z0-9-]+$/),
  subject: z.enum(['chem', 'physics', 'bio']),
  grade: z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
  /**
   * Lessons this sim supports. The first one is the main lesson (its grade = `grade`,
   * its title = `lessonLabel`); the others also get a "Mô phỏng" button.
   */
  lessonIds: z.array(z.string()).default([]),
  /** Short label of the SGK lesson, shown on the card. */
  lessonLabel: z.string().min(3),
  titleVi: z.string().min(3),
  summary: z.string().min(10),
  tryThis: z.array(z.string().min(10)).min(2).max(4),
});

export type PhetSim = z.infer<typeof PhetSimSchema>;

const RAW: z.input<typeof PhetSimSchema>[] = [
  {
    id: 'states-of-matter-basics',
    subject: 'chem',
    grade: 6,
    lessonIds: ['g6-b10'],
    lessonLabel: 'Các thể của chất và sự chuyển thể',
    titleVi: 'Trạng thái của vật chất: phần cơ bản',
    summary: 'Quan sát các hạt trong chất rắn, lỏng, khí chuyển động thế nào khi đun nóng hoặc làm lạnh.',
    tryThis: [
      'Chọn nước ở thể rắn, tăng nhiệt độ dần và để ý lúc các hạt bắt đầu rời khỏi vị trí cố định.',
      'So sánh khoảng cách giữa các hạt ở thể rắn, thể lỏng và thể khí.',
      'Ở màn hình Chuyển thể, tìm xem nước bắt đầu sôi ở khoảng bao nhiêu độ.',
    ],
  },
  {
    id: 'build-an-atom',
    subject: 'chem',
    grade: 7,
    lessonIds: ['g7-b02'],
    lessonLabel: 'Nguyên tử',
    titleVi: 'Tạo dựng nguyên tử',
    summary: 'Ghép proton, neutron và electron để tạo nguyên tử hoặc ion, xem điện tích và số khối thay đổi.',
    tryThis: [
      'Tạo nguyên tử carbon. Cần bao nhiêu proton? Bao nhiêu electron để nguyên tử trung hòa?',
      'Thêm một electron vào nguyên tử trung hòa: điện tích của hạt thay đổi thế nào?',
      'Thêm neutron rồi bỏ bớt: tên nguyên tố có đổi không? Vì sao?',
    ],
  },
  {
    id: 'isotopes-and-atomic-mass',
    subject: 'chem',
    grade: 7,
    lessonIds: ['g7-b03'],
    lessonLabel: 'Nguyên tố hóa học',
    titleVi: 'Đồng vị và nguyên tử khối',
    summary: 'Thay đổi số neutron để tạo các đồng vị và xem nguyên tử khối trung bình được tính ra sao.',
    tryThis: [
      'Chọn hydrogen, thêm lần lượt 1 rồi 2 neutron. Nguyên tố có còn là hydrogen không?',
      'Ở màn hình Hỗn hợp, trộn hai đồng vị của chlorine và xem nguyên tử khối trung bình.',
    ],
  },
  {
    id: 'build-a-molecule',
    subject: 'chem',
    grade: 7,
    lessonIds: ['g7-b05'],
    lessonLabel: 'Phân tử. Đơn chất. Hợp chất',
    titleVi: 'Tạo dựng phân tử',
    summary: 'Ghép các nguyên tử thành phân tử như H2O, O2, CO2 và đếm số nguyên tử mỗi loại.',
    tryThis: [
      'Tạo một phân tử nước H2O và một phân tử khí oxygen O2. Chất nào là đơn chất, chất nào là hợp chất?',
      'Tạo phân tử CO2 và cho biết nó gồm mấy nguyên tử, thuộc mấy nguyên tố.',
      'Ở màn hình Tập hợp, thử tạo đủ các phân tử được yêu cầu.',
    ],
  },
  {
    id: 'gases-intro',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b03'],
    lessonLabel: 'Mol và tỉ khối chất khí',
    titleVi: 'Chất khí: phần giới thiệu',
    summary: 'Bơm hạt khí vào bình, thay đổi nhiệt độ và thể tích để thấy áp suất của chất khí thay đổi.',
    tryThis: [
      'Bơm thêm hạt khí vào bình kín: áp suất tăng hay giảm?',
      'Giữ nguyên số hạt, đun nóng bình: các hạt chuyển động nhanh hơn hay chậm hơn?',
      'Ở màn hình Định luật, giữ áp suất không đổi rồi tăng nhiệt độ và quan sát thể tích.',
    ],
  },
  {
    id: 'concentration',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b04'],
    lessonLabel: 'Dung dịch và nồng độ',
    titleVi: 'Nồng độ',
    summary: 'Hòa tan chất rắn vào nước, thêm nước hoặc cho bay hơi để xem nồng độ dung dịch thay đổi.',
    tryThis: [
      'Cho thêm chất tan vào cùng lượng nước: màu dung dịch và nồng độ thay đổi thế nào?',
      'Thêm nước vào dung dịch: nồng độ tăng hay giảm?',
      'Cho thật nhiều chất tan đến khi không tan thêm được nữa: đó là dung dịch gì?',
    ],
  },
  {
    id: 'molarity',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b04'],
    lessonLabel: 'Dung dịch và nồng độ',
    titleVi: 'Nồng độ mol',
    summary: 'Thay đổi số mol chất tan và thể tích dung dịch để thấy nồng độ mol CM = n / V.',
    tryThis: [
      'Giữ thể tích 1 lít, tăng số mol chất tan từ 0,5 lên 1 mol: nồng độ mol thay đổi ra sao?',
      'Giữ số mol, tăng thể tích dung dịch lên gấp đôi: nồng độ mol còn bao nhiêu?',
    ],
  },
  {
    id: 'balancing-chemical-equations',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b05'],
    lessonLabel: 'Định luật bảo toàn khối lượng và PTHH',
    titleVi: 'Cân bằng phương trình phản ứng hóa học',
    summary: 'Chọn hệ số cho các chất để số nguyên tử mỗi nguyên tố ở hai vế bằng nhau.',
    tryThis: [
      'Cân bằng phản ứng tạo nước từ hydrogen và oxygen. Hệ số nhỏ nhất là bao nhiêu?',
      'Bật cân hoặc biểu đồ cột để kiểm tra số nguyên tử hai vế.',
      'Thử màn hình Trò chơi ở mức 1 rồi tăng dần độ khó.',
    ],
  },
  {
    id: 'reactants-products-and-leftovers',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b06'],
    lessonLabel: 'Tính theo phương trình hóa học',
    titleVi: 'Chất phản ứng, sản phẩm và chất dư',
    summary: 'Thay đổi lượng chất tham gia để thấy sản phẩm tạo thành và chất nào còn dư sau phản ứng.',
    tryThis: [
      'Ở màn hình Phân tử, cho 4 phân tử H2 và 1 phân tử O2. Chất nào còn dư?',
      'Tìm tỉ lệ số phân tử để không có chất nào dư.',
      'Thử màn hình Trò chơi: đoán sản phẩm và chất dư trước khi xem kết quả.',
    ],
  },
  {
    id: 'acid-base-solutions',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b08', 'g8-b09'],
    lessonLabel: 'Acid',
    titleVi: 'Dung dịch acid-base',
    summary: 'So sánh dung dịch acid, base mạnh và yếu bằng giấy pH, máy đo pH và độ dẫn điện.',
    tryThis: [
      'Nhúng giấy pH vào dung dịch acid mạnh và acid yếu cùng nồng độ: màu khác nhau thế nào?',
      'Dùng thiết bị đo độ dẫn điện: dung dịch nào làm bóng đèn sáng hơn?',
      'Chuyển sang dung dịch base và đọc giá trị pH.',
    ],
  },
  {
    id: 'ph-scale-basics',
    subject: 'chem',
    grade: 8,
    lessonIds: ['g8-b09', 'g8-b08'],
    lessonLabel: 'Base và thang pH',
    titleVi: 'Thang đo pH: phần cơ bản',
    summary: 'Đo pH của các chất quen thuộc như nước chanh, sữa, xà phòng và xem pH thay đổi khi pha loãng.',
    tryThis: [
      'Đo pH của nước chanh, sữa và xà phòng. Chất nào có tính acid, chất nào có tính base?',
      'Thêm nước vào nước chanh: pH tiến dần về giá trị nào?',
      'Tìm chất có pH gần 7 nhất.',
    ],
  },

  // ───────────────────────── Vật lý ─────────────────────────
  {
    id: 'forces-and-motion-basics',
    subject: 'physics',
    grade: 6,
    lessonIds: ['phy-g6-b05', 'phy-g6-b06', 'phy-g6-b09', 'phy-g7-b01'],
    lessonLabel: 'Lực là gì?',
    titleVi: 'Lực và chuyển động: phần cơ bản',
    summary: 'Kéo co, đẩy vật và quan sát lực làm vật bắt đầu chuyển động, đổi tốc độ hoặc dừng lại.',
    tryThis: [
      'Ở màn hình Lực tổng hợp, cho hai đội kéo bằng nhau: xe có chuyển động không?',
      'Thêm một người vào một bên: xe chuyển động về phía nào?',
      'Ở màn hình Chuyển động, đẩy vật rồi thả tay: vật dừng ngay hay vẫn trượt tiếp?',
    ],
  },
  {
    id: 'hookes-law',
    subject: 'physics',
    grade: 6,
    lessonIds: ['phy-g6-b07'],
    lessonLabel: 'Biến dạng của lò xo',
    titleVi: 'Định luật Hooke',
    summary: 'Kéo lò xo bằng lực khác nhau và đo độ dãn để thấy lực càng lớn thì lò xo dãn càng nhiều.',
    tryThis: [
      'Tăng lực kéo lên gấp đôi: độ dãn của lò xo thay đổi thế nào?',
      'Đổi sang lò xo cứng hơn rồi kéo cùng một lực: lò xo nào dãn nhiều hơn?',
    ],
  },
  {
    id: 'gravity-force-lab-basics',
    subject: 'physics',
    grade: 6,
    lessonIds: ['phy-g6-b08'],
    lessonLabel: 'Trọng lực, lực hấp dẫn',
    titleVi: 'Lực hấp dẫn: phần cơ bản',
    summary: 'Thay đổi khối lượng và khoảng cách giữa hai vật để thấy lực hấp dẫn giữa chúng mạnh hay yếu.',
    tryThis: [
      'Tăng khối lượng một vật: mũi tên lực hấp dẫn dài ra hay ngắn lại?',
      'Kéo hai vật ra xa nhau: lực hấp dẫn thay đổi thế nào?',
      'Lực mà vật A hút vật B có bằng lực vật B hút vật A không?',
    ],
  },
  {
    id: 'friction',
    subject: 'physics',
    grade: 6,
    lessonIds: ['phy-g6-b14'],
    lessonLabel: 'Năng lượng hao phí',
    titleVi: 'Ma sát',
    summary: 'Chà xát hai bề mặt vào nhau và nhìn các hạt nóng lên: ma sát biến một phần năng lượng thành nhiệt.',
    tryThis: [
      'Chà quyển sách trên qua lại: nhiệt kế thay đổi thế nào?',
      'Chà thật mạnh và lâu: điều gì xảy ra với các hạt ở bề mặt?',
      'Để yên một lúc: nhiệt độ có giảm dần không?',
    ],
  },
  {
    id: 'energy-forms-and-changes',
    subject: 'physics',
    grade: 6,
    lessonIds: ['phy-g6-b13', 'phy-g6-b11', 'phy-g6-b12', 'phy-g8-b14', 'phy-g8-b16'],
    lessonLabel: 'Sự chuyển hóa năng lượng',
    titleVi: 'Năng lượng: các dạng và sự chuyển hóa',
    summary: 'Ghép nguồn năng lượng, bộ chuyển đổi và nơi sử dụng để theo dõi năng lượng chuyển từ dạng này sang dạng khác.',
    tryThis: [
      'Ở màn hình Hệ thống, ghép Mặt Trời → tấm pin mặt trời → bóng đèn và bật biểu tượng năng lượng.',
      'Thay Mặt Trời bằng vòi nước: năng lượng đi qua những dạng nào trước khi thành ánh sáng?',
      'Ở màn hình Giới thiệu, đun nóng khối sắt và khối gạch: khối nào nóng nhanh hơn?',
    ],
  },
  {
    id: 'gravity-and-orbits',
    subject: 'physics',
    grade: 6,
    lessonIds: ['phy-g6-b19', 'phy-g6-b18'],
    lessonLabel: 'Hệ Mặt Trời',
    titleVi: 'Lực hấp dẫn và quỹ đạo',
    summary: 'Quan sát Trái Đất quay quanh Mặt Trời, Mặt Trăng quay quanh Trái Đất, và chuyện gì xảy ra khi tắt lực hấp dẫn.',
    tryThis: [
      'Bật chế độ Mặt Trời – Trái Đất và đếm thời gian Trái Đất đi hết một vòng.',
      'Tắt lực hấp dẫn: Trái Đất còn quay quanh Mặt Trời không?',
      'Chuyển sang Trái Đất – Mặt Trăng và quan sát quỹ đạo của Mặt Trăng.',
    ],
  },
  {
    id: 'waves-intro',
    subject: 'physics',
    grade: 7,
    lessonIds: ['phy-g7-b05', 'phy-g7-b06'],
    lessonLabel: 'Sóng âm',
    titleVi: 'Sóng',
    summary: 'Tạo sóng âm từ loa và thay đổi tần số, biên độ để thấy âm cao, âm to khác nhau ra sao.',
    tryThis: [
      'Ở màn hình Âm thanh, bật âm và tăng tần số: âm nghe cao hơn hay thấp hơn?',
      'Tăng biên độ: âm to hơn hay nhỏ hơn?',
      'Quan sát các hạt không khí dao động khi sóng âm truyền qua.',
    ],
  },
  {
    id: 'magnet-and-compass',
    subject: 'physics',
    grade: 7,
    lessonIds: ['phy-g7-b11'],
    lessonLabel: 'Nam châm',
    titleVi: 'Nam châm và la bàn',
    summary: 'Di chuyển la bàn quanh thanh nam châm để thấy kim la bàn chỉ theo đường sức từ.',
    tryThis: [
      'Đặt la bàn gần cực Bắc của nam châm: kim la bàn quay về phía nào?',
      'Lật ngược nam châm: kim la bàn thay đổi ra sao?',
      'Bật hiển thị từ trường và đi một vòng quanh nam châm bằng la bàn.',
    ],
  },
  {
    id: 'magnets-and-electromagnets',
    subject: 'physics',
    grade: 7,
    lessonIds: ['phy-g7-b13', 'phy-g7-b12'],
    lessonLabel: 'Chế tạo nam châm điện đơn giản',
    titleVi: 'Nam châm và nam châm điện',
    summary: 'So sánh nam châm vĩnh cửu và nam châm điện, thay đổi số vòng dây và pin để thấy từ trường mạnh lên.',
    tryThis: [
      'Ở màn hình Nam châm điện, tăng hiệu điện thế của pin: từ trường mạnh lên hay yếu đi?',
      'Tăng số vòng dây quấn: la bàn ở xa có bị ảnh hưởng nhiều hơn không?',
      'Đảo chiều pin: các cực của nam châm điện thay đổi thế nào?',
    ],
  },
  {
    id: 'density',
    subject: 'physics',
    grade: 8,
    lessonIds: ['phy-g8-b01', 'phy-g8-b02'],
    lessonLabel: 'Khối lượng riêng',
    titleVi: 'Khối lượng riêng',
    summary: 'Thay đổi khối lượng và thể tích của khối vật rồi thả vào nước để tìm khối lượng riêng.',
    tryThis: [
      'Giữ nguyên thể tích, tăng khối lượng: khối lượng riêng tăng hay giảm?',
      'Thả khối gỗ và khối nhôm cùng thể tích vào nước: khối nào chìm?',
      'Ở màn hình Bí ẩn, đo khối lượng và thể tích để đoán chất làm nên khối vật.',
    ],
  },
  {
    id: 'under-pressure',
    subject: 'physics',
    grade: 8,
    lessonIds: ['phy-g8-b04'],
    lessonLabel: 'Áp suất chất lỏng. Áp suất khí quyển',
    titleVi: 'Áp suất',
    summary: 'Đưa áp kế xuống các độ sâu khác nhau trong bể nước để thấy áp suất chất lỏng tăng theo độ sâu.',
    tryThis: [
      'Đặt áp kế ở mặt nước rồi đưa dần xuống đáy: số chỉ thay đổi thế nào?',
      'Tắt khí quyển: áp suất ở mặt nước còn bao nhiêu?',
      'Đổi chất lỏng từ nước sang mật ong: ở cùng độ sâu, áp suất lớn hơn hay nhỏ hơn?',
    ],
  },
  {
    id: 'buoyancy-basics',
    subject: 'physics',
    grade: 8,
    lessonIds: ['phy-g8-b05'],
    lessonLabel: 'Lực đẩy Archimedes',
    titleVi: 'Sự nổi: phần cơ bản',
    summary: 'Thả các khối khác chất vào nước, đo lực đẩy Archimedes và giải thích vì sao vật nổi hay chìm.',
    tryThis: [
      'Thả khối gỗ và khối sắt cùng thể tích: khối nào nổi? Vì sao?',
      'Bật mũi tên lực: so sánh trọng lực và lực đẩy khi vật nổi yên trên mặt nước.',
      'Đổi chất lỏng sang loại nặng hơn nước: vật có nổi cao hơn không?',
    ],
  },
  {
    id: 'balancing-act',
    subject: 'physics',
    grade: 8,
    lessonIds: ['phy-g8-b06', 'phy-g8-b07'],
    lessonLabel: 'Moment lực. Đòn bẩy',
    titleVi: 'Cân bằng',
    summary: 'Đặt các vật nặng lên tấm ván có điểm tựa và tìm vị trí để ván cân bằng theo quy tắc moment lực.',
    tryThis: [
      'Đặt hai vật nặng bằng nhau ở hai bên, cách điểm tựa bằng nhau: ván có cân bằng không?',
      'Đặt vật nặng gấp đôi ở một bên: phải đặt nó cách điểm tựa bao xa để ván cân bằng?',
      'Thử màn hình Trò chơi để đoán vị trí cân bằng.',
    ],
  },
  {
    id: 'balloons-and-static-electricity',
    subject: 'physics',
    grade: 8,
    lessonIds: ['phy-g8-b08'],
    lessonLabel: 'Hiện tượng nhiễm điện do cọ xát',
    titleVi: 'Bong bóng và tĩnh điện',
    summary: 'Cọ xát bóng bay vào áo len để thấy điện tích dịch chuyển và bóng bị hút vào tường.',
    tryThis: [
      'Cọ bóng vào áo len rồi quan sát: điện tích âm chuyển từ đâu sang đâu?',
      'Đưa bóng đã nhiễm điện lại gần tường: điều gì xảy ra?',
      'Dùng hai quả bóng cùng nhiễm điện: chúng hút hay đẩy nhau?',
    ],
  },
  {
    id: 'circuit-construction-kit-dc',
    subject: 'physics',
    grade: 8,
    lessonIds: ['phy-g8-b10', 'phy-g8-b09', 'phy-g8-b12', 'phy-g8-b13', 'phy-g9-b11'],
    lessonLabel: 'Mạch điện đơn giản',
    titleVi: 'Bộ lắp ráp mạch điện: DC',
    summary: 'Lắp mạch với pin, công tắc, bóng đèn; dùng ampe kế và vôn kế để đo cường độ dòng điện và hiệu điện thế.',
    tryThis: [
      'Lắp mạch kín gồm pin, công tắc và một bóng đèn. Mở công tắc: đèn còn sáng không?',
      'Mắc thêm bóng đèn thứ hai nối tiếp: độ sáng các đèn thay đổi thế nào?',
      'Mắc ampe kế nối tiếp và vôn kế song song với đèn rồi đọc số chỉ.',
    ],
  },
  {
    id: 'energy-skate-park-basics',
    subject: 'physics',
    grade: 9,
    lessonIds: ['phy-g9-b02', 'phy-g9-b01'],
    lessonLabel: 'Cơ năng',
    titleVi: 'Công viên ván trượt: phần cơ bản',
    summary: 'Theo dõi động năng và thế năng của người trượt ván trên đường trượt, và cơ năng khi có hoặc không có ma sát.',
    tryThis: [
      'Bật biểu đồ năng lượng: ở điểm thấp nhất, động năng hay thế năng lớn nhất?',
      'Khi không có ma sát, người trượt có lên lại được độ cao ban đầu không?',
      'Bật ma sát: cơ năng đi đâu?',
    ],
  },
  {
    id: 'bending-light',
    subject: 'physics',
    grade: 9,
    lessonIds: ['phy-g9-b04', 'phy-g7-b09', 'phy-g9-b05', 'phy-g9-b06'],
    lessonLabel: 'Khúc xạ ánh sáng',
    titleVi: 'Khúc xạ ánh sáng',
    summary: 'Chiếu tia laser từ không khí vào nước hoặc thủy tinh để đo góc tới, góc khúc xạ và thấy phản xạ toàn phần.',
    tryThis: [
      'Chiếu tia sáng từ không khí vào nước: tia khúc xạ lệch lại gần hay ra xa pháp tuyến?',
      'Dùng thước đo góc để so sánh góc tới và góc khúc xạ.',
      'Chiếu tia sáng từ nước ra không khí và tăng dần góc tới: khi nào xảy ra phản xạ toàn phần?',
    ],
  },
  {
    id: 'geometric-optics-basics',
    subject: 'physics',
    grade: 9,
    lessonIds: ['phy-g9-b07', 'phy-g9-b08', 'phy-g9-b09'],
    lessonLabel: 'Thấu kính',
    titleVi: 'Quang hình: phần cơ bản',
    summary: 'Di chuyển vật trước thấu kính hội tụ để thấy ảnh thật, ảnh ảo và vai trò của tiêu cự.',
    tryThis: [
      'Đặt vật ở rất xa thấu kính rồi đưa lại gần dần: ảnh to lên hay nhỏ đi?',
      'Đặt vật trong khoảng tiêu cự: ảnh là ảnh thật hay ảnh ảo?',
      'Bật các tia sáng đặc biệt và vẽ lại đường đi của chúng vào vở.',
    ],
  },
  {
    id: 'ohms-law',
    subject: 'physics',
    grade: 9,
    lessonIds: ['phy-g9-b10'],
    lessonLabel: 'Điện trở. Định luật Ohm',
    titleVi: 'Định luật Ohm',
    summary: 'Thay đổi hiệu điện thế và điện trở để thấy cường độ dòng điện I = U / R thay đổi theo.',
    tryThis: [
      'Giữ nguyên điện trở, tăng hiệu điện thế gấp đôi: cường độ dòng điện thay đổi thế nào?',
      'Giữ nguyên hiệu điện thế, tăng điện trở: cường độ dòng điện tăng hay giảm?',
      'Chọn U = 6 V, R = 300 Ω rồi tính I và so với số trên màn hình.',
    ],
  },
  {
    id: 'faradays-law',
    subject: 'physics',
    grade: 9,
    lessonIds: ['phy-g9-b13'],
    lessonLabel: 'Cảm ứng điện từ',
    titleVi: 'Định luật Faraday',
    summary: 'Di chuyển nam châm ra vào cuộn dây để tạo dòng điện cảm ứng làm đèn sáng.',
    tryThis: [
      'Để nam châm đứng yên trong cuộn dây: đèn có sáng không?',
      'Đưa nam châm ra vào nhanh hơn: đèn sáng mạnh hơn hay yếu hơn?',
      'Dùng cuộn dây nhiều vòng hơn và so sánh.',
    ],
  },
  {
    id: 'greenhouse-effect',
    subject: 'physics',
    grade: 9,
    lessonIds: ['phy-g9-b15'],
    lessonLabel: 'Năng lượng hóa thạch',
    titleVi: 'Hiệu ứng nhà kính',
    summary: 'Thay đổi lượng khí nhà kính trong khí quyển để thấy nhiệt độ Trái Đất thay đổi.',
    tryThis: [
      'Tăng lượng khí nhà kính: nhiệt độ bề mặt Trái Đất tăng hay giảm?',
      'So sánh nhiệt độ khi không có khí nhà kính và hiện nay.',
      'Thêm mây: ánh sáng Mặt Trời tới mặt đất nhiều hơn hay ít hơn?',
    ],
  },

  // ───────────────────────── Sinh học ─────────────────────────
  {
    id: 'neuron',
    subject: 'bio',
    grade: 8,
    lessonIds: ['bio-g8-b08'],
    lessonLabel: 'Hệ thần kinh và các giác quan',
    titleVi: 'Neuron',
    summary: 'Kích thích một tế bào thần kinh và quan sát xung thần kinh truyền dọc theo sợi trục.',
    tryThis: [
      'Bấm kích thích neuron và theo dõi xung thần kinh đi từ đầu này sang đầu kia.',
      'Kích thích hai lần liên tiếp thật nhanh: xung thứ hai có xuất hiện ngay không?',
    ],
  },
  {
    id: 'color-vision',
    subject: 'bio',
    grade: 8,
    lessonIds: ['bio-g8-b08'],
    lessonLabel: 'Hệ thần kinh và các giác quan',
    titleVi: 'Thị giác màu',
    summary: 'Pha trộn ánh sáng đỏ, lục, lam để thấy mắt người cảm nhận các màu khác nhau thế nào.',
    tryThis: [
      'Bật đèn đỏ và đèn lục cùng lúc: người xem thấy màu gì?',
      'Bật cả ba đèn với độ sáng tối đa: màu nhìn thấy là gì?',
      'Ở màn hình Một bóng đèn, dùng kính lọc màu và giải thích màu nhìn thấy.',
    ],
  },
  {
    id: 'gene-expression-essentials',
    subject: 'bio',
    grade: 9,
    lessonIds: ['bio-g9-b05', 'bio-g9-b04'],
    lessonLabel: 'Dịch mã. Từ gene đến tính trạng',
    titleVi: 'Biểu hiện gene: những điều cơ bản',
    summary: 'Kéo các yếu tố cần thiết vào gene để tạo mRNA, rồi đưa mRNA tới ribosome để tổng hợp protein.',
    tryThis: [
      'Ở màn hình Biểu hiện, đặt đúng yếu tố phiên mã để RNA polymerase bắt đầu tạo mRNA.',
      'Đưa mRNA tới ribosome và quan sát chuỗi protein được tạo ra.',
      'Tạo đủ cả ba loại protein trong tế bào.',
    ],
  },
  {
    id: 'natural-selection',
    subject: 'bio',
    grade: 9,
    lessonIds: ['bio-g9-b14', 'bio-g9-b15'],
    lessonLabel: 'Tiến hóa và các hình thức chọn lọc',
    titleVi: 'Chọn lọc tự nhiên',
    summary: 'Thêm đột biến màu lông, sói săn mồi hoặc thiếu thức ăn để xem quần thể thỏ thay đổi qua nhiều thế hệ.',
    tryThis: [
      'Thêm đột biến lông nâu rồi thả sói vào môi trường sa mạc: lông màu nào chiếm ưu thế sau vài thế hệ?',
      'Đổi môi trường sang Bắc Cực: kết quả có khác không?',
      'Theo dõi biểu đồ quần thể và giải thích vì sao tỉ lệ các kiểu lông thay đổi.',
    ],
  },
];

export const PHET_SIMS: PhetSim[] = RAW.map((s) => PhetSimSchema.parse(s));

export function getPhetSims(subject: PhetSim['subject']): PhetSim[] {
  return PHET_SIMS.filter((s) => s.subject === subject).sort((a, b) => a.grade - b.grade);
}

/** Sims linked to one lesson of our curriculum (e.g. "g8-b09", "phy-g8-b05"). */
export function getPhetSimsForLesson(lessonId: string): PhetSim[] {
  return PHET_SIMS.filter((s) => s.lessonIds.includes(lessonId)).sort(
    (a, b) => Number(b.lessonIds[0] === lessonId) - Number(a.lessonIds[0] === lessonId)
  );
}

/** Official Vietnamese build of the sim (exists only when PhET has a vi translation). */
export function phetEmbedUrl(id: string): string {
  return `https://phet.colorado.edu/sims/html/${id}/latest/${id}_vi.html`;
}

/** Small screenshot PhET publishes for every HTML5 sim. */
export function phetThumbnailUrl(id: string): string {
  return `https://phet.colorado.edu/sims/html/${id}/latest/${id}-128.png`;
}

export function phetPageUrl(id: string): string {
  return `https://phet.colorado.edu/vi/simulations/${id}`;
}
