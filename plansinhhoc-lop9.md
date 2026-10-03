# STEM-Solve — Sinh học lớp 9 (Khoa học tự nhiên 9 — Kết nối tri thức): Kế hoạch triển khai nội dung toàn diện

> **Nguồn đối chiếu bắt buộc:** SGK Khoa học tự nhiên lớp 9 (Bộ sách Kết nối tri thức với cuộc sống - NXB Giáo dục Việt Nam), đối chiếu mục lục và lời giải chuẩn trên VietJack: [https://vietjack.com/khoa-hoc-tu-nhien-9-kn/index.jsp](https://vietjack.com/khoa-hoc-tu-nhien-9-kn/index.jsp) và chuyên trang [https://vietjack.com/khoa-hoc-tu-nhien-9-kn/sinh-hoc-9-ket-noi-tri-thuc.jsp](https://vietjack.com/khoa-hoc-tu-nhien-9-kn/sinh-hoc-9-ket-noi-tri-thuc.jsp).  
> **Nguyên tắc tối thượng:** **TUYỆT ĐỐI KHÔNG TỰ BỊA ĐẶT** tên bài, số bài, thuật ngữ di truyền học, cơ chế phân tử, quy luật phân bào hay học thuyết tiến hóa ngoài SGK. Mọi nội dung biên soạn phải bám sát 100% chuẩn kiến thức, kỹ năng SGK KHTN 9 Kết nối tri thức.

---

## 1. Tổng quan & Mục tiêu Học thuật

Phân môn **Sinh học lớp 9** (thuộc môn Khoa học tự nhiên 9 - Kết nối tri thức) là đỉnh cao học thuật của toàn bộ chương trình KHTN cấp THCS. Đây là giai đoạn chuyển biến nhận thức sâu sắc nhất: học sinh chuyển từ quan sát mô tả hình thái sinh vật bên ngoài (lớp 6, 7) và giải phẫu cơ thể người (lớp 8) sang việc giải mã **bản chất di truyền ở cấp độ phân tử và tế bào**, đồng thời mở rộng tư duy biện chứng về **lịch sử tiến hóa của sự sống trên Trái Đất**.

- **Tổng số bài học:** Đúng **16 bài học** (từ Bài 36 đến Bài 51 SGK KNTT 9).
- **Phân bổ theo cấu trúc 4 Chương Sinh học trong SGK:**
  - **Chương 11: Di truyền học Mendel. Cơ sở phân tử của hiện tượng di truyền** (6 bài: Bài 36 đến Bài 41).
  - **Chương 12: Di truyền nhiễm sắc thể** (5 bài: Bài 42 đến Bài 46).
  - **Chương 13: Di truyền học với con người và đời sống** (2 bài: Bài 47 và Bài 48).
  - **Chương 14: Tiến hóa** (3 bài: Bài 49 đến Bài 51).
- **Đóng gói hệ thống (Gamified SnakePath):** Tổ chức thành **5 Unit** sư phạm khoa học, vừa vặn theo chặng học Duolingo-style (từ 3 đến 4 bài/unit, tối ưu lộ trình nhận thức và nhịp độ làm bài):
  - **Unit 1: Di truyền học Mendel & Cấu trúc phân tử di truyền** *(Chương 11 SGK - Phần 1: 3 bài, `bio-g9-b01` $\to$ `bio-g9-b03`)*.
  - **Unit 2: Cơ chế di truyền phân tử & Đột biến gene** *(Chương 11 SGK - Phần 2: 3 bài, `bio-g9-b04` $\to$ `bio-g9-b06`)*.
  - **Unit 3: Nhiễm sắc thể & Các cơ chế phân bào** *(Chương 12 SGK - Phần 1: 3 bài, `bio-g9-b07` $\to$ `bio-g9-b09`)*.
  - **Unit 4: Di truyền liên kết, Đột biến NST & Di truyền người** *(Chương 12 Phần 2 & Chương 13 Phần 1: 3 bài, `bio-g9-b10` $\to$ `bio-g9-b12`)*.
  - **Unit 5: Công nghệ di truyền, Học thuyết tiến hóa & Nguồn gốc sự sống** *(Chương 13 Phần 2 & Chương 14: 4 bài, `bio-g9-b13` $\to$ `bio-g9-b16`)*.

---

## 2. Bảng Danh mục 16 Bài học Sinh học 9 Chuẩn SGK Kết Nối Tri Thức

| Unit | Mã bài nội bộ | Bài SGK | Tên bài học chính thức (SGK KNTT) | Nội dung trọng tâm & Khái niệm cốt lõi theo chuẩn SGK |
|---|---|---|---|---|
| **Unit 1: Di truyền học Mendel & Cấu trúc phân tử di truyền** *(Chương 11 - Phần 1)* | `bio-g9-b01` | **Bài 36** | **Khái quát về di truyền học** | • Khái niệm di truyền (truyền đạt đặc tính từ bố mẹ cho con cái) và biến dị (con sinh ra khác bố mẹ và khác nhau về nhiều chi tiết).<br>• Mối quan hệ biện chứng giữa di truyền và biến dị trong sự sống.<br>• Các thuật ngữ di truyền cơ bản: Tính trạng, cặp tính trạng tương phản, nhân tố di truyền (gene), allele, kiểu gen, kiểu hình, thể đồng hợp, thể dị hợp, dòng thuần chủng.<br>• Phương pháp nghiên cứu di truyền độc đáo của Gregor Mendel: Phương pháp phân tích các thế hệ lai (lai các dòng thuần, theo dõi từng cặp tính trạng, dùng toán thống kê).<br>• Kí hiệu quy ước: $P, \times, F_1, F_2, G, \♂, \♀$. |
| | `bio-g9-b02` | **Bài 37** | **Các quy luật di truyền của Mendel** | • Thí nghiệm lai một cặp tính trạng của Mendel (hoa đỏ $\times$ hoa trắng) $\to$ **Quy luật phân li** (tỉ lệ kiểu hình $3$ trội : $1$ lặn ở $F_2$, tỉ lệ kiểu gen $1 AA : 2 Aa : 1 aa$).<br>• Phép lai phân tích: Mục đích xác định kiểu gen của cơ thể mang tính trạng trội (đồng hợp $AA$ cho con lai đồng tính, dị hợp $Aa$ cho con lai phân tính $1 : 1$).<br>• Thí nghiệm lai hai cặp tính trạng (hạt vàng, trơn $\times$ hạt xanh, nhăn) $\to$ **Quy luật phân li độc lập** (tỉ lệ kiểu hình $F_2$ là $9:3:3:1$).<br>• Công thức tổng quát cho $n$ cặp gen dị hợp phân li độc lập: Số loại giao tử $2^n$, số tổ hợp hợp tử $4^n$, số loại kiểu gen $3^n$, số loại kiểu hình $2^n$.<br>• Ý nghĩa: Tạo ra nguồn biến dị tổ hợp vô cùng phong phú trong chọn giống và tiến hóa. |
| | `bio-g9-b03` | **Bài 38** | **Nucleic acid và gene** | • Hai loại nucleic acid: DNA (Deoxyribonucleic acid) và RNA (Ribonucleic acid).<br>• Cấu trúc hóa học và không gian của phân tử DNA: Chuỗi xoắn kép gồm 2 mạch polynucleotide song song ngược chiều ($5' \to 3'$ và $3' \to 5'$); đơn phân là 4 loại nucleotide ($A, T, G, C$).<br>• Nguyên tắc bổ sung (NTBS): $A$ liên kết với $T$ bằng 2 liên kết hydrogen ($A = T$), $G$ liên kết với $C$ bằng 3 liên kết hydrogen ($G \equiv C$). Hệ quả: $A = T, G = C \Rightarrow A + G = T + C$.<br>• Cấu trúc và phân loại RNA: Mạch đơn polynucleotide, đơn phân $A, U, G, C$; gồm mRNA (truyền tin), tRNA (vận chuyển amino acid), rRNA (cấu tạo ribosome).<br>• Khái niệm gene: Một đoạn của phân tử DNA mang thông tin mã hóa cho một chuỗi polypeptide hoặc một phân tử RNA. |
| **Unit 2: Cơ chế di truyền phân tử & Đột biến gene** *(Chương 11 - Phần 2)* | `bio-g9-b04` | **Bài 39** | **Tái bản DNA và phiên mã tạo RNA** | • **Quá trình tái bản (nhân đôi) DNA:** Diễn ra trong nhân tế bào tại kì trung gian; enzyme tháo xoắn tách rời 2 mạch đơn làm khuôn; enzyme DNA polymerase tổng hợp mạch mới theo nguyên tắc bổ sung ($A - T, G - C$) và nguyên tắc bán bảo tồn (mỗi phân tử DNA con giữ lại 1 mạch cũ của mẹ và 1 mạch mới tổng hợp).<br>• Ý nghĩa: Đảm bảo thông tin di truyền được truyền đạt nguyên vẹn qua các thế hệ tế bào và thế hệ cơ thể.<br>• **Quá trình phiên mã tổng hợp RNA:** Diễn ra trong nhân; enzyme RNA polymerase bám vào vùng điều hòa, tách mạch DNA và dùng mạch khuôn ($3' \to 5'$) để tổng hợp RNA theo NTBS ($A_{gốc} - U, T_{gốc} - A, G_{gốc} - C, C_{gốc} - G$). |
| | `bio-g9-b05` | **Bài 40** | **Dịch mã và mối quan hệ từ gene đến tính trạng** | • **Mã di truyền:** Mã bộ ba (triplet trên DNA, codon trên mRNA); tính liên tục, tính đặc hiệu, tính thoái hóa, tính phổ biến; codon khởi đầu ($5'AUG3'$ - mã hóa methionine), 3 codon kết thúc ($UAA, UAG, UGA$).<br>• **Quá trình dịch mã:** Ribosome tiếp xúc đầu $5'$ mRNA; các phức hệ tRNA - amino acid lần lượt tiến vào khớp anticodon với codon theo NTBS; tạo liên kết peptide giữa các amino acid hình thành chuỗi polypeptide.<br>• Sơ đồ cơ chế truyền đạt thông tin di truyền trung tâm (Central Dogma):<br>$$\text{Gene (DNA)} \xrightarrow[\text{trong nhân}]{\text{Phiên mã}} \text{mRNA} \xrightarrow[\text{tế bào chất}]{\text{Dịch mã}} \text{Protein (Chuỗi Polypeptide)} \to \text{Tính trạng}$$<br>• Bản chất: Trình tự nucleotide trên gene quy định trình tự amino acid trong chuỗi polypeptide, quyết định cấu trúc và chức năng protein, biểu hiện thành tính trạng cơ thể. |
| | `bio-g9-b06` | **Bài 41** | **Đột biến gene** | • Khái niệm đột biến gene: Những biến đổi trong cấu trúc của gene, liên quan đến một hoặc một số cặp nucleotide (đột biến điểm).<br>• 3 dạng đột biến điểm: Thay thế một cặp nucleotide, Thêm một cặp nucleotide, Mất một cặp nucleotide.<br>• Tác động: Thay thế có thể làm thay đổi 1 amino acid hoặc không đổi (tính thoái hóa của mã); Thêm/Mất gây dịch khung đọc mã di truyền, làm thay đổi toàn bộ trình tự amino acid từ vị trí đột biến về sau.<br>• Nguyên nhân: Tác nhân vật lí (tia $UV$, tia phóng xạ), hóa học (chất độc hóa học $5-BU$, Dioxin), sinh học (virus) hoặc rối loạn sinh lí nội bào.<br>• Vai trò: Đa số có hại hoặc trung tính, số ít có lợi; là nguồn nguyên liệu sơ cấp dồi dào cho tiến hóa và chọn giống. |
| **Unit 3: Nhiễm sắc thể & Các cơ chế phân bào** *(Chương 12 - Phần 1)* | `bio-g9-b07` | **Bài 42** | **Nhiễm sắc thể và bộ nhiễm sắc thể** | • Cấu tạo nhiễm sắc thể (NST): Được cấu tạo từ chất nhiễm sắc gồm chuỗi xoắn kép DNA quấn quanh các khối cầu protein histone (nucleosome).<br>• Hình thái NST tại kì giữa: Co xoắn cực đại, gồm 2 nhiễm sắc tử chị em (chromatid) giống hệt nhau đính tại tâm động (eo sơ cấp - vị trí gắn thoi phân bào).<br>• Phân loại bộ NST: Bộ lưỡng bội ($2n$) chứa các cặp NST tương đồng (1 nguồn gốc từ bố, 1 từ mẹ); bộ đơn bội ($n$) trong giao tử chỉ chứa 1 chiếc của mỗi cặp.<br>• Tính đặc trưng của bộ NST: Mỗi loài sinh vật có bộ NST đặc trưng về số lượng, hình thái và cấu trúc (Người $2n = 46$, Ruồi giấm $2n = 8$, Đậu Hà Lan $2n = 14$, Tinh tinh $2n = 48$). Số lượng NST không phản ánh mức độ tiến hóa của loài. |
| | `bio-g9-b08` | **Bài 43** | **Nguyên phân và giảm phân** | • **Nguyên phân (Mitosis):** Xảy ra ở tế bào sinh dưỡng và tế bào sinh dục sơ khai; gồm 4 kì (Kì đầu: màng nhân biến mất, thoi vô sắc xuất hiện; Kì giữa: NST kép co xoắn cực đại xếp thành **1 hàng** trên mặt phẳng xích đạo; Kì sau: chromatid tách nhau ở tâm động thành 2 NST đơn phân li về 2 cực; Kì cuối: hình thành màng nhân, phân chia tế bào chất) $\to$ 1 tế bào mẹ ($2n$) cho 2 tế bào con giống nhau và giống mẹ ($2n$).<br>• **Giảm phân (Meiosis):** Xảy ra ở tế bào sinh dục chín; gồm 2 lần phân bào liên tiếp nhưng DNA chỉ nhân đôi 1 lần ở kì trung gian I.<br>  - Giảm phân I: Kì đầu I có tiếp hợp và trao đổi chéo giữa các chromatid khác nguồn gốc trong cặp tương đồng; Kì giữa I: Các cặp NST kép xếp thành **2 hàng**; Kì sau I: Các cặp NST kép tương đồng phân li độc lập về 2 cực $\to$ Tạo 2 tế bào con có bộ NST kép giảm đi một nửa ($n$ kép).<br>  - Giảm phân II: Diễn ra tương tự nguyên phân, tách chromatid $\to$ Tạo 4 tế bào con đơn bội ($n$).<br>• Ý nghĩa sinh học: Nguyên phân duy trì nòi giống tế bào; Giảm phân kết hợp Thụ tinh tạo ra vô số biến dị tổ hợp và duy trì bộ NST lưỡng bội $2n$ của loài qua các thế hệ. |
| | `bio-g9-b09` | **Bài 44** | **Nhiễm sắc thể giới tính và cơ chế xác định giới tính** | • Phân biệt NST thường (Autosomes - tồn tại thành các cặp tương đồng giống nhau ở hai giới) và NST giới tính (Heterosomes - khác nhau giữa giới đực và cái, mang gene quy định giới tính và gene liên kết giới tính).<br>• Các kiểu xác định giới tính: Kiểu $XX$ (cái) - $XY$ (đực) ở người, thú, ruồi giấm; Kiểu $XX$ (đực) - $XY$ (cái) ở chim, bò sát, bướm; Kiểu $XX$ - $XO$ ở châu chấu.<br>• Cơ chế xác định giới tính ở người: Người bố giảm phân tạo 2 loại tinh trùng ($22A + X$ và $22A + Y$) với tỉ lệ $1 : 1$; người mẹ chỉ tạo 1 loại trứng ($22A + X$). Thụ tinh ngẫu nhiên cho hợp tử $44A + XX$ (nữ) và $44A + XY$ (nam) theo tỉ lệ xấp xỉ $1 : 1$.<br>• Các yếu tố môi trường ảnh hưởng đến giới tính: Nhiệt độ ấp trứng (rùa nhiệt độ cao nở con cái, cá sấu nhiệt độ cao nở con đực), hormone sinh dục. |
| **Unit 4: Di truyền liên kết, Đột biến NST & Di truyền người** *(Chương 12 Phần 2 & Chương 13 Phần 1)* | `bio-g9-b10` | **Bài 45** | **Di truyền liên kết** | • Thí nghiệm của Thomas Hunt Morgan trên ruồi giấm: Lai ruồi thuần chủng Thân xám, cánh dài $\times$ Thân đen, cánh cụt $\to F_1$ 100% xám, dài. Cho ruồi đực $F_1$ lai phân tích với ruồi cái đen, cụt $\to F_a$ thu được tỉ lệ $1$ xám, dài : $1$ đen, cụt (thay vì $1:1:1:1$ như phân li độc lập của Mendel).<br>• Khái niệm di truyền liên kết: Hiện tượng các gene quy định các tính trạng khác nhau cùng nằm trên một nhiễm sắc thể và cùng phân li về một giao tử trong quá trình giảm phân.<br>• Nhóm gene liên kết: Số nhóm gene liên kết của một loài bằng số NST trong bộ đơn bội ($n$) của loài đó (Ruồi giấm $n = 4 \Rightarrow 4$ nhóm gene liên kết).<br>• Ý nghĩa thực tiễn: Giữ nguyên các nhóm tính trạng tốt luôn đi cùng nhau, hạn chế biến dị tổ hợp không mong muốn trong chọn giống. |
| | `bio-g9-b11` | **Bài 46** | **Đột biến nhiễm sắc thể** | • **Đột biến cấu trúc NST:** Những biến đổi làm thay đổi cấu trúc của NST gồm:<br>  - Mất đoạn: Mất một đoạn NST (mất đoạn đầu NST số 5 gây hội chứng tiếng mèo kêu; mất đoạn nhỏ NST 21 gây bệnh ung thư máu).<br>  - Lặp đoạn: Một đoạn NST được lặp lại một hay nhiều lần (làm tăng hoặc giảm cường độ biểu hiện tính trạng, như lặp đoạn trên NST X của ruồi giấm làm mắt lồi thành mắt dẹt).<br>  - Đảo đoạn: Một đoạn NST đứt ra rồi quay 180° và gắn lại.<br>  - Chuyển đoạn: Trao đổi đoạn giữa các NST (chuyển đoạn tương hỗ hoặc không tương hỗ).<br>• **Đột biến số lượng NST:**<br>  - Lệch bội (dị bội): Biến đổi số lượng ở một hoặc một số cặp NST tương đồng (thể một $2n - 1$, thể ba $2n + 1$).<br>  - Đa bội: Toàn bộ bộ NST tăng theo bội số nguyên của $n$ (tam bội $3n$, tứ bội $4n$).<br>• Ứng dụng: Giống cây trồng đa bội (nho $4n$, dưa hấu tam bội $3n$ không hạt) sinh trưởng mạnh, cơ quan sinh dưỡng to, năng suất cao và chống chịu tốt. |
| | `bio-g9-b12` | **Bài 47** | **Di truyền học với con người** | • Phương pháp nghiên cứu di truyền người: Phương pháp phả hệ (theo dõi sự di truyền tính trạng qua nhiều thế hệ) và Nghiên cứu trẻ đồng sinh (cùng trứng: cùng kiểu gen; khác trứng: kiểu gen khác nhau) để phân tích vai trò của kiểu gen và môi trường.<br>• Các bệnh, tật di truyền nguy hiểm ở người:<br>  - Đột biến số lượng NST: Hội chứng Đao (thể ba cặp 21: $2n + 1 = 47$, cổ ngắn, mắt xếch, lưỡi dày, chậm phát triển trí tuệ); Hội chứng Turner ($45, XO$: nữ lùn, dạ con hẹp, vô sinh); Hội chứng Klinefelter ($47, XXY$: nam cao, tay chân dài, vô sinh).<br>  - Đột biến gene: Bệnh mù màu, bệnh máu khó đông (gene lặn trên NST X); Bệnh tan máu bẩm sinh Thalassemia; Bệnh bạch tạng (gene lặn trên NST thường).<br>• Di truyền y học tư vấn, chẩn đoán trước sinh; tác hại to lớn của hôn nhân cận huyết và ô nhiễm hóa chất phóng xạ. |
| **Unit 5: Công nghệ di truyền, Học thuyết tiến hóa & Nguồn gốc sự sống** *(Chương 13 Phần 2 & Chương 14)* | `bio-g9-b13` | **Bài 48** | **Ứng dụng công nghệ di truyền vào đời sống** | • **Công nghệ tế bào:**<br>  - Nuôi cấy mô tế bào thực vật: Nhân nhanh hàng loạt cây giống sạch bệnh, đồng nhất về kiểu gen (phong lan, khoai tây, sâm Ngọc Linh).<br>  - Nhân bản vô tính ở động vật: Cừu Dolly (chuyển nhân tế bào tuyến vú vào trứng đã hút nhân).<br>  - Cấy truyền phôi ở gia súc: Tăng nhanh đàn gia súc quý.<br>• **Công nghệ gene (Kĩ thuật di truyền):**<br>  - Quy trình chuyển gene: Tách thể truyền (plasmid/virus) và ADN chứa gen cần chuyển $\to$ Dùng enzyme cắt giới hạn (restrictase) và ligase tạo ADN tái tổ hợp $\to$ Đưa ADN tái tổ hợp vào tế bào nhận (E. coli, nấm men).<br>• Thành tựu sinh vật biến đổi gene (GMO): Vi khuẩn sản xuất insulin người trị tiểu đường, hormone tăng trưởng $GH$; Giống lúa gạo vàng Golden Rice giàu tiền chất vitamin A; Ngô/bông mang gen $Bt$ kháng sâu đục thân. |
| | `bio-g9-b14` | **Bài 49** | **Khái niệm tiến hoá và các hình thức chọn lọc** | • Khái niệm tiến hóa: Quá trình biến đổi của sinh giới từ đơn giản đến phức tạp, từ ít thích nghi đến thích nghi hoàn hảo hơn với môi trường sống.<br>• Bằng chứng tiến hóa:<br>  - Bằng chứng giải phẫu so sánh: Cơ quan tương đồng (cùng nguồn gốc phát sinh dù chức năng khác nhau: cánh dơi, vây cá voi, chân trước ngựa, tay người $\to$ phản ánh tiến hóa phân li); Cơ quan thoái hóa (di tích của cơ quan xưa kia phát triển: ruột thừa, xương cùng ở người).<br>  - Bằng chứng hóa thạch: Di tích của sinh vật cổ đại để lại trong các lớp đất đá vỏ Trái Đất (bằng chứng trực tiếp quan trọng nhất).<br>• **Chọn lọc nhân tạo:** Con người đóng vai trò chủ động chọn và giữ lại các cá thể mang biến dị có lợi cho nhu cầu kinh tế/thẩm mĩ $\to$ đào thải biến dị bất lợi $\to$ tạo hàng trăm giống chó, bồ câu, lúa mì.<br>• **Chọn lọc tự nhiên (Darwin):** Môi trường sống đào thải những cá thể mang biến dị bất lợi, bảo tồn và nhân lên những cá thể mang biến dị có lợi $\to$ sinh vật ngày càng thích nghi với môi trường sống. |
| | `bio-g9-b15` | **Bài 50** | **Cơ chế tiến hoá** | • **Thuyết tiến hóa tổng hợp hiện đại:** Kết hợp thuyết chọn lọc tự nhiên của Darwin với di truyền học phân tử và di truyền học quần thể.<br>• Các nhân tố tiến hóa cơ bản:<br>  1. Đột biến: Tạo ra các allele mới, nguồn nguyên liệu sơ cấp của tiến hóa.<br>  2. Giao phối (giao phối ngẫu nhiên): Phát tán đột biến, tạo vô số biến dị tổ hợp (nguyên liệu thứ cấp).<br>  3. Chọn lọc tự nhiên: Nhân tố có hướng duy nhất, quy định chiều hướng và nhịp điệu của quá trình tiến hóa.<br>• Quá trình hình thành đặc điểm thích nghi: Sự phối hợp giữa đột biến, giao phối và chọn lọc tự nhiên tích lũy các kiểu gen thích nghi.<br>• Cơ chế hình thành loài mới: Quá trình phân li tính trạng từ một loài ban đầu dưới tác động của các cơ chế cách li (cách li địa lí, cách li sinh thái, cách li tập tính) dần tích lũy sai khác di truyền dẫn đến cách li sinh sản — dấu hiệu then chốt đánh dấu loài mới đã chính thức hình thành. |
| | `bio-g9-b16` | **Bài 51** | **Sự phát sinh và phát triển sự sống trên Trái Đất** | • **Ba giai đoạn phát sinh sự sống (Thuyết Oparin - Haldane):**<br>  1. Tiến hóa hóa học: Từ các chất vô cơ trong khí quyển nguyên thủy ($CH_4, NH_3, H_2O, H_2$, không có $O_2$), dưới tác động của năng lượng sấm sét, bức xạ tử ngoại $\to$ hình thành chất hữu cơ đơn giản (amino acid, nucleotide) $\to$ trùng phân thành đại phân tử sinh học (thí nghiệm Miller - Urey chứng minh).<br>  2. Tiến hóa tiền sinh học: Sự tập hợp đại phân tử thành các giọt đông tụ (coacervate), màng lipid kép bao bọc tạo nên các tế bào nguyên thủy (protocell) có khả năng trao đổi chất sơ khai.<br>  3. Tiến hóa sinh học: Từ tế bào nguyên thủy chịu tác động của CLTN phát triển thành toàn bộ thế giới sinh vật nhân sơ, nhân thực đa bào ngày nay.<br>• **Lịch sử phát triển sinh giới qua 5 đại địa chất:**<br>  - Đại Thái cổ: Xuất hiện sinh vật nhân sơ cổ nhất (vi khuẩn, vi khuẩn lam).<br>  - Đại Nguyên sinh: Tảo, động vật không xương sống nguyên thủy ở biển.<br>  - Đại Cổ sinh: Thực vật di cư lên cạn, xuất hiện cá, lưỡng cư, bò sát cổ và rừng quyết khổng lồ (than đá).<br>  - Đại Trung sinh: Thời đại cực thịnh của bò sát khổng lồ (khủng long), xuất hiện chim cổ, thú cổ và thực vật hạt trần.<br>  - Đại Tân sinh: Kỉ Đệ Tam và Đệ Tứ — Thời đại phồn thịnh của thú, chim, thực vật hạt kín; xuất hiện loài người (thế Canh tân). |

---

## 3. Bảng Phân Tích Cạm Bẫy Nhận Thức (Pitfalls & Traps) Cho Toàn Bộ 16 Bài Học

Để bài tập đạt chuẩn sư phạm cao nhất, không bị nhàm chán và giúp học sinh tránh các "bẫy" kinh điển trong các kì thi học kì và thi vào 10, mỗi bài học được thiết kế xoay quanh các cạm bẫy tư duy cốt lõi sau:

| Mã bài | Bài SGK | Cạm bẫy học sinh hay mắc phải nhất (Common Traps & Misconceptions) | Hướng giải thích & Khắc phục sư phạm |
|---|---|---|---|
| `bio-g9-b01` | **Bài 36** | Nhầm lẫn giữa "cặp tính trạng tương phản" (vàng vs xanh, trơn vs nhăn) với "tính trạng khác loại" (vàng vs nhăn). Nhầm khái niệm kiểu gen với kiểu hình. | Nhấn mạnh: Cặp tính trạng tương phản phải là **hai trạng thái biểu hiện trái ngược nhau của cùng một loại tính trạng** (màu sắc hạt: vàng đối lập với xanh). |
| `bio-g9-b02` | **Bài 37** | 1. Nhầm tỉ lệ kiểu gen ($1:2:1$) với tỉ lệ kiểu hình ($3:1$) trong lai 1 cặp gen.<br>2. Quên rằng phép lai phân tích bắt buộc phải lai với cá thể đồng hợp lặn ($aa$).<br>3. Trong lai 2 cặp phân li độc lập ($AaBb \times AaBb$), nhầm tỉ lệ kiểu hình mang 1 tính trạng trội ($3/16 + 3/16 = 6/16 = 3/8$) với cả 2 tính trạng trội ($9/16$). | Dạy phương pháp nhân xác suất độc lập: Phép lai $(Aa \times Aa)(Bb \times Bb) \to (3/4 \text{ trội} : 1/4 \text{ lặn}) \times (3/4 \text{ trội} : 1/4 \text{ lặn})$. |
| `bio-g9-b03` | **Bài 38** | 1. Nhầm liên kết hydrogen ($A=T, G\equiv C$) nối 2 mạch với liên kết phosphodiester (liên kết hóa trị) nối các nucleotide trên cùng 1 mạch.<br>2. Nhầm đơn phân của RNA là thymine (T) thay vì uracil (U). | Khắc họa hình ảnh: Cầu thang xoắn — tay vịn 2 bên là liên kết hóa trị bền vững, bậc thang ở giữa là liên kết hydrogen dễ đứt khi nhân đôi. |
| `bio-g9-b04` | **Bài 39** | 1. Quên nguyên tắc bán bảo tồn: Sau $k$ lần nhân đôi từ 1 DNA ban đầu luôn chỉ có đúng 2 phân tử DNA con chứa 1 mạch cũ của mẹ.<br>2. Nhầm mạch khuôn dùng để phiên mã: Chỉ có mạch gốc ($3' \to 5'$) mới làm khuôn tổng hợp mRNA ($5' \to 3'$). | Khẳng định quy tắc chiều phân tử: Enzyme polymeraza luôn chỉ trượt theo chiều $3' \to 5'$ trên mạch khuôn để kéo dài mạch mới theo chiều $5' \to 3'$. |
| `bio-g9-b05` | **Bài 40** | 1. Nhầm lẫn codon (trên mRNA) với triplet (trên DNA) và anticodon (trên tRNA).<br>2. Nhầm codon mở đầu ($AUG$) với các codon kết thúc ($UAA, UAG, UGA$ — không mã hóa amino acid). | Bảng đối chiếu 3 tầng mã: $DNA \to mRNA \to tRNA$. Nhắc nhở codon kết thúc là "tín hiệu dừng", không mang amino acid nào. |
| `bio-g9-b06` | **Bài 41** | 1. Tưởng rằng đột biến thay thế nucleotide luôn làm biến đổi amino acid (Sai, do tính thoái hóa của mã, nhiều bộ ba cùng mã hóa 1 amino acid).<br>2. Đánh đồng mức độ nguy hại: Đột biến thêm/mất 1 cặp nu gây dịch khung đọc mã nguy hại hơn nhiều so với đột biến thay thế 1 cặp nu. | Đưa ví dụ cụ thể về đột biến câm (silent mutation) và đột biến thay thế ở hồng cầu hình liềm (HbA $\to$ HbS do thay codon $GAG \to GUG$). |
| `bio-g9-b07` | **Bài 42** | 1. Đếm sai số chromatid: Chromatid chỉ tồn tại ở trạng thái NST kép (kì đầu và kì giữa). Ở kì sau và kì cuối, tâm động đã tách nên **số chromatid = 0**.<br>2. Tưởng rằng loài nào có số lượng NST nhiều hơn thì tiến hóa hơn (Sai: gà $2n=78$, người chỉ $2n=46$). | Cung cấp bảng tính trạng thái NST (Kép vs Đơn) và số lượng chromatid ở từng kì của chu kì tế bào. |
| `bio-g9-b08` | **Bài 43** | Bẫy kinh điển lớn nhất: Nhầm cách xếp hàng của NST ở kì giữa.<br>• Kì giữa Nguyên phân: NST kép xếp **1 hàng**.<br>• Kì giữa Giảm phân I: NST kép tương đồng xếp **2 hàng** song song.<br>• Giảm phân I không chẻ tâm động, chỉ phân li các cặp tương đồng; Giảm phân II mới chẻ tâm động tách chromatid. | Trực quan hóa sơ đồ phân bào: Hình ảnh 1 hàng vs 2 hàng tại mặt phẳng xích đạo. Phân biệt rõ phân li tương đồng kép (GP I) và phân li đơn (GP II / NP). |
| `bio-g9-b09` | **Bài 44** | Áp dụng máy móc cặp NST giới tính của người cho mọi loài: Nhầm rằng ở chim, bướm, bò sát con đực là $XY$ (Sai! Ở chim/bò sát: đực là $XX$, cái là $XY$). | Lưu ý học sinh: Ghi nhớ 2 nhóm sinh vật điển hình: Nhóm thú/người/ruồi giấm ($XX$ cái, $XY$ đực) vs Nhóm chim/bò sát/bướm ($XX$ đực, $XY$ cái). |
| `bio-g9-b10` | **Bài 45** | Nhầm tỉ lệ lai phân tích của Morgan với Mendel: Lai phân tích ruồi đực $F_1$ di truyền liên kết cho tỉ lệ $1:1$ (chỉ 2 lớp kiểu hình giống bố mẹ), không cho $1:1:1:1$ như phân li độc lập. | Giải thích: 2 gene nằm trên cùng 1 NST thì như 2 hành khách ngồi chung 1 toa tàu, luôn đi cùng nhau về 1 cực tế bào khi phân bào. |
| `bio-g9-b11` | **Bài 46** | 1. Nhầm đột biến thể ba ($2n + 1 = 47$ như hội chứng Đao) với đột biến tam bội ($3n = 69$).<br>2. Nhầm đột biến mất đoạn NST (mất hàng nghìn gen) với đột biến mất 1 cặp nucleotide của gen (mất 1 bậc thang ADN). | So sánh quy mô: Đột biến gen là lỗi ở 1 từ trong cuốn sách; Đột biến NST là mất hoặc xé rách cả một trang sách. |
| `bio-g9-b12` | **Bài 47** | 1. Nghĩ rằng bệnh máu khó đông và mù màu xuất hiện ở nam và nữ với tỉ lệ ngang nhau (Sai! Do gen lặn trên X, nam chỉ cần 1 alen lặn $X^aY$ đã biểu hiện, nữ cần 2 alen lặn $X^aX^a$ nên nam mắc nhiều hơn nữ).<br>2. Nhầm tuổi mẹ mang thai: Mẹ sinh con khi tuổi trên 35 làm tăng nguy cơ sinh con mắc hội chứng Đao do rối loạn phân li NST số 21 trong giảm phân. | Dùng sơ đồ lai liên kết giới tính để chứng minh tại sao bố mẹ bình thường có thể sinh con trai bị mù màu ($X^A X^a \times X^A Y \to X^a Y$). |
| `bio-g9-b13` | **Bài 48** | 1. Nhầm lẫn vai trò của enzyme cắt restrictase (cắt ADN tạo đầu so le) và ligase (nối ADN).<br>2. Nhầm cừu Dolly mang kiểu gen của con cừu mang thai (Sai! Cừu Dolly mang 100% kiểu gen nhân của con cừu cho tế bào tuyến vú). | Nhấn mạnh bản chất chuyển nhân: Cơ quan quyết định đặc tính di truyền chính là nhân tế bào; tế bào chất của trứng và tử cung cừu mang thai chỉ là môi trường nuôi dưỡng. |
| `bio-g9-b14` | **Bài 49** | Nhầm lẫn cơ quan tương đồng (cùng nguồn gốc, khác chức năng: tay người và cánh dơi) với cơ quan tương tự (khác nguồn gốc, cùng chức năng: cánh dơi và cánh côn trùng). | Mẹo ghi nhớ: Tương đồng = "Cùng dòng họ, đổi nghề"; Tương tự = "Khác họ hàng, làm cùng một việc". |
| `bio-g9-b15` | **Bài 50** | Hiểu sai: "Chọn lọc tự nhiên trực tiếp tạo ra các biến dị mới thích nghi" (Sai hoàn toàn! Đột biến và giao phối mới tạo biến dị ngẫu nhiên; CLTN chỉ sàng lọc, giữ lại cái có lợi và đào thải cái bất lợi). | Khắc cốt ghi tâm: CLTN không tạo ra biến dị, nó đóng vai trò "cái rây" (bộ lọc) định hướng sự tiến hóa. |
| `bio-g9-b16` | **Bài 51** | 1. Nhầm bầu khí quyển nguyên thủy Trái Đất có nhiều $O_2$ (Sai, thuở sơ khai không có khí $O_2$, chỉ có $CH_4, NH_3, H_2O, H_2$).<br>2. Nhầm lẫn niên đại xuất hiện loài người: Loài người xuất hiện ở Đại Tân sinh (Kỉ Đệ Tứ), không phải Đại Cổ sinh hay Trung sinh. | Nhắc học sinh: Khí $O_2$ chỉ xuất hiện sau khi vi khuẩn lam quang hợp giải phóng ra. Nhớ chuỗi 5 đại: Thái cổ $\to$ Nguyên sinh $\to$ Cổ sinh $\to$ Trung sinh $\to$ Tân sinh. |

---

## 4. Kiến Trúc Dữ Liệu & Quy Chuẩn Thư Mục

Toàn bộ nội dung phân hệ Sinh học lớp 9 được tổ chức bài bản tại `src/content/biology/g9/` và thư viện tri thức tại `src/content/kb/biology/g9/`:

```
src/content/biology/
├── g9/
│   ├── curriculum.ts                                      # Đăng ký 16 bài học, đúng 5 Unit
│   ├── unit-1-di-truyen-mendel-co-so-phan-tu/
│   │   ├── bio-g9-b01.theory.json                         # Bài 36: Khái quát về di truyền học
│   │   ├── bio-g9-b01.exercises.json
│   │   ├── bio-g9-b02.theory.json                         # Bài 37: Các quy luật di truyền của Mendel
│   │   ├── bio-g9-b02.exercises.json
│   │   ├── bio-g9-b03.theory.json                         # Bài 38: Nucleic acid và gene
│   │   └── bio-g9-b03.exercises.json
│   ├── unit-2-co-che-phan-tu-dot-bien-gene/
│   │   ├── bio-g9-b04.theory.json                         # Bài 39: Tái bản DNA và phiên mã tạo RNA
│   │   ├── bio-g9-b04.exercises.json
│   │   ├── bio-g9-b05.theory.json                         # Bài 40: Dịch mã & Mối quan hệ gene - tính trạng
│   │   ├── bio-g9-b05.exercises.json
│   │   ├── bio-g9-b06.theory.json                         # Bài 41: Đột biến gene
│   │   └── bio-g9-b06.exercises.json
│   ├── unit-3-nhiem-sac-the-co-che-phan-bao/
│   │   ├── bio-g9-b07.theory.json                         # Bài 42: Nhiễm sắc thể & bộ nhiễm sắc thể
│   │   ├── bio-g9-b07.exercises.json
│   │   ├── bio-g9-b08.theory.json                         # Bài 43: Nguyên phân và giảm phân
│   │   ├── bio-g9-b08.exercises.json
│   │   ├── bio-g9-b09.theory.json                         # Bài 44: NST giới tính & cơ chế xác định giới tính
│   │   └── bio-g9-b09.exercises.json
│   ├── unit-4-di-truyen-lien-ket-dot-bien-nst-nguoi/
│   │   ├── bio-g9-b10.theory.json                         # Bài 45: Di truyền liên kết
│   │   ├── bio-g9-b10.exercises.json
│   │   ├── bio-g9-b11.theory.json                         # Bài 46: Đột biến nhiễm sắc thể
│   │   ├── bio-g9-b11.exercises.json
│   │   ├── bio-g9-b12.theory.json                         # Bài 47: Di truyền học với con người
│   │   └── bio-g9-b12.exercises.json
│   └── unit-5-cong-nghe-di-truyen-tien-hoa-su-song/
│       ├── bio-g9-b13.theory.json                         # Bài 48: Ứng dụng công nghệ di truyền vào đời sống
│       ├── bio-g9-b13.exercises.json
│       ├── bio-g9-b14.theory.json                         # Bài 49: Khái niệm tiến hoá & các hình thức chọn lọc
│       ├── bio-g9-b14.exercises.json
│       ├── bio-g9-b15.theory.json                         # Bài 50: Cơ chế tiến hoá
│       ├── bio-g9-b15.exercises.json
│       ├── bio-g9-b16.theory.json                         # Bài 51: Sự phát sinh & phát triển sự sống
│       └── bio-g9-b16.exercises.json
src/content/kb/biology/
└── g9/
    ├── mendel-inheritance-rules.json                      # Sơ đồ lai Mendel, bảng Punnett & tỉ lệ phân li
    ├── molecular-genetics-central-dogma.json              # Cấu trúc DNA/RNA, NTBS A-T/U, G-C, bảng codon
    ├── cell-division-mitosis-meiosis.json                 # Bảng so sánh NST ở các kì nguyên phân và giảm phân
    ├── genetic-mutations-aberrations.json                 # Đột biến gen, đột biến NST và các hội chứng y sinh
    └── evolution-and-history-of-life.json                 # Bằng chứng tiến hóa, nhân tố tiến hóa & 5 đại địa chất
```

---

## 5. Các Trải Nghiệm Gamification & Minigame Độc Quyền Sinh Học 9

Để mang lại cảm giác học tập lôi cuốn ("wow experience") tương tự như game giáo dục quốc tế, phân môn Sinh học 9 được tích hợp 3 mini-game và chế độ tương tác cao cấp:

### 1. Minigame: "Vườn Đậu Mendel (Mendel's Pea Garden)" (`mendel-garden`)
- **Bối cảnh:** Học sinh đóng vai Gregor Mendel trong tu viện Brno.
- **Gameplay:**
  - Nhận các chậu đậu Hà Lan bố mẹ ($P$) với các tính trạng tương phản: Hoa đỏ vs Hoa trắng, Hạt vàng vs Hạt xanh.
  - Thao tác kéo chổi phấn để thực hiện thụ phấn nhân tạo (cắt bỏ nhị hoa mẹ, lấy phấn hoa bố).
  - Thu hoạch thế hệ $F_1$, cho $F_1$ tự thụ phấn để quan sát phân li $F_2$.
  - Đồng hồ đếm ngược thách thức: Xác định nhanh kiểu gen của cây hoa đỏ bất kì bằng cách chọn cây cho phép lai phân tích ($aa$) để nhận điểm thưởng Combo.

### 2. Minigame: "Cỗ Máy Dịch Mã Siêu Tốc (Ribosome Rush)" (`ribosome-rush`)
- **Bối cảnh:** Mô phỏng bên trong tế bào chất, sợi mRNA trôi qua khe ribosome.
- **Gameplay:**
  - Chuỗi codon xuất hiện trên băng chuyền mRNA (ví dụ: $AUG - UUU - GGG - UAA$).
  - Học sinh điều khiển các xe chở tRNA mang amino acid tương ứng (Methionine, Phenylalanine, Glycine...).
  - Thách thức: Phải khớp đúng anticodon theo nguyên tắc bổ sung ($A - U, G - C$) trước khi ribosome trôi qua. Khớp đúng tạo liên kết peptide phát sáng và cộng điểm; khớp sai chuỗi polypeptide bị gãy!

### 3. Visualizer Chuyên Sâu: "Kính Hiển Vi Bắt Kì Phân Bào" (`mitosis-meiosis-scope`)
- **Chức năng:** Tích hợp trực tiếp trên trang bài học [`ExercisePage.tsx`](file:///d:/dow/dự%20án%20hóa%20học%20web/src/app/pages/ExercisePage.tsx).
- **Tương tác:** Học sinh di chuyển thanh trượt kì phân bào (Kì đầu $\to$ Kì giữa $\to$ Kì sau $\to$ Kì cuối) để quan sát sự chuyển động của thoi vô sắc, sự co xoắn NST và sự phân tách của chromatid/cặp tương đồng dưới dạng hình họa 2D vector mượt mà.

---

## 6. Lộ Trình Triển Khai Chi Tiết Từng Milestone (M1 $\to$ M7)

- [x] **Milestone 1: Khởi tạo Kiến trúc Khung Curriculum Sinh học 9 (ĐÃ HOÀN THÀNH)**
  - [x] Tạo `src/content/biology/g9/curriculum.ts` đăng ký đủ 16 bài thuộc 5 Unit kèm guidebook (traps, formulas, core concepts).
  - [x] Cập nhật `src/content/curriculum/biology.ts` trỏ lớp 9 về `GRADE_9_BIOLOGY_CURRICULUM`.
  - [x] Tích hợp Grade 9 Biology vào search index tại `src/features/search/searchEngine.ts`.
  - [x] Khởi tạo 5 tệp thư viện tri thức bổ trợ chuẩn tại `src/content/kb/biology/g9/`:
    - `mendel-inheritance-rules.json` (Quy luật phân li, phân li độc lập, bảng Punnett).
    - `molecular-genetics-central-dogma.json` (Cấu trúc DNA/RNA, NTBS A-T/U, G-C, bảng mã di truyền).
    - `cell-division-mitosis-meiosis.json` (Nguyên phân, giảm phân, so sánh bộ NST ở các kì).
    - `genetic-mutations-aberrations.json` (Đột biến gen, đột biến NST và các hội chứng Đao, Turner, Klinefelter).
    - `evolution-and-history-of-life.json` (Bằng chứng tiến hóa, nhân tố tiến hóa & 5 đại địa chất).
  - [x] Kiểm thử TypeScript `npx tsc -b --noEmit` đạt 0 lỗi.
  - [x] Báo cáo và dừng chờ duyệt sau Milestone 1.

- [x] **Milestone 2: Triển khai Unit 1 — Di truyền học Mendel & Cấu trúc phân tử di truyền (ĐÃ HOÀN THÀNH)**
  - [x] Soạn thảo `bio-g9-b01` (Bài 36: Khái quát về di truyền học) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b02` (Bài 37: Các quy luật di truyền của Mendel) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b03` (Bài 38: Nucleic acid và gene) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Bổ sung thư viện tri thức Unit 1 `src/content/kb/biology/g9/unit1-knowledge.json` với 20 knowledge IDs đối chiếu.
  - [x] Xác thực nội dung bằng `npx tsx scripts/validate-content.ts` và kiểm thử `npx tsc -b --noEmit`.
  - [x] Báo cáo và dừng chờ duyệt sau Unit 1.

- [x] **Milestone 3: Triển khai Unit 2 — Cơ chế di truyền phân tử & Đột biến gene (ĐÃ HOÀN THÀNH)**
  - [x] Soạn thảo `bio-g9-b04` (Bài 39: Tái bản DNA và phiên mã tạo RNA) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b05` (Bài 40: Dịch mã và mối quan hệ từ gene đến tính trạng) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b06` (Bài 41: Đột biến gene) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Bổ sung thư viện tri thức Unit 2 `src/content/kb/biology/g9/unit2-knowledge.json` với 18 knowledge IDs đối chiếu.
  - [x] Xác thực nội dung bằng `npx tsx scripts/validate-content.ts` và kiểm thử `npx tsc -b --noEmit` & `npm test`.
  - [x] Báo cáo và dừng chờ duyệt sau Unit 2.

- [x] **Milestone 4: Triển khai Unit 3 — Nhiễm sắc thể & Các cơ chế phân bào (ĐÃ HOÀN THÀNH)**
  - [x] Soạn thảo `bio-g9-b07` (Bài 42: Nhiễm sắc thể và bộ nhiễm sắc thể) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b08` (Bài 43: Nguyên phân và giảm phân) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b09` (Bài 44: Nhiễm sắc thể giới tính và cơ chế xác định giới tính) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Bổ sung thư viện tri thức Unit 3 `src/content/kb/biology/g9/unit3-knowledge.json` với 16 knowledge IDs đối chiếu.
  - [x] Xác thực nội dung bằng `npx tsx scripts/validate-content.ts` và kiểm thử `npx tsc -b --noEmit` & `npm test`.
  - [x] Báo cáo và dừng chờ duyệt sau Unit 3.

- [x] **Milestone 5: Triển khai Unit 4 — Di truyền liên kết, Đột biến NST & Di truyền người (ĐÃ HOÀN THÀNH)**
  - [x] Soạn thảo `bio-g9-b10` (Bài 45: Di truyền liên kết) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b11` (Bài 46: Đột biến nhiễm sắc thể) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b12` (Bài 47: Di truyền học với con người) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Bổ sung thư viện tri thức Unit 4 `src/content/kb/biology/g9/unit4-knowledge.json` với 18 knowledge IDs đối chiếu.
  - [x] Xác thực nội dung bằng `npx tsx scripts/validate-content.ts` và kiểm thử `npx tsc -b --noEmit` & `npm test`.
  - [x] Báo cáo và dừng chờ duyệt sau Unit 4.

- [x] **Milestone 6: Triển khai Unit 5 — Công nghệ di truyền, Học thuyết tiến hóa & Nguồn gốc sự sống (ĐÃ HOÀN THÀNH)**
  - [x] Soạn thảo `bio-g9-b13` (Bài 48: Ứng dụng công nghệ di truyền vào đời sống) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b14` (Bài 49: Khái niệm tiến hoá và các hình thức chọn lọc) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b15` (Bài 50: Cơ chế tiến hoá) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Soạn thảo `bio-g9-b16` (Bài 51: Sự phát sinh và phát triển sự sống trên Trái Đất) gồm `theory.json` và `exercises.json` (8 bài tập, 3 steps chuẩn Zod).
  - [x] Bổ sung thư viện tri thức Unit 5 `src/content/kb/biology/g9/unit5-knowledge.json` với 20 knowledge IDs đối chiếu.
  - [x] Xác thực nội dung bằng `npx tsx scripts/validate-content.ts` và kiểm thử `npx tsc -b --noEmit` & `npm test`.
  - [x] Báo cáo và dừng chờ duyệt sau Unit 5.

- [x] **Milestone 7: Kiểm thử Tổng thể & Nghiệm thu Tích hợp Hệ thống (ĐÃ HOÀN THÀNH)**
  - [x] Bổ sung 16 kỹ năng Sinh học 9 vào `src/content/skills.ts`.
  - [x] Bổ sung bộ 20 câu hỏi Đúng/Sai Sinh học 9 vào `src/content/kb/biology/true-false-statements.json` (bio-tf-68 $\to$ bio-tf-87).
  - [x] Bổ sung 3 generator toán sinh học 9 (Phép lai Mendel, Phân tử DNA/RNA, Phân bào & NST) vào `biologyGenerators.ts` và `PracticePage.tsx`.
  - [x] Mở rộng 3 visualizer chuyên sâu Sinh 9 trong `BiologyVisualizer.tsx` và `ExercisePage.tsx`: Bảng Punnett Mendel (`mendel-punnett-grid`), Lắp ghép phân tử DNA & Phiên mã (`dna-transcription-builder`), Kính hiển vi bắt kì phân bào (`mitosis-meiosis-scope`).
  - [x] Kích hoạt đầy đủ chọn khối Lớp 9 Sinh học trong `PracticePage.tsx` và tích hợp tìm kiếm toàn diện vào `searchEngine.ts`.
  - [x] Chạy `validate:content` xác thực toàn bộ 16 bài học Sinh học 9.
  - [x] Kiểm thử TypeScript `npx tsc -b --noEmit` (0 lỗi) và `npm test` toàn hệ thống đạt 100% PASS (13/13 test files, 109 unit tests).
  - [x] Nghiệm thu toàn diện lộ trình Sinh học 9 chuẩn SGK Kết nối tri thức.

---

## 7. Checklist Hoàn Thành Cho Mỗi Bài Học

- [x] `id` (nội bộ `bio-g9-bXX`) và `sgkBaiSo` (`36` $\to$ `51`) khớp tuyệt đối bảng mục 2.
- [x] `theory.json` đúng chuẩn Zod schema, chia nhỏ thành các thẻ `sections`, có `summary` và `keyTakeaways`, không viết lan man ngoài SGK.
- [x] `exercises.json` gồm 8–12 câu hỏi trắc nghiệm/tương tác, có lời giải thích chi tiết, `pitfalls`, gợi ý từng bước.
- [x] Thuật ngữ di truyền, cơ chế phân tử, tế bào học, tiến hóa bám sát 100% SGK Kết nối tri thức và VietJack.
- [x] Chạy `npx tsx scripts/validate-content.ts` vượt qua không có lỗi nào.
