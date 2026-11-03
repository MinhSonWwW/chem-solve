import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_excel():
    wb = openpyxl.Workbook()
    # Remove default sheet
    default_sheet = wb.active
    wb.remove(default_sheet)

    # 100% standard Arial font - universally supported across all Windows/Mac/Office/WPS versions
    font_name = "Arial"
    
    # ── Color Palette ──────────────────────────────────────────────────────────
    c_navy_header   = "1B365D"  # Deep Professional Navy
    c_blue_sub      = "2563EB"  # Bright Tech Blue
    c_card_bg       = "F0F7FF"  # Soft Ice Blue for KPI & info cards
    c_sign_bg       = "FEFCE8"  # Elegant Light Amber for Teacher Sign-off row
    c_sign_border   = "D97706"  # Amber border
    c_white         = "FFFFFF"
    c_zebra_even    = "F8FAFC"  # Very soft slate
    c_zebra_odd     = "FFFFFF"
    c_border_gray   = "CBD5E1"  # Clean slate border
    
    # Fills
    fill_header     = PatternFill(start_color=c_navy_header, end_color=c_navy_header, fill_type="solid")
    fill_sub_header = PatternFill(start_color=c_blue_sub, end_color=c_blue_sub, fill_type="solid")
    fill_card       = PatternFill(start_color=c_card_bg, end_color=c_card_bg, fill_type="solid")
    fill_sign       = PatternFill(start_color=c_sign_bg, end_color=c_sign_bg, fill_type="solid")
    fill_even       = PatternFill(start_color=c_zebra_even, end_color=c_zebra_even, fill_type="solid")
    fill_odd        = PatternFill(start_color=c_white, end_color=c_white, fill_type="solid")
    
    # Status Fills & Fonts
    fill_done       = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Soft Green
    font_done       = Font(name=font_name, size=10, bold=True, color="166534")
    
    fill_prog       = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Soft Yellow
    font_prog       = Font(name=font_name, size=10, bold=True, color="92400E")

    fill_plan       = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    font_plan       = Font(name=font_name, size=10, bold=True, color="475569")

    # Typography
    f_title         = Font(name=font_name, size=15, bold=True, color="1B365D")
    f_subtitle      = Font(name=font_name, size=10, italic=True, color="475569")
    f_sec_title     = Font(name=font_name, size=11, bold=True, color="1B365D")
    f_th            = Font(name=font_name, size=10.5, bold=True, color="FFFFFF")
    f_th_sub        = Font(name=font_name, size=10, bold=True, color="FFFFFF")
    f_text          = Font(name=font_name, size=10, color="0F172A")
    f_text_bold     = Font(name=font_name, size=10, bold=True, color="0F172A")
    f_code          = Font(name=font_name, size=10, bold=True, color="1B365D")
    f_sign_badge    = Font(name=font_name, size=10, bold=True, color="92400E")
    f_sign_text     = Font(name=font_name, size=9.5, color="78350F")
    f_kpi_num       = Font(name=font_name, size=16, bold=True, color="1B365D")
    f_kpi_lbl       = Font(name=font_name, size=9, bold=True, color="475569")

    # Borders
    border_thin     = Border(left=Side(style='thin', color=c_border_gray),
                             right=Side(style='thin', color=c_border_gray),
                             top=Side(style='thin', color=c_border_gray),
                             bottom=Side(style='thin', color=c_border_gray))
    
    border_header   = Border(left=Side(style='thin', color=c_white),
                             right=Side(style='thin', color=c_white),
                             top=Side(style='medium', color=c_navy_header),
                             bottom=Side(style='medium', color=c_navy_header))
    
    border_sign     = Border(left=Side(style='thin', color=c_sign_border),
                             right=Side(style='thin', color=c_sign_border),
                             top=Side(style='thin', color=c_sign_border),
                             bottom=Side(style='medium', color=c_sign_border))

    # Alignments
    al_center       = Alignment(horizontal='center', vertical='center', wrap_text=True)
    al_left         = Alignment(horizontal='left', vertical='center', wrap_text=True)
    al_right        = Alignment(horizontal='right', vertical='center')

    # =========================================================================
    # SHEET 1: NHẬT KÝ TIẾN ĐỘ THỰC HIỆN & KÝ DUYỆT (10/09/2026 - 27/10/2026)
    # =========================================================================
    ws1 = wb.create_sheet(title="1. Nhat Ky Tien Do (Ky Duyet)")
    ws1.views.sheetView[0].showGridLines = True

    # Header block
    ws1["A1"] = "NHẬT KÝ TIẾN ĐỘ THỰC HIỆN DỰ ÁN & LỊCH CẬP NHẬT CHỨC NĂNG HỌC TẬP"
    ws1["A1"].font = f_title
    ws1["A2"] = "Thời gian thực hiện: Từ 10/09/2026 đến 27/10/2026 (1,5 tháng) — Kèm dòng ký xác nhận của Giáo viên Hướng dẫn theo từng ngày"
    ws1["A2"].font = f_subtitle
    ws1.row_dimensions[1].height = 25
    ws1.row_dimensions[2].height = 18

    # Project Info Card
    ws1["A4"] = "THÔNG TIN ĐỀ TÀI & GIÁO VIÊN HƯỚNG DẪN"
    ws1["A4"].font = f_sec_title
    ws1.merge_cells("A4:H4")

    info_rows = [
        ("Tên đề tài / Dự án:", "STEM-Solve: Nền tảng Web luyện bài tập Khoa học Tự nhiên THCS", "Giáo viên hướng dẫn:", "GV. Tổ Khoa học Tự nhiên"),
        ("Học sinh thực hiện:", "Nhóm học sinh nghiên cứu đề tài Chem-Solve", "Phân môn áp dụng:", "Khoa học Tự nhiên (Hóa học, Sinh học, Vật lý)"),
        ("Khối lớp áp dụng:", "Lớp 6, Lớp 7, Lớp 8, Lớp 9 (Chương trình GDPT 2018)", "Thời gian thực hiện:", "10/09/2026 đến 27/10/2026 (1,5 tháng)"),
        ("Tổng số buổi cập nhật:", "22 buổi / ngày hoàn thiện tính năng", "Kết quả kiểm nghiệm:", "248/248 bài kiểm thử đạt xuất sắc (100%), 0 lỗi hệ thống"),
        ("Hình thức sản phẩm:", "Trang Web giáo dục tương tác, chạy mượt trên Điện thoại & Máy tính", "Đánh giá nghiệm thu:", "Hoàn thành toàn diện các chức năng theo kế hoạch đề ra")
    ]

    for i, r_data in enumerate(info_rows, start=5):
        ws1.row_dimensions[i].height = 22
        ws1.cell(row=i, column=1, value=r_data[0]).font = f_text_bold
        ws1.cell(row=i, column=2, value=r_data[1]).font = f_text
        ws1.cell(row=i, column=5, value=r_data[2]).font = f_text_bold
        ws1.cell(row=i, column=6, value=r_data[3]).font = f_text
        ws1.merge_cells(start_row=i, start_column=2, end_row=i, end_column=4)
        ws1.merge_cells(start_row=i, start_column=6, end_row=i, end_column=8)
        for col_idx in range(1, 9):
            ws1.cell(row=i, column=col_idx).fill = fill_card
            ws1.cell(row=i, column=col_idx).border = border_thin

    # KPI Summary Cards
    ws1["A11"] = "CHỈ SỐ TỔNG QUAN TIẾN ĐỘ THỰC HIỆN DỰ ÁN"
    ws1["A11"].font = f_sec_title

    kpis = [
        ("TỔNG SỐ CHỨC NĂNG", "74", 1, 2),
        ("ĐÃ HOÀN THÀNH", "67 (90.5%)", 3, 4),
        ("ĐANG PHÁT TRIỂN", "3", 5, 5),
        ("KẾ HOẠCH TƯƠNG LAI", "4", 6, 6),
        ("KIỂM NGHIỆM ĐẠT YÊU CẦU", "248 / 248 (100%)", 7, 8)
    ]

    ws1.row_dimensions[12].height = 18
    ws1.row_dimensions[13].height = 26

    for lbl, val, col_start, col_end in kpis:
        c_lbl = ws1.cell(row=12, column=col_start, value=lbl)
        c_lbl.font = f_kpi_lbl
        c_lbl.alignment = al_center
        c_lbl.fill = fill_card
        c_lbl.border = border_thin

        c_val = ws1.cell(row=13, column=col_start, value=val)
        c_val.font = f_kpi_num
        c_val.alignment = al_center
        c_val.fill = fill_card
        c_val.border = border_thin

        if col_end > col_start:
            ws1.merge_cells(start_row=12, start_column=col_start, end_row=12, end_column=col_end)
            ws1.merge_cells(start_row=13, start_column=col_start, end_row=13, end_column=col_end)
            for c_i in range(col_start, col_end + 1):
                ws1.cell(row=12, column=c_i).fill = fill_card
                ws1.cell(row=12, column=c_i).border = border_thin
                ws1.cell(row=13, column=c_i).fill = fill_card
                ws1.cell(row=13, column=c_i).border = border_thin

    # Table Header for Daily Log
    ws1["A15"] = "CHI TIẾT LỊCH CẬP NHẬT THEO NGÀY & DÒNG KÝ XÁC NHẬN CỦA GIÁO VIÊN HƯỚNG DẪN"
    ws1["A15"].font = f_sec_title

    headers_log = [
        "STT", "Ngày Cập Nhật", "Phân Môn", "Áp Dụng Khối Lớp", 
        "Tên Chức Năng Phát Triển", "Mô Tả Chi Tiết Nghiệp Vụ Sư Phạm", 
        "Kết Quả Kiểm Nghiệm & Vận Hành", "Trạng Thái"
    ]

    ws1.row_dimensions[16].height = 28
    for c_idx, h_text in enumerate(headers_log, start=1):
        cell = ws1.cell(row=16, column=c_idx, value=h_text)
        cell.font = f_th
        cell.fill = fill_header
        cell.alignment = al_center
        cell.border = border_header

    # 22 working days strictly between 10/09/2026 and 27/10/2026 (1.5 months)
    # Written in clear educational, non-coder language with explicit Subject and Grade.
    daily_schedule = [
        (1, "10/09/2026 (Thứ 5)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Nền tảng trang web học tập trực tuyến và hệ thống điều hướng toàn trang",
         "Xây dựng giao diện trang web học tập hiện đại, tốc độ tải nhanh, tích hợp đầy đủ 11 khu vực chức năng chính (Học bài, Luyện tập, Lý thuyết tóm tắt, Đấu trường trò chơi, Cửa hàng phần thưởng, Hồ sơ cá nhân, Bảng theo dõi tiến độ, Tra cứu kiến thức). Vận hành mượt mà trên cả điện thoại di động và máy tính bảng.",
         "Giao diện trực quan, chuyển đổi qua lại giữa các màn hình học tập dưới 0.3 giây; bố cục co giãn tự nhiên theo kích cỡ màn hình.", "Đã hoàn thành"),

        (2, "12/09/2026 (Thứ 7)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Quản lý hồ sơ học sinh và Tự động lưu tiến độ học tập ngoại tuyến",
         "Hệ thống tự động ghi nhớ toàn bộ tiến độ làm bài, số lượng Tim năng lượng, Đá quý tích lũy, Điểm kinh nghiệm (XP), Cấp độ học tập và Chuỗi ngày học liên tục. Dữ liệu được lưu an toàn trực tiếp trên thiết bị của học sinh mà không lo mất bài khi mất mạng; có tính năng xuất và nhập bản sao lưu dữ liệu cá nhân.",
         "Học sinh tắt trình duyệt hoặc mất kết nối mạng khi mở lại vẫn giữ nguyên 100% tiến độ học tập; tính năng sao lưu dữ liệu hoạt động chính xác.", "Đã hoàn thành"),

        (3, "15/09/2026 (Thứ 3)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Bộ nhận diện màu sắc theo phân môn và Chế độ bảo vệ thị lực ban đêm",
         "Thiết lập hệ thống màu sắc nhận diện đặc trưng cho từng phân môn: Hóa học mang màu Xanh lam năng động, Sinh học màu Xanh ngọc tươi mát, Vật lý màu Tím vũ trụ huyền bí. Tích hợp chế độ Giao diện tối giúp bảo vệ mắt học sinh khi học bài buổi tối và chế độ Giao diện sáng thanh nhã đạt chuẩn độ tương phản chống mỏi mắt.",
         "Chuyển đổi qua lại giữa chế độ Sáng/Tối tức thì, màu sắc các môn học phân biệt rõ ràng, chữ viết sắc nét, độ tương phản đạt chuẩn sư phạm.", "Đã hoàn thành"),

        (4, "17/09/2026 (Thứ 5)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Phím bấm học tập nổi 3D đa giác quan và Họa tiết minh họa trang vở",
         "Thiết kế các nút bấm chọn đáp án dạng khối nổi 3D, có hiệu ứng nảy cơ học như phím bấm vật lý thật khi học sinh chạm tay vào màn hình cảm ứng, tạo cảm giác xúc giác chân thực. Bổ sung các nét vẽ tay sinh động (mũi tên hướng dẫn, ngôi sao khen thưởng, gạch chân kiến thức) gần gũi với trang vở học tập.",
         "Thao tác bấm chạm cực kỳ êm ái, tạo hứng thú tương tác rõ rệt cho học sinh, loại bỏ hoàn toàn cảm giác khô khan của phần mềm thông thường.", "Đã hoàn thành"),

        (5, "19/09/2026 (Thứ 7)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Bộ biểu tượng dụng cụ khoa học vẽ tay độc quyền",
         "Xây dựng trọn bộ biểu tượng minh họa dụng cụ phòng thí nghiệm và biểu trưng khoa học vẽ tay tinh xảo: bình tam giác, ống nghiệm, mô hình nguyên tử, chuỗi xoắn kép DNA, bình năng lượng tim, khiên đóng băng, kính hiển vi, đèn cồn. Có lớp phản quang thủy tinh trong suốt tạo chiều sâu khoa học chân thực.",
         "Hình ảnh biểu tượng rõ ràng, sắc nét trên cả nền sáng và tối, giúp học sinh nhận diện trực quan các dụng cụ thí nghiệm phổ biến trong SGK.", "Đã hoàn thành"),

        (6, "22/09/2026 (Thứ 3)", "Hóa học & Vật lý", "Lớp 7, Lớp 8, Lớp 9",
         "Bàn phím ảo thông minh chuyên dụng nhập công thức Hóa học và ký hiệu Vật lý",
         "Giải quyết triệt để rào cản gõ công thức khoa học trên điện thoại: Bàn phím Hóa học tự động hạ số thành chỉ số dưới (học sinh gõ H2SO4 sẽ tự hiển thị H₂SO₄), có sẵn phím nhập mũi tên phản ứng, dấu bay hơi khí, kết tủa và điện tích ion. Bàn phím Vật lý tích hợp sẵn các ký hiệu đại lượng (v, s, t, P, F, A, d) và các đơn vị đo chuẩn (m/s, km/h, N, J, W, kg, Pa).",
         "Học sinh nhập công thức hóa học và ký hiệu vật lý nhanh gấp 3 lần so với bàn phím điện thoại thông thường; không còn lỗi gõ sai chỉ số dưới.", "Đã hoàn thành"),

        (7, "24/09/2026 (Thứ 5)", "Hóa học", "Lớp 7, Lớp 8, Lớp 9",
         "Bộ phân tích công thức phân tử, tính khối lượng mol và hiển thị hóa học chuẩn mực",
         "Hệ thống thông minh tự động đọc hiểu cấu trúc phân tử hóa học (kể cả công thức có dấu ngoặc như Al₂(SO₄)₃, muối ngậm nước CuSO₄·5H₂O), tự động tra cứu nguyên tử khối chuẩn SGK để tính khối lượng mol (M), đồng thời hiển thị công thức hóa học chuẩn mực, đẹp mắt kèm tính năng đọc to hỗ trợ học sinh khiếm thị.",
         "Tính toán khối lượng mol chính xác 100% theo chương trình SGK Kết nối tri thức; hiển thị công thức chuẩn quy cách sư phạm.", "Đã hoàn thành"),

        (8, "26/09/2026 (Thứ 7)", "Hóa học", "Lớp 8, Lớp 9",
         "Động cơ tự động kiểm tra cân bằng phương trình và chấm bài toán số học",
         "Hệ thống tự động kiểm tra số nguyên tử 2 vế của phương trình phản ứng, chỉ ra chính xác nguyên tố nào bị lệch số lượng để học sinh tự sửa. Thuật toán tự động kiểm tra xem hệ số cân bằng đã tối giản hay chưa (nhắc nhở nếu học sinh điền 2:4:2 thay vì 1:2:1). Chấm bài toán số học chấp nhận cả dấu phẩy và chấm thập phân, tự động bắt lỗi quên đổi đơn vị đo.",
         "Chấm bài chính xác tuyệt đối, đưa ra phản hồi gợi ý cụ thể ngay khi phương trình chưa cân bằng hoặc hệ số chưa tối giản.", "Đã hoàn thành"),

        (9, "29/09/2026 (Thứ 3)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Bộ công cụ chấm các dạng bài tập tương tác (Trắc nghiệm, Nối cặp, Xếp giỏ, Thứ tự)",
         "Đa dạng hóa hình thức kiểm tra đánh giá: Chấm trắc nghiệm 1 đáp án và nhiều đáp án (có tự động xáo trộn ngẫu nhiên vị trí chống học vẹt); chấm bài tập nối cặp khái niệm tương ứng; chấm bài tập kéo thả phân loại vào giỏ (chỉ ra vị trí xếp sai); chấm bài tập sắp xếp thứ tự các bước làm thí nghiệm; chấm câu trả lời văn bản thông minh (chấp nhận cả tiếng Việt có dấu và không dấu).",
         "Vận hành mượt mà cả 10 dạng bài tập tương tác, thao tác chạm hoặc kéo thả trên điện thoại rất nhạy và chuẩn xác.", "Đã hoàn thành"),

        (10, "01/10/2026 (Thứ 5)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Khung phương pháp sư phạm 7 bước giải bài và Chế độ hướng dẫn từng bước",
         "Chuẩn hóa quy trình tư duy giải bài tập khoa học theo 7 bước sư phạm bài bản: (1) Nhận dạng đề bài -> (2) Tóm tắt dữ kiện -> (3) Nhắc lại kiến thức lý thuyết -> (4) Biến đổi công thức -> (5) Thực hiện tính toán -> (6) Kết luận đáp án -> (7) Cảnh báo bẫy sai hay mắc. Tích hợp chế độ 'Hướng dẫn từng bước' cho học sinh trung bình và chế độ 'Giải nhanh' cho học sinh khá giỏi.",
         "Lời giải bài tập có cấu trúc sư phạm mạch lạc, giúp học sinh rèn luyện phương pháp tư duy logic có hệ thống, không làm tắt đoán mò.", "Đã hoàn thành"),

        (11, "03/10/2026 (Thứ 7)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Thang gợi ý sư phạm 4 nấc và Bảng nhận xét phân tích nguyên nhân sai sót",
         "Hệ thống hỗ trợ học tập tiến bộ: Khi gặp khó khăn, học sinh có thể mở gợi ý theo 4 cấp độ tăng dần: Cấp 1 (Gợi mở hướng suy nghĩ, không lộ số liệu) -> Cấp 2 (Nhắc lại công thức then chốt) -> Xem từng bước hướng dẫn -> Xem toàn bộ lời giải chi tiết. Khi nộp bài, Bảng nhận xét tự động phân loại Đúng (Xanh lá), Sai (Đỏ), Gần đúng (Vàng) kèm lời khuyên khích lệ tinh thần học sinh.",
         "Học sinh tự tin làm bài mà không sợ bị điểm kém; không tạo tâm lý chán nản; ngôn từ phản hồi tích cực, mang tính xây dựng.", "Đã hoàn thành"),

        (12, "06/10/2026 (Thứ 3)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Bản đồ hành trình học tập ziczac Duolingo và Sổ tay tóm tắt từng chương",
         "Thiết kế lộ trình học tập trực quan mô phỏng hành trình chinh phục dạng đường cong Duolingo theo từng khối lớp. Các nốt học tập phân biệt rõ: nốt đã hoàn thành (gắn sao vàng), nốt đang học (hiệu ứng hào quang phát sáng kèm linh vật cổ vũ), nốt bị khóa. Tích hợp Sổ tay kiến thức trọng tâm cho từng chương giúp học sinh mở xem nhanh bảng công thức và hiện tượng mẫu bất cứ lúc nào.",
         "Lộ trình học tập rõ ràng, kích thích tâm lý tò mò muốn mở khóa các chặng tiếp theo; học sinh dễ dàng theo dõi vị trí học tập của mình.", "Đã hoàn thành"),

        (13, "08/10/2026 (Thứ 5)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Hệ thống Năng lượng Tim, Ngọn lửa Streak và Cơ chế Thăng cấp độ",
         "Cơ chế trò chơi hóa (Gamification) tạo thói quen học tập đều đặn: Học sinh có 5 Tim năng lượng, làm sai sẽ mất 1 tim (tự động hồi phục sau 20 phút hoặc hồi miễn phí bằng cách vào phòng Luyện tập củng cố kiến thức). Ngọn lửa đèn cồn (Streak) bùng cháy khi duy trì việc học mỗi ngày. Điểm kinh nghiệm (XP) thưởng xứng đáng theo chất lượng bài làm, thăng cấp bậc khoa học từ 'Tập sự' đến 'Nhà bác học'.",
         "Học sinh có động lực duy trì chuỗi ngày vào ôn bài liên tục; cơ chế hồi tim thúc đẩy học sinh tự giác ôn lại bài đã làm sai.", "Đã hoàn thành"),

        (14, "10/10/2026 (Thứ 7)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Cửa hàng phần thưởng khoa học và Bảng thành tựu vinh danh",
         "Tích lũy Đá quý qua việc hoàn thành xuất sắc các chặng bài tập để đổi lấy các vật phẩm hỗ trợ thú vị trong Cửa hàng: Bình phục hồi năng lượng tim, Khiên băng bảo vệ chuỗi ngày học liên tục khi bận việc đột xuất, Bình nhân đôi kinh nghiệm (XP). Hệ thống vinh danh với hơn 20 danh hiệu khoa học hấp dẫn: 'Chiến binh Mol', 'Bác sĩ Nhóm máu', 'Thợ săn Động năng', 'Chuyên gia Cân bằng'...",
         "Tạo vòng tròn động lực tích cực; giao dịch đổi thưởng diễn ra tức thì, hình ảnh vật phẩm 3D lấp lánh cuốn hút.", "Đã hoàn thành"),

        (15, "13/10/2026 (Thứ 3)", "Sinh học & Hóa học", "Lớp 7, Lớp 8",
         "Nhóm Trò chơi tương tác thực hành (Cấp cứu truyền máu ABO, Cân bằng phản ứng, Ghép thẻ công thức)",
         "Xây dựng 3 trò chơi giáo dục thực hành chuyên sâu: (1) Trò chơi Cấp cứu truyền máu ABO (Sinh học 8): Học sinh vào vai bác sĩ cấp cứu, vận dụng quy tắc kháng nguyên - kháng thể để chọn đúng nhóm máu truyền cho bệnh nhân; (2) Trò chơi Cân bằng phản ứng (Hóa học 8): Rèn phản xạ cân bằng số nguyên tử 2 vế; (3) Trò chơi Ghép thẻ công thức: Kéo các mảnh kim loại và gốc acid ghép thành công thức phân tử đúng hóa trị.",
         "Học sinh học qua chơi hào hứng; hiểu sâu bản chất nguyên lý truyền máu an toàn và quy tắc hóa trị mà không cần học vẹt.", "Đã hoàn thành"),

        (16, "15/10/2026 (Thứ 5)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Nhóm Trò chơi rèn luyện phản xạ (Phân loại giỏ, Nối cặp, Đố vui Đúng/Sai, Thử thách tốc độ)",
         "Bổ sung 4 trò chơi củng cố kiến thức liên môn: (1) Trò chơi Phân loại vào giỏ: Kéo thả các chất và vật thể vào đúng nhóm (Acid/Base/Muối, Kim loại/Phi kim, Đơn bào/Đa bào); (2) Trò chơi Nối cặp: Nối chất với ứng dụng thực tế hoặc định luật với công thức; (3) Trò chơi Đố vui Đúng/Sai: Phản biện 10 ngộ nhận khoa học phổ biến; (4) Thử thách tốc độ: Trả lời nhanh 10 câu hỏi ngắn trong 45 giây.",
         "Đạt trọn vẹn 10/10 trò chơi khoa học tương tác; học sinh tham gia tích cực, cải thiện rõ rệt tốc độ phản xạ kiến thức.", "Đã hoàn thành"),

        (17, "17/10/2026 (Thứ 7)", "Đa môn KHTN (Hóa, Sinh, Lý)", "Toàn khối 6 - 9",
         "Xây dựng toàn bộ Ngân hàng dữ liệu bài tập KHTN 6-9 theo chương trình 2018",
         "Biên soạn và kiểm định ngân hàng bài tập phong phú bám sát SGK Kết nối tri thức: Phân môn Hóa học (21 bài học then chốt Lớp 7-9); Phân môn Sinh học (hơn 64 bài học Lớp 6-9 từ Tế bào, Cơ thể, Đa dạng sinh học đến Di truyền Mendel); Phân môn Vật lý (trọn bộ Lớp 6-9 từ Đo lường, Lực, Âm thanh, Ánh sáng đến Điện học và Thấu kính). 100% bài tập được phân loại theo ma trận mức độ nhận thức (Biết - Hiểu - Vận dụng).",
         "Dữ liệu bài tập chuẩn xác tuyệt đối, lời giải chi tiết, không trùng lặp, nội dung diễn đạt sư phạm chuẩn mực.", "Đã hoàn thành"),

        (18, "20/10/2026 (Thứ 3)", "Hóa học & Vật lý", "Lớp 7, Lớp 8, Lớp 9",
         "Thư viện Thẻ tóm tắt lý thuyết vi mô và Bộ thuật toán sinh đề bài vô tận",
         "Tích hợp thư viện Thẻ lý thuyết tóm tắt siêu nhanh (đọc nhanh trong 2 phút trước khi làm bài để nhớ công thức và hiện tượng cốt lõi). Đặc biệt phát triển Bộ thuật toán tự động sinh đề bài ngẫu nhiên: tự động thay đổi số liệu bài toán với các con số nghiệm chẵn đẹp (tính số mol, thể tích khí ở điều kiện chuẩn 24.79L, nồng độ dung dịch, vận tốc, áp suất, cơ năng), giúp học sinh luyện tập vô số lần mà không bao giờ bị trùng đề.",
         "Học sinh có thể làm đi làm lại dạng bài nhiều lần với đề bài mới mẻ liên tục; đáp án tự động tính toán chính xác tuyệt đối.", "Đã hoàn thành"),

        (19, "22/10/2026 (Thứ 5)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Thuật toán ôn tập lặp lại ngắt quãng thông minh và Công cụ tìm kiếm bài học",
         "Ứng dụng phương pháp ghi nhớ ngắt quãng khoa học (Spaced Repetition 5 hộp thời gian: 1 ngày, 2 ngày, 4 ngày, 7 ngày, 14 ngày): Câu nào làm sai sẽ được tự động nhắc lại ôn tập thường xuyên hơn, câu nào làm đúng vững vàng sẽ giãn cách thời gian ôn tập. Tự động nhận diện các 'Chủ đề còn yếu' (tỷ lệ đúng < 70%) để đề xuất bài luyện củng cố. Tích hợp thanh tìm kiếm thông minh hỗ trợ gõ không dấu.",
         "Tốc độ tìm kiếm tức thì dưới 0.02 giây; danh sách ôn tập cá nhân hóa chính xác theo năng lực riêng của từng học sinh, tránh quá tải.", "Đã hoàn thành"),

        (20, "24/10/2026 (Thứ 7)", "Đa môn KHTN (Hóa, Sinh, Lý)", "Toàn khối 6 - 9",
         "Hệ thống 3 Phòng Thí nghiệm Ảo tương tác trực quan (Virtual Labs)",
         "Xây dựng 3 phòng thí nghiệm ảo an toàn và chân thực: (1) Phòng Thí nghiệm Hóa học ảo: Học sinh tự tay kéo ống nhỏ giọt acid HCl vào kẽm Zn quan sát bọt khí H₂ sủi tăm bay lên, nhúng giấy quỳ tím vào dung dịch quan sát đổi màu đỏ/xanh; (2) Phòng Thí nghiệm Mạch điện Vật lý ảo: Tự lắp ghép nguồn pin, công tắc, bóng đèn, điện trở, bóng đèn tự sáng theo định luật Ohm hoặc đứt cầu chì nếu đoản mạch; (3) Kính hiển vi Sinh học ảo: Đặt tiêu bản tế bào vảy hành, xoay núm vi cấp lấy nét từ 10x đến 100x thấy rõ nhân tế bào.",
         "Học sinh được tự tay thao tác thực nghiệm trực quan sinh động như trong phòng thí nghiệm thực tế, an toàn 100% không lo cháy nổ hay hóa chất độc hại.", "Đã hoàn thành"),

        (21, "25/10/2026 (Chủ Nhật)", "Liên môn KHTN", "Toàn khối 6 - 9",
         "Trợ lý sư phạm chẩn đoán bẫy sai, Bộ 3 Linh vật đồng hành, Âm thanh & Rung xúc giác",
         "Tích hợp Trợ lý sư phạm tự động bắt trúng nguyên nhân sai điển hình (quên nhân hệ số phương trình, nhầm 22.4 lít cũ với 24.79 lít chuẩn mới, quên đổi đơn vị) và giải thích ngay lập tức. Ra mắt Bộ 3 linh vật đồng hành đáng yêu (Atom - Hóa học, Leafy - Sinh học, Proton - Vật lý) với 9 trạng thái cảm xúc khích lệ. Lồng tiếng động viên bằng tiếng Việt vui tươi kèm hiệu ứng rung phản hồi xúc giác nhẹ nhàng trên điện thoại.",
         "Tạo không khí học tập hào hứng, tràn đầy năng lượng tích cực; học sinh hiểu ngay nguyên nhân sai sót của mình để tiến bộ.", "Đã hoàn thành"),

        (22, "27/10/2026 (Thứ 3)", "Toàn hệ thống", "Toàn khối 6 - 9",
         "Hoàn thiện toàn diện giao diện người dùng, Tối ưu hóa trải nghiệm & Nghiệm thu tổng thể",
         "Tinh chỉnh thẩm mỹ toàn diện: chuẩn hóa màu sắc tương phản trên cả 2 giao diện Sáng và Tối, tăng độ sắc nét cho hệ thống biểu tượng dụng cụ khoa học, bổ sung nút Hướng dẫn nhanh tại các màn hình bài tập. Hoàn tất kiểm thử tự động toàn bộ 248/248 bài kiểm thử đạt kết quả xuất sắc 100%, sẵn sàng bàn giao vận hành thực tế phục vụ học sinh và giáo viên.",
         "Toàn bộ hệ thống chạy ổn định 100%, không phát sinh lỗi, giao diện thân thiện, dễ sử dụng cho học sinh từ Lớp 6 đến Lớp 9; nghiệm thu thành công trọn vẹn.", "Đã hoàn thành")
    ]

    curr_row = 17
    for item in daily_schedule:
        stt, date_str, subject_str, grade_str, feature_str, detail_str, test_str, status_str = item

        # Calculate generous row height to completely prevent text clipping / overlapping
        max_chars = max(len(feature_str), len(detail_str) // 3, len(test_str) // 2)
        row_h = 42 if max_chars < 50 else (52 if max_chars < 80 else 66)
        ws1.row_dimensions[curr_row].height = row_h

        fill_row = fill_even if stt % 2 == 0 else fill_odd

        ws1.cell(row=curr_row, column=1, value=stt).alignment = al_center
        ws1.cell(row=curr_row, column=1).font = f_text_bold

        ws1.cell(row=curr_row, column=2, value=date_str).alignment = al_center
        ws1.cell(row=curr_row, column=2).font = f_text_bold

        ws1.cell(row=curr_row, column=3, value=subject_str).alignment = al_center
        ws1.cell(row=curr_row, column=3).font = f_text_bold

        ws1.cell(row=curr_row, column=4, value=grade_str).alignment = al_center
        ws1.cell(row=curr_row, column=4).font = f_text_bold

        ws1.cell(row=curr_row, column=5, value=feature_str).alignment = al_left
        ws1.cell(row=curr_row, column=5).font = f_text_bold

        ws1.cell(row=curr_row, column=6, value=detail_str).alignment = al_left
        ws1.cell(row=curr_row, column=6).font = f_text

        ws1.cell(row=curr_row, column=7, value=test_str).alignment = al_left
        ws1.cell(row=curr_row, column=7).font = f_text

        # Status
        c_status = ws1.cell(row=curr_row, column=8, value=status_str)
        c_status.alignment = al_center
        c_status.fill = fill_done
        c_status.font = font_done

        for c_idx in range(1, 9):
            if c_idx != 8:
                ws1.cell(row=curr_row, column=c_idx).fill = fill_row
            ws1.cell(row=curr_row, column=c_idx).border = border_thin

        curr_row += 1

        # ── DÒNG KÝ XÁC NHẬN CỦA GIÁO VIÊN HƯỚNG DẪN SAU MỖI NGÀY ──
        ws1.row_dimensions[curr_row].height = 34

        sign_text = (
            f"[ KÝ DUYỆT CỦA GIÁO VIÊN HƯỚNG DẪN - {date_str} ]:      "
            f"[ ✓ ] Đã kiểm tra & Đạt yêu cầu          "
            f"Chữ ký GVHD: ....................................................          "
            f"Ý kiến / Nhận xét của Giáo viên: ...................................................."
        )

        c_sign = ws1.cell(row=curr_row, column=1, value="GVHD")
        c_sign.font = f_sign_badge
        c_sign.alignment = al_center

        c_sign_content = ws1.cell(row=curr_row, column=2, value=sign_text)
        c_sign_content.font = f_sign_text
        c_sign_content.alignment = al_left

        ws1.merge_cells(start_row=curr_row, start_column=2, end_row=curr_row, end_column=8)

        for c_idx in range(1, 9):
            ws1.cell(row=curr_row, column=c_idx).fill = fill_sign
            ws1.cell(row=curr_row, column=c_idx).border = border_sign

        curr_row += 1

    # Auto-adjust column widths for Sheet 1
    col_widths_s1 = [7, 20, 18, 18, 36, 58, 44, 18]
    for i, w in enumerate(col_widths_s1, start=1):
        ws1.column_dimensions[get_column_letter(i)].width = w


    # =========================================================================
    # SHEET 2: CHI TIẾT 74 CHỨC NĂNG HỆ THỐNG (BACKLOG SƯ PHẠM TOÀN DIỆN)
    # =========================================================================
    ws2 = wb.create_sheet(title="2. Chi Tiet 74 Chuc Nang")
    ws2.views.sheetView[0].showGridLines = True

    ws2["A1"] = "DANH SÁCH CHI TIẾT 74 CHỨC NĂNG HỆ THỐNG HỌC TẬP STEM-SOLVE"
    ws2["A1"].font = f_title
    ws2["A2"] = "Phân chia rõ ràng theo Phân môn, Khối lớp áp dụng, Mục đích sư phạm và Kết quả kiểm nghiệm thực tế (10/09/2026 - 27/10/2026)"
    ws2["A2"].font = f_subtitle
    ws2.row_dimensions[1].height = 25
    ws2.row_dimensions[2].height = 18

    headers_f = [
        "STT", "Mã Chức Năng", "Phân Môn", "Áp Dụng Khối Lớp", 
        "Nhóm Chức Năng", "Tên Chức Năng", "Mục Đích & Nghiệp Vụ Sư Phạm Chi Tiết", 
        "Ngày Bắt Đầu", "Ngày Hoàn Thành", "Mức Độ Ưu Tiên", "Trạng Thái", "Đánh Giá & Vận Hành Thực Tế"
    ]

    ws2.row_dimensions[4].height = 28
    for c_idx, h_text in enumerate(headers_f, start=1):
        cell = ws2.cell(row=4, column=c_idx, value=h_text)
        cell.font = f_th
        cell.fill = fill_header
        cell.alignment = al_center
        cell.border = border_header

    # Load 74 authentic pedagogical features (no raw code functions or dev jargon)
    features_all = [
        # Nhóm 1: Hạ tầng & Quản lý học tập (HT)
        (1, "HT-01", "Toàn hệ thống", "Toàn khối 6 - 9", "Hạ tầng & Quản lý học tập",
         "Khởi tạo nền tảng trang web học tập trực tuyến hiện đại",
         "Xây dựng kiến trúc trang web giáo dục tải nhanh, vận hành ổn định, giao diện tối ưu hóa cho học tập trực quan.",
         "10/09/2026", "11/09/2026", "Bắt buộc", "Đã hoàn thành", "Thời gian khởi chạy dưới 0.3 giây; hoạt động mượt mà."),

        (2, "HT-02", "Toàn hệ thống", "Toàn khối 6 - 9", "Hạ tầng & Quản lý học tập",
         "Hệ thống điều hướng 11 khu vực chức năng học tập",
         "Điều hướng học sinh đến đúng các khu vực: Trang chủ, Lộ trình học bài, Đấu trường luyện tập, Thư viện lý thuyết, Cửa hàng phần thưởng, Hồ sơ cá nhân, Theo dõi tiến độ, Tra cứu nhanh.",
         "10/09/2026", "11/09/2026", "Bắt buộc", "Đã hoàn thành", "Chuyển trang tức thì, không bị giật lag hay tải lại trang."),

        (3, "HT-03", "Toàn hệ thống", "Toàn khối 6 - 9", "Hạ tầng & Quản lý học tập",
         "Hệ thống quản lý tài khoản và thông tin học sinh",
         "Quản lý thông tin hồ sơ: số Tim năng lượng, Đá quý tích lũy, Chuỗi ngày học liên tục, Điểm kinh nghiệm, Cấp độ và cài đặt âm thanh.",
         "12/09/2026", "13/09/2026", "Bắt buộc", "Đã hoàn thành", "Cập nhật số liệu điểm số và năng lượng theo thời gian thực."),

        (4, "HT-04", "Toàn hệ thống", "Toàn khối 6 - 9", "Hạ tầng & Quản lý học tập",
         "Lưu trữ tiến độ học tập ngoại tuyến tự động",
         "Tự động lưu toàn bộ kết quả học tập ngay trên thiết bị; học sinh tiếp tục học bình thường khi mất kết nối mạng Internet.",
         "12/09/2026", "13/09/2026", "Bắt buộc", "Đã hoàn thành", "Dữ liệu được bảo toàn tuyệt đối, không sợ bị mất tiến độ."),

        (5, "HT-05", "Toàn hệ thống", "Toàn khối 6 - 9", "Hạ tầng & Quản lý học tập",
         "Sao lưu và phục hồi dữ liệu học tập cá nhân",
         "Cho phép học sinh xuất dữ liệu học tập ra tệp an toàn và nạp lại khi chuyển đổi sang máy tính hoặc điện thoại khác.",
         "08/10/2026", "09/10/2026", "Bắt buộc", "Đã hoàn thành", "Kiểm tra tính toàn vẹn của tệp sao lưu, chống lỗi dữ liệu."),

        (6, "HT-06", "Toàn hệ thống", "Toàn khối 6 - 9", "Hạ tầng & Quản lý học tập",
         "Tối ưu hóa giao diện chuyên biệt cho màn hình điện thoại di động",
         "Thiết kế vùng chạm ngón tay vừa vặn, không bị che khuất bởi thanh công cụ trình duyệt, đảm bảo học sinh thao tác bằng một tay dễ dàng.",
         "11/09/2026", "12/09/2026", "Bắt buộc", "Đã hoàn thành", "Hiển thị chuẩn mực trên mọi dòng điện thoại phổ biến."),

        # Nhóm 2: Giao diện Đa giác quan & Phím khoa học (GD)
        (7, "GD-01", "Toàn hệ thống", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Hệ thống màu sắc nhận diện trực quan theo phân môn",
         "Quy chuẩn màu sắc đặc trưng: Hóa học xanh lam, Sinh học xanh ngọc, Vật lý tím đậm; giúp học sinh nhận biết phân môn ngay lập tức.",
         "14/09/2026", "15/09/2026", "Bắt buộc", "Đã hoàn thành", "Đạt chuẩn quốc tế về độ tương phản chữ và nền chống mỏi mắt."),

        (8, "GD-02", "Toàn hệ thống", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Chế độ hiển thị kép: Giao diện sáng thanh nhã & Giao diện tối bảo vệ mắt",
         "Cung cấp 2 chế độ hiển thị phù hợp cho cả học tập ban ngày trong lớp học và học tập ban đêm ở nhà.",
         "15/09/2026", "16/09/2026", "Bắt buộc", "Đã hoàn thành", "Chuyển chế độ nhanh chóng chỉ với một chạm."),

        (9, "GD-03", "Toàn hệ thống", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Phím bấm nổi 3D đa giác quan mô phỏng cơ học",
         "Nút bấm có độ nảy vật lý và độ lún cơ học khi nhấn, tạo cảm giác phản hồi xúc giác như đang bấm phím thật.",
         "16/09/2026", "17/09/2026", "Bắt buộc", "Đã hoàn thành", "Tăng cảm giác kích thích tương tác cho học sinh."),

        (10, "GD-04", "Liên môn KHTN", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Bộ biểu tượng dụng cụ thí nghiệm vẽ tay độc quyền",
         "10 biểu tượng dụng cụ khoa học vẽ tay tinh xảo (bình tam giác, ống nghiệm, kính hiển vi, đèn cồn...) có vệt phản quang trong suốt.",
         "18/09/2026", "19/09/2026", "Bắt buộc", "Đã hoàn thành", "Hình ảnh thẩm mỹ, khơi gợi niềm yêu thích nghiên cứu."),

        (11, "GD-05", "Liên môn KHTN", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Họa tiết trang trí minh họa nét vẽ tay gần gũi",
         "Các nét vẽ doodle sinh động: mũi tên chỉ đường, ngôi sao khen thưởng, gạch sóng chân trang tạo cảm giác như trang vở học sinh.",
         "18/09/2026", "19/09/2026", "Bắt buộc", "Đã hoàn thành", "Giao diện sinh động, thân thiện với lứa tuổi học sinh THCS."),

        (12, "GD-06", "Hóa học", "Lớp 7, Lớp 8, Lớp 9", "Giao diện & Phím khoa học",
         "Bàn phím ảo Hóa học chuyên dụng gõ công thức trên di động",
         "Bàn phím gõ nhanh nguyên tố, tự động chuyển số thành chỉ số dưới, có sẵn dấu mũi tên, kết tủa, bay hơi và điện tích.",
         "21/09/2026", "22/09/2026", "Bắt buộc", "Đã hoàn thành", "Giải quyết hoàn toàn việc học sinh không biết gõ chỉ số dưới."),

        (13, "GD-07", "Vật lý", "Lớp 6, Lớp 7, Lớp 8, Lớp 9", "Giao diện & Phím khoa học",
         "Bàn phím ảo Vật lý chuyên dụng nhập đại lượng và đơn vị đo chuẩn",
         "Bàn phím nhập nhanh các ký hiệu vật lý (v, s, t, P, F, A, d) và các đơn vị đo lường (m/s, km/h, N, J, W, kg, Pa).",
         "21/09/2026", "22/09/2026", "Bắt buộc", "Đã hoàn thành", "Học sinh nhập bài tập tính toán vật lý chuẩn xác, nhanh chóng."),

        (14, "GD-08", "Liên môn KHTN", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Bộ 3 Linh vật biểu cảm Atom, Leafy, Proton đồng hành",
         "Linh vật đại diện cho 3 phân môn với 9 trạng thái cảm xúc (chào đón, suy nghĩ, mừng rỡ khi đúng, động viên khi sai...).",
         "24/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Tạo sự gắn kết tình cảm, cổ vũ học sinh kiên trì học tập."),

        (15, "GD-09", "Đa môn KHTN", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Bộ 3 Cúp Vinh danh 3D lấp lánh theo phân môn",
         "Cúp Bình Alembic Hoàng Kim (Hóa), Cúp Mầm Cây ADN (Sinh), Cúp Lõi Năng Lượng (Lý) trao thưởng khi hoàn thành chặng học.",
         "24/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Kích thích niềm tự hào và khát khao chinh phục kiến thức."),

        (16, "GD-10", "Liên môn KHTN", "Toàn khối 6 - 9", "Giao diện & Phím khoa học",
         "Bảng trượt nhận xét kết quả sư phạm tức thì",
         "Bảng trượt thông báo kết quả: Xanh (Đúng), Đỏ (Sai), Vàng (Gần đúng) kèm lời giải thích ân cần và mascot biểu cảm.",
         "02/10/2026", "03/10/2026", "Bắt buộc", "Đã hoàn thành", "Thông tin rõ ràng, hỗ trợ cả tính năng đọc cho học sinh khiếm thị."),

        # Nhóm 3: Động cơ Xử lý Khoa học (XL)
        (17, "XL-01", "Hóa học", "Lớp 7, Lớp 8, Lớp 9", "Động cơ Xử lý Khoa học",
         "Thuật toán phân tích cú pháp công thức hóa học tự động",
         "Tự động nhận diện thành phần nguyên tố và số lượng nguyên tử trong mọi công thức phức tạp, muối ngậm nước, nhóm nguyên tử.",
         "23/09/2026", "24/09/2026", "Bắt buộc", "Đã hoàn thành", "Xử lý chính xác 100% các công thức hóa học THCS."),

        (18, "XL-02", "Hóa học", "Lớp 7, Lớp 8, Lớp 9", "Động cơ Xử lý Khoa học",
         "Bộ tính toán khối lượng mol phân tử tự động theo SGK 2018",
         "Tính khối lượng mol tự động từ nguyên tử khối chuẩn mực trong SGK Kết nối tri thức, khóa chặt hằng số khoa học.",
         "23/09/2026", "24/09/2026", "Bắt buộc", "Đã hoàn thành", "Không bao giờ xảy ra sai lệch số liệu nguyên tử khối."),

        (19, "XL-03", "Hóa học", "Lớp 8, Lớp 9", "Động cơ Xử lý Khoa học",
         "Thuật toán kiểm tra cân bằng phương trình hóa học tự động",
         "Phân tích số nguyên tử của từng nguyên tố trước và sau phản ứng, chỉ ra nguyên tố bị chênh lệch giúp học sinh tự sửa.",
         "24/09/2026", "25/09/2026", "Bắt buộc", "Đã hoàn thành", "Hỗ trợ học sinh luyện kỹ năng cân bằng phương trình cực nhanh."),

        (20, "XL-04", "Liên môn KHTN", "Toàn khối 6 - 9", "Động cơ Xử lý Khoa học",
         "Trình hiển thị công thức khoa học chuẩn mực quốc tế",
         "Hiển thị công thức khoa học với chỉ số trên, chỉ số dưới chuẩn mực, đẹp mắt, có kèm nhãn đọc cho trợ năng màn hình.",
         "24/09/2026", "25/09/2026", "Bắt buộc", "Đã hoàn thành", "Quy cách hiển thị đồng nhất toàn bộ hệ thống."),

        # Nhóm 4: Hệ thống Chấm bài Tự động (CB)
        (21, "CB-01", "Hóa học & Vật lý", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm bài tập số học và phát hiện bẫy tính toán",
         "Chấp nhận cả dấu chấm và phẩy, kiểm tra đơn vị đo lường, cho phép sai số làm tròn hợp lý, bắt lỗi bấm nhầm số liệu.",
         "25/09/2026", "26/09/2026", "Bắt buộc", "Đã hoàn thành", "Sai đơn vị đo chỉ nhắc nhở sửa đổi, không trừ tim oan uổng."),

        (22, "CB-02", "Hóa học", "Lớp 7, Lớp 8, Lớp 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm công thức hóa học thông minh",
         "So sánh cấu trúc phân tử thực chất, phát hiện và nhắc nhở học sinh viết ngược quy ước (như OH₂ thay vì H₂O).",
         "25/09/2026", "26/09/2026", "Bắt buộc", "Đã hoàn thành", "Phân biệt chính xác chữ hoa, chữ thường trong ký hiệu nguyên tố."),

        (23, "CB-03", "Hóa học", "Lớp 8, Lớp 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm phương trình hóa học và kiểm tra hệ số tối giản",
         "Kiểm tra điền hệ số và sắp xếp thẻ chất; nhắc học sinh tối giản hệ số nếu điền tỷ lệ chưa tối giản.",
         "26/09/2026", "26/09/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện tính cẩn thận và thói quen tối giản phương trình."),

        (24, "CB-04", "Liên môn KHTN", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm trắc nghiệm khách quan chống học vẹt",
         "Chấm trắc nghiệm 1 đáp án hoặc nhiều đáp án; tự động xáo trộn ngẫu nhiên vị trí các phương án mỗi lần làm lại.",
         "28/09/2026", "29/09/2026", "Bắt buộc", "Đã hoàn thành", "Học sinh hiểu bản chất kiến thức chứ không thể học vẹt vị trí A/B/C/D."),

        (25, "CB-05", "Liên môn KHTN", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm bài tập nhận định Đúng / Sai",
         "Đánh giá từng nhận định khoa học độc lập; đổi màu trực quan và hiển thị lời giải thích chi tiết cho từng ý.",
         "28/09/2026", "29/09/2026", "Bắt buộc", "Đã hoàn thành", "Giúp học sinh rèn luyện tư duy phản biện khoa học sắc bén."),

        (26, "CB-06", "Liên môn KHTN", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm bài tập Nối cặp khái niệm và Kéo thả phân loại vào giỏ",
         "Chấm bài nối cặp và kéo thả phân loại; hỗ trợ cả thao tác chạm để chọn vị trí dành riêng cho học sinh dùng điện thoại.",
         "29/09/2026", "29/09/2026", "Bắt buộc", "Đã hoàn thành", "Báo đỏ vị trí đặt sai và cho phép hoàn tác nhanh chóng."),

        (27, "CB-07", "Liên môn KHTN", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm bài tập sắp xếp thứ tự các bước thực nghiệm",
         "Chấm thao tác sắp xếp trình tự thí nghiệm hoặc các bước giải bài; chấp nhận các bước hoán đổi tương đương hợp lý.",
         "29/09/2026", "30/09/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện kỹ năng tuân thủ quy trình an toàn thí nghiệm."),

        (28, "CB-08", "Liên môn KHTN", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Bộ chấm câu trả lời văn bản linh hoạt",
         "Chấm tên chất hoặc thuật ngữ khoa học; nhận diện thông minh cả tiếng Việt có dấu và không dấu, không phân biệt hoa thường.",
         "29/09/2026", "30/09/2026", "Bắt buộc", "Đã hoàn thành", "Chấp nhận danh sách từ đồng nghĩa và tên IUPAC chuẩn SGK."),

        (29, "CB-09", "Hóa học", "Lớp 7, Lớp 8", "Hệ thống Chấm bài Tự động",
         "Bộ chấm bài tập ghép mảnh công thức phân tử",
         "Chấm việc ghép mảnh kim loại và gốc acid sao cho đúng hóa trị và cân bằng điện tích âm dương.",
         "30/09/2026", "30/09/2026", "Bắt buộc", "Đã hoàn thành", "Giúp học sinh ghi nhớ hóa trị một cách tự nhiên qua hình ảnh."),

        (30, "CB-10", "Liên môn KHTN", "Toàn khối 6 - 9", "Hệ thống Chấm bài Tự động",
         "Quy trình quản lý trạng thái phiên làm bài chuẩn mực",
         "Khóa nút chống bấm đúp nộp bài nhiều lần; quản lý tuần tự trạng thái: Chưa làm -> Đang làm -> Kiểm tra -> Hoàn thành.",
         "30/09/2026", "01/10/2026", "Bắt buộc", "Đã hoàn thành", "Hệ thống vận hành trơn tru, không phát sinh lỗi bấm nhầm."),

        # Nhóm 5: Phương pháp Sư phạm & Khung 7 bước (SP)
        (31, "SP-01", "Liên môn KHTN", "Toàn khối 6 - 9", "Phương pháp Sư phạm",
         "Khung phương pháp sư phạm 7 bước giải bài tập chuẩn hóa",
         "Quy trình bài bản: Nhận dạng -> Tóm tắt dữ kiện -> Nhắc lý thuyết -> Biến đổi -> Tính toán -> Đáp án -> Cảnh báo bẫy sai.",
         "01/10/2026", "02/10/2026", "Bắt buộc", "Đã hoàn thành", "100% bài tập có cấu trúc lời giải mạch lạc, dễ hiểu."),

        (32, "SP-02", "Hóa học & Vật lý", "Lớp 8, Lớp 9", "Phương pháp Sư phạm",
         "Chế độ Hướng dẫn từng bước sư phạm dành cho bài tập khó",
         "Học sinh tự thực hiện từng bước nhỏ: chọn dạng bài -> tách số liệu -> chọn công thức -> tính toán từng bước có kiểm soát.",
         "01/10/2026", "02/10/2026", "Bắt buộc", "Đã hoàn thành", "Học sinh trung bình vẫn có thể tự tin hoàn thành bài tập nâng cao."),

        (33, "SP-03", "Liên môn KHTN", "Toàn khối 6 - 9", "Phương pháp Sư phạm",
         "Chế độ Giải nhanh tối ưu cho việc ôn luyện thi",
         "Học sinh nhập trực tiếp kết quả vào ô đáp án; có sẵn thang hỗ trợ gợi ý khi gặp câu khó, tiết kiệm thời gian.",
         "02/10/2026", "03/10/2026", "Bắt buộc", "Đã hoàn thành", "Tối ưu hóa tốc độ luyện tập cho học sinh khá giỏi."),

        (34, "SP-04", "Liên môn KHTN", "Toàn khối 6 - 9", "Phương pháp Sư phạm",
         "Thang hỗ trợ gợi ý 4 cấp độ sư phạm tiến bộ",
         "Cấp 1: Gợi ý định hướng suy nghĩ -> Cấp 2: Nhắc lại công thức then chốt -> Xem bước biến đổi -> Xem toàn bộ lời giải.",
         "02/10/2026", "03/10/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện tinh thần tự lập, chỉ dùng gợi ý khi thực sự cần thiết."),

        (35, "SP-05", "Liên môn KHTN", "Toàn khối 6 - 9", "Phương pháp Sư phạm",
         "Hệ thống chẩn đoán và cảnh báo bẫy sai thường gặp",
         "Tự động nhận diện nguyên nhân sai điển hình (nhầm 22.4L với 24.79L, quên nhân hệ số, quên đổi đơn vị) và giải thích ngay tức thì.",
         "24/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Giúp học sinh khắc sâu kiến thức, không bao giờ lặp lại lỗi cũ."),

        # Nhóm 6: Ngân hàng Bài tập & Thuật toán Sinh đề (CT)
        (36, "CT-01", "Hóa học", "Lớp 7, Lớp 8, Lớp 9", "Ngân hàng Bài tập & Sinh đề",
         "Ngân hàng bài tập Hóa học toàn diện 21 bài học then chốt",
         "Trọn bộ các bài học: Nguyên tử, Bảng tuần hoàn, Phản ứng, Mol, Dung dịch, Acid, Base, Oxide, Muối, Kim loại, Hydrocarbon...",
         "16/10/2026", "17/10/2026", "Bắt buộc", "Đã hoàn thành", "Bài tập phân dạng rõ ràng, bám sát cấu trúc SGK mới."),

        (37, "CT-02", "Sinh học", "Toàn khối 6 - 9", "Ngân hàng Bài tập & Sinh đề",
         "Ngân hàng bài tập Sinh học toàn diện hơn 64 bài học",
         "Bao quát đầy đủ: Tế bào, Cơ thể sống, Đa dạng sinh học, Trao đổi chất, Cơ thể người, Hệ tuần hoàn, Di truyền Mendel, DNA...",
         "16/10/2026", "17/10/2026", "Bắt buộc", "Đã hoàn thành", "Có hình vẽ sơ đồ tế bào, di truyền và nhóm máu trực quan."),

        (38, "CT-03", "Vật lý", "Toàn khối 6 - 9", "Ngân hàng Bài tập & Sinh đề",
         "Ngân hàng bài tập Vật lý toàn diện trọn bộ 4 khối lớp",
         "Bao quát toàn diện: Đo lường, Lực & Năng lượng, Tốc độ, Âm thanh, Ánh sáng, Áp suất, Mạch điện, Định luật Ohm, Thấu kính...",
         "17/10/2026", "18/10/2026", "Bắt buộc", "Đã hoàn thành", "Tích hợp công thức vật lý, hằng số chuẩn và bài toán thực tế đời sống."),

        (39, "CT-04", "Liên môn KHTN", "Toàn khối 6 - 9", "Ngân hàng Bài tập & Sinh đề",
         "Thư viện Thẻ tóm tắt lý thuyết vi mô đọc nhanh trong 2 phút",
         "Thẻ lý thuyết tóm tắt siêu ngắn gọn trước khi vào làm bài: bảng công thức, hiện tượng mẫu, mẹo ghi nhớ, lỗi thường gặp.",
         "19/10/2026", "20/10/2026", "Bắt buộc", "Đã hoàn thành", "Giúp học sinh ôn nhanh kiến thức cốt lõi trước khi giải bài tập."),

        (40, "CT-05", "Hóa học & Vật lý", "Lớp 7, Lớp 8, Lớp 9", "Ngân hàng Bài tập & Sinh đề",
         "Bộ thuật toán tự động sinh đề bài ngẫu nhiên vô tận",
         "Tự động thay đổi số liệu bài toán với nghiệm chẵn đẹp: bài toán mol, thể tích khí 24.79L, nồng độ %, vận tốc, áp suất, cơ năng.",
         "19/10/2026", "20/10/2026", "Bắt buộc", "Đã hoàn thành", "Học sinh luyện tập không bao giờ trùng đề; đáp án do hệ thống tự tính."),

        (41, "CT-06", "Liên môn KHTN", "Toàn khối 6 - 9", "Ngân hàng Bài tập & Sinh đề",
         "Quy trình tự động kiểm định chất lượng nội dung bài tập",
         "Hệ thống kiểm tra tính đúng đắn khoa học: phương trình tự cân bằng, hằng số chuẩn SGK, lời giải không bị thiếu bước.",
         "20/10/2026", "21/10/2026", "Bắt buộc", "Đã hoàn thành", "Đảm bảo 100% dữ liệu bài tập trong sạch, chuẩn mực sư phạm."),

        # Nhóm 7: Lộ trình Học tập & Bản đồ Hành trình (LT)
        (42, "LT-01", "Liên môn KHTN", "Toàn khối 6 - 9", "Lộ trình & Bản đồ",
         "Bản đồ hành trình học tập ziczac Duolingo theo khối lớp",
         "Bản đồ học tập hình đường cong uốn lượn; phân biệt nốt hoàn thành (sao vàng), nốt đang học (hào quang tỏa sáng), nốt khóa.",
         "05/10/2026", "06/10/2026", "Bắt buộc", "Đã hoàn thành", "Linh vật mascot đứng trên nốt đang học cổ vũ học sinh."),

        (43, "LT-02", "Liên môn KHTN", "Toàn khối 6 - 9", "Lộ trình & Bản đồ",
         "Phân loại các trạm nốt học tập đa dạng trên hành trình",
         "Trạm bài tập thực hành, trạm lý thuyết vi mô, trạm rương kho báu thưởng đá quý, trạm ôn tập củng cố định kỳ.",
         "05/10/2026", "06/10/2026", "Bắt buộc", "Đã hoàn thành", "Mở khóa chặng tiếp theo khi chặng trước đạt từ 70% điểm trở lên."),

        (44, "LT-03", "Liên môn KHTN", "Toàn khối 6 - 9", "Lộ trình & Bản đồ",
         "Ngăn kéo thông tin nốt học tập trượt từ đáy màn hình",
         "Bảng thông tin trượt nhẹ nhàng hiển thị tiêu đề bài học, số sao đã đạt được, tỷ lệ chính xác cao nhất và nút Bắt đầu.",
         "06/10/2026", "07/10/2026", "Bắt buộc", "Đã hoàn thành", "Học sinh nắm rõ thông tin trước khi quyết định vào bài học."),

        (45, "LT-04", "Liên môn KHTN", "Toàn khối 6 - 9", "Lộ trình & Bản đồ",
         "Sổ tay tóm tắt kiến thức trọng tâm từng chương",
         "Hộp thoại mở nhanh tổng hợp kiến thức cốt lõi của chương: bảng công thức, hiện tượng đặc trưng, phản ứng tiêu biểu.",
         "06/10/2026", "07/10/2026", "Bắt buộc", "Đã hoàn thành", "Học sinh có thể mở tra cứu nhanh bất cứ lúc nào trên lộ trình."),

        (46, "LT-05", "Liên môn KHTN", "Toàn khối 6 - 9", "Lộ trình & Bản đồ",
         "Hộp thoại chuyển đổi nhanh giữa 3 phân môn Hóa - Sinh - Lý",
         "Cho phép chuyển đổi linh hoạt giữa các phân môn kèm biểu tượng vẽ tay và tự động đồng bộ màu sắc nhận diện toàn trang.",
         "07/10/2026", "08/10/2026", "Bắt buộc", "Đã hoàn thành", "Thao tác chuyển đổi môn học cực kỳ thuận tiện và nhanh chóng."),

        # Nhóm 8: Gamification & Động lực Học tập (GM)
        (47, "GM-01", "Toàn hệ thống", "Toàn khối 6 - 9", "Gamification & Động lực",
         "Cơ chế quản lý năng lượng Tim học tập thông minh",
         "Tối đa 5 tim; làm sai trừ 1 tim (sai nhỏ không trừ); tự động hồi 1 tim mỗi 20 phút; hết tim vào phòng Luyện tập hồi tim miễn phí.",
         "07/10/2026", "08/10/2026", "Bắt buộc", "Đã hoàn thành", "Không bao giờ chặn học sinh học; khuyến khích ôn tập củng cố."),

        (48, "GM-02", "Toàn hệ thống", "Toàn khối 6 - 9", "Gamification & Động lực",
         "Chuỗi ngày học tập liên tục Streak ngọn lửa đèn cồn",
         "Ngọn lửa đèn cồn bùng cháy tăng thêm 1 ngày khi hoàn thành tối thiểu 1 bài học mỗi ngày; cho phép tích lũy tối đa 2 khiên đóng băng.",
         "08/10/2026", "09/10/2026", "Bắt buộc", "Đã hoàn thành", "Tạo thói quen rèn luyện học tập đều đặn hàng ngày."),

        (49, "GM-03", "Toàn hệ thống", "Toàn khối 6 - 9", "Gamification & Động lực",
         "Hệ thống Điểm kinh nghiệm (XP), Cấp độ khoa học và Chuỗi đúng liên tiếp",
         "Thưởng điểm kinh nghiệm phân tầng theo độ khó; cộng thêm điểm thưởng khi làm đúng liên tiếp; hiệu ứng pháo hoa khi thăng cấp.",
         "08/10/2026", "09/10/2026", "Bắt buộc", "Đã hoàn thành", "Ghi nhận xứng đáng nỗ lực và sự tiến bộ của học sinh."),

        (50, "GM-04", "Toàn hệ thống", "Toàn khối 6 - 9", "Gamification & Động lực",
         "Hệ thống Kinh tế Đá quý phần thưởng cân bằng",
         "Tích lũy đá quý khi hoàn thành xuất sắc chặng học, đạt điểm tuyệt đối hoặc mở rương kho báu trên bản đồ.",
         "09/10/2026", "10/10/2026", "Bắt buộc", "Đã hoàn thành", "Cân bằng hợp lý, tạo động lực tích lũy đá quý để đổi vật phẩm."),

        (51, "GM-05", "Toàn hệ thống", "Toàn khối 6 - 9", "Gamification & Động lực",
         "Cửa hàng vật phẩm khoa học hỗ trợ học tập",
         "Dùng đá quý đổi vật phẩm: Bình hồi năng lượng tim, Khiên băng bảo vệ chuỗi ngày học, Bình nhân đôi kinh nghiệm.",
         "09/10/2026", "10/10/2026", "Bắt buộc", "Đã hoàn thành", "Hình ảnh vật phẩm 3D đẹp mắt, giao dịch đổi thưởng tức thì."),

        (52, "GM-06", "Toàn hệ thống", "Toàn khối 6 - 9", "Gamification & Động lực",
         "Hệ thống Bảng vinh danh và Danh hiệu thành tựu khoa học",
         "Bộ sưu tập danh hiệu độc quyền: Cân bằng bậc thầy, Chiến binh Mol, Bác sĩ Nhóm máu, Thợ săn Động năng...",
         "10/10/2026", "11/10/2026", "Bắt buộc", "Đã hoàn thành", "Popup chúc mừng trang trọng khi học sinh mở khóa thành tựu mới."),

        # Nhóm 9: Bộ Trò chơi Khoa học Thực hành (MG)
        (53, "MG-01", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Khung nền tảng trò chơi khoa học tương tác dùng chung",
         "Bộ khung trò chơi tiêu chuẩn: đồng hồ đếm ngược, tính điểm chuỗi combo, thưởng điểm kinh nghiệm không trừ tim, nạp câu hỏi tự động.",
         "12/10/2026", "13/10/2026", "Bắt buộc", "Đã hoàn thành", "Vận hành ổn định cho toàn bộ 10 trò chơi khoa học."),

        (54, "MG-02", "Sinh học", "Lớp 8", "Trò chơi Khoa học (Minigames)",
         "Trò chơi tương tác Cấp cứu truyền máu an toàn hệ ABO",
         "Mô phỏng tình huống cấp cứu; học sinh kéo túi máu tương thích truyền cho bệnh nhân dựa trên quy tắc kháng nguyên - kháng thể.",
         "12/10/2026", "13/10/2026", "Bắt buộc", "Đã hoàn thành", "Truyền nhầm nhóm máu sẽ cảnh báo hiện tượng ngưng kết hồng cầu trực quan."),

        (55, "MG-03", "Hóa học", "Lớp 8, Lớp 9", "Trò chơi Khoa học (Minigames)",
         "Trò chơi tương tác Cân bằng phản ứng hóa học",
         "Bấm phím 3D tăng giảm hệ số để cân bằng số nguyên tử 2 vế phương trình; theo dõi thanh cân bằng khối lượng thời gian thực.",
         "13/10/2026", "14/10/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện phản xạ cân bằng phương trình nhanh cho học sinh Lớp 8-9."),

        (56, "MG-04", "Hóa học", "Lớp 7, Lớp 8", "Trò chơi Khoa học (Minigames)",
         "Trò chơi tương tác Ghép thẻ mảnh công thức phân tử",
         "Kéo ghép các thẻ kim loại và gốc acid vào khay để tạo thành công thức phân tử đúng quy tắc hóa trị và trung hòa điện tích.",
         "13/10/2026", "14/10/2026", "Bắt buộc", "Đã hoàn thành", "Tạo liên kết hóa học phát sáng đẹp mắt khi ghép đúng."),

        (57, "MG-05", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Trò chơi Nối cặp kiến thức khoa học tương ứng",
         "Chạm nối 2 thẻ tương ứng: chất với ứng dụng thực tế, định luật với công thức, bào quan với chức năng sinh học.",
         "14/10/2026", "15/10/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện trí nhớ và liên kết kiến thức liên môn Hóa - Sinh - Lý."),

        (58, "MG-06", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Trò chơi Phân loại sự vật hiện tượng vào đúng giỏ",
         "Kéo thả vật thể vào giỏ quy định: Acid/Base/Muối, Kim loại/Phi kim, Đơn bào/Đa bào; rung phản hồi khi phân loại sai.",
         "14/10/2026", "15/10/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện năng lực phân loại và tư duy hệ thống hóa sự vật."),

        (59, "MG-07", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Trò chơi Đố vui phản biện Đúng / Sai",
         "Thẩm định tính chính xác của 10 khẳng định khoa học bất ngờ; xóa bỏ những ngộ nhận khoa học phổ biến kèm giải thích.",
         "15/10/2026", "16/10/2026", "Bắt buộc", "Đã hoàn thành", "Rèn luyện kỹ năng phân tích và phản biện khoa học."),

        (60, "MG-08", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Trò chơi Thử thách tốc độ khoa học trong 45 giây",
         "Trả lời nhanh 10 câu trắc nghiệm ngắn trong 45 giây; rèn luyện phản xạ nhanh với ký hiệu, hằng số và hiện tượng thường gặp.",
         "15/10/2026", "16/10/2026", "Bắt buộc", "Đã hoàn thành", "Đồng hồ cát đếm ngược tạo không khí thi đấu sôi nổi, cuốn hút."),

        (61, "MG-09", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Thử thách ngày: 5 câu hỏi liên môn mỗi ngày",
         "5 câu hỏi tổng hợp chọn mới mỗi ngày dựa theo chủ đề học sinh còn yếu; thưởng 30 XP và duy trì ngọn lửa chuỗi ngày học.",
         "16/10/2026", "16/10/2026", "Bắt buộc", "Đã hoàn thành", "Tự động đổi mới nội dung hàng ngày lúc 00:00 theo giờ thiết bị."),

        (62, "MG-10", "Liên môn KHTN", "Toàn khối 6 - 9", "Trò chơi Khoa học (Minigames)",
         "Đấu trường Ôn tập khắc phục câu hỏi làm sai",
         "Biến việc làm lại bài sai thành trò chơi bổ ích; tự động nạp các câu hỏi học sinh từng trả lời sai để củng cố vững chắc.",
         "16/10/2026", "16/10/2026", "Bắt buộc", "Đã hoàn thành", "Xóa tan lỗ hổng kiến thức, giúp học sinh tiến bộ nhanh chóng."),

        # Nhóm 10: Phòng Thí nghiệm Ảo (TN)
        (63, "TN-01", "Hóa học", "Lớp 8, Lớp 9", "Phòng Thí nghiệm Ảo (Virtual Lab)",
         "Phòng Thí nghiệm Hóa học ảo: Phản ứng Acid tác dụng Kim loại & Đổi màu chỉ thị",
         "Học sinh tự tay kéo ống nhỏ giọt HCl vào Zn quan sát bọt khí H₂ sủi tăm bay lên; nhúng giấy quỳ tím đổi màu đỏ/xanh.",
         "23/10/2026", "24/10/2026", "Bắt buộc", "Đã hoàn thành", "Mô phỏng chân thực bài thực hành SGK; an toàn tuyệt đối không hóa chất độc hại."),

        (64, "TN-02", "Vật lý", "Lớp 8, Lớp 9", "Phòng Thí nghiệm Ảo (Virtual Lab)",
         "Bàn lắp ráp Mạch điện Vật lý ảo tương tác trực quan",
         "Tự lắp ghép nguồn pin, công tắc, bóng đèn, điện trở, đồng hồ đo điện; bóng đèn tự sáng theo cường độ dòng điện hoặc đứt chì nếu đoản mạch.",
         "23/10/2026", "24/10/2026", "Bắt buộc", "Đã hoàn thành", "Trực quan hóa dòng điện và định luật Ohm trong mạch điện kín."),

        (65, "TN-03", "Sinh học", "Lớp 6", "Phòng Thí nghiệm Ảo (Virtual Lab)",
         "Kính hiển vi Quang học Ảo soi tiêu bản tế bào sinh học",
         "Đặt tiêu bản tế bào vảy hành hoặc niêm mạc; xoay ốc vi cấp điều chỉnh độ nét ở các mức phóng đại 10x, 40x, 100x thấy rõ màng và nhân.",
         "23/10/2026", "24/10/2026", "Bắt buộc", "Đã hoàn thành", "Mô phỏng quang học chân thực; giúp học sinh quan sát rõ cấu tạo tế bào."),

        # Nhóm 11: Ôn tập Ngắt quãng & Tìm kiếm (TK)
        (66, "TK-01", "Liên môn KHTN", "Toàn khối 6 - 9", "Ôn tập & Tra cứu",
         "Công cụ tìm kiếm bài học và kiến thức khoa học siêu tốc",
         "Tra cứu tức thì tên chất, công thức, bài học; hỗ trợ tìm kiếm tiếng Việt không dấu (gõ naoh sẽ tự tìm thấy bài học NaOH).",
         "21/10/2026", "22/10/2026", "Bắt buộc", "Đã hoàn thành", "Tự động phân nhóm: Bài học, Phương trình, Bài tập, Trò chơi."),

        (67, "TK-02", "Liên môn KHTN", "Toàn khối 6 - 9", "Ôn tập & Tra cứu",
         "Thuật toán lặp lại ngắt quãng khoa học Leitner 5 hộp thời gian",
         "Phương pháp ghi nhớ ngắt quãng (1, 2, 4, 7, 14 ngày); trả lời đúng thăng cấp hộp, trả lời sai trở về Hộp 1 để ôn lại sớm hơn.",
         "21/10/2026", "22/10/2026", "Bắt buộc", "Đã hoàn thành", "Giới hạn ôn tối đa 10 câu mỗi ngày, tránh gây áp lực học tập."),

        (68, "TK-03", "Liên môn KHTN", "Toàn khối 6 - 9", "Ôn tập & Tra cứu",
         "Hệ thống tự động phát hiện chủ đề kiến thức còn yếu",
         "Tự động nhận diện những kỹ năng bài tập có tỷ lệ làm đúng dưới 70%; đề xuất các bài tập tương tự để học sinh rèn luyện thêm.",
         "22/10/2026", "22/10/2026", "Bắt buộc", "Đã hoàn thành", "Hiển thị cây kỹ năng và lộ trình khắc phục rõ ràng trên trang tiến độ."),

        # Nhóm 12: Linh vật, Âm thanh & Lồng tiếng (AT)
        (69, "AT-01", "Toàn hệ thống", "Toàn khối 6 - 9", "Âm thanh & Trải nghiệm",
         "Hệ thống hiệu ứng âm thanh tương tác học đường sống động",
         "Bộ âm thanh vui nhộn: tiếng bấm phím êm tai, âm thanh trả lời đúng rộn rã, tiếng nhắc nhở nhẹ nhàng khi sai, chuông reo hoàn thành chặng.",
         "24/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Độ trễ âm thanh siêu nhỏ dưới 0.03 giây; có công tắc bật tắt tiện lợi."),

        (70, "AT-02", "Liên môn KHTN", "Toàn khối 6 - 9", "Âm thanh & Trải nghiệm",
         "Hệ thống Lồng tiếng Việt truyền cảm hứng cho bộ 3 linh vật",
         "Lồng tiếng các câu động viên tiếng Việt dí dỏm ('Chuẩn không cần chỉnh!', 'Bừng sáng năng lượng!') tạo sự gần gũi, khích lệ người học.",
         "24/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Giọng nói vui tươi, truyền cảm; tạo hứng thú học tập rõ rệt."),

        (71, "AT-03", "Toàn hệ thống", "Toàn khối 6 - 9", "Âm thanh & Trải nghiệm",
         "Hệ thống rung phản hồi xúc giác nhẹ nhàng trên điện thoại",
         "Rung phản hồi đa tầng: rung nhẹ khi chạm phím, rung 2 nhịp nảy khi đúng, rung cảnh báo khi sai; có thể bật tắt theo sở thích.",
         "24/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Tăng trải nghiệm chân thực khi học tập trên màn hình cảm ứng di động."),

        (72, "AT-04", "Toàn hệ thống", "Toàn khối 6 - 9", "Âm thanh & Trải nghiệm",
         "Bảng điều khiển âm thanh và nghe thử giọng linh vật trong hồ sơ",
         "Khu vực cài đặt riêng tại trang Hồ sơ: tùy chỉnh bật tắt nhạc nền, hiệu ứng, rung xúc giác và nghe thử giọng nói của 3 linh vật.",
         "25/10/2026", "25/10/2026", "Bắt buộc", "Đã hoàn thành", "Ghi nhớ cấu hình của từng học sinh cho các lần học tiếp theo."),

        # Nhóm 13: Mở rộng Tương lai (MR)
        (73, "MR-01", "Liên môn KHTN", "Toàn khối 6 - 9", "Kế hoạch Mở rộng Tương lai",
         "Đấu trường so tài đối kháng khoa học trực tiếp 1 đấu 1 thời gian thực",
         "Cho phép 2 học sinh cùng vào phòng so tài giải nhanh 5 câu hỏi trong 60 giây; bảng xếp hạng học sinh xuất sắc hàng tuần.",
         "01/11/2026", "15/12/2026", "Khuyến nghị", "Kế hoạch", "Kết nối phòng chơi nhanh chóng, tính điểm thi đấu công bằng."),

        (74, "MR-02", "Toàn hệ thống", "Toàn khối 6 - 9", "Kế hoạch Mở rộng Tương lai",
         "Ứng dụng di động độc lập đóng gói cài đặt trên Google Play và App Store",
         "Cài đặt trực tiếp lên màn hình điện thoại như ứng dụng native; tải toàn bộ bài học về máy để học mọi lúc mọi nơi không cần Internet.",
         "16/12/2026", "28/02/2027", "Quan trọng", "Đang phát triển", "Mang lại trải nghiệm học tập tiện lợi tối đa cho học sinh cả nước.")
    ]

    for idx, row in enumerate(features_all, start=5):
        max_c = max(len(row[5]), len(row[6]) // 3)
        ws2.row_dimensions[idx].height = 38 if max_c < 45 else 50
        fill_row = fill_even if idx % 2 == 0 else fill_odd

        # STT
        ws2.cell(row=idx, column=1, value=row[0]).alignment = al_center
        ws2.cell(row=idx, column=1).font = f_text

        # Mã chức năng
        ws2.cell(row=idx, column=2, value=row[1]).alignment = al_center
        ws2.cell(row=idx, column=2).font = f_code

        # Phân môn
        ws2.cell(row=idx, column=3, value=row[2]).alignment = al_center
        ws2.cell(row=idx, column=3).font = f_text_bold

        # Khối lớp
        ws2.cell(row=idx, column=4, value=row[3]).alignment = al_center
        ws2.cell(row=idx, column=4).font = f_text_bold

        # Nhóm chức năng
        ws2.cell(row=idx, column=5, value=row[4]).alignment = al_left
        ws2.cell(row=idx, column=5).font = f_text

        # Tên chức năng
        ws2.cell(row=idx, column=6, value=row[5]).alignment = al_left
        ws2.cell(row=idx, column=6).font = f_text_bold

        # Mô tả sư phạm
        ws2.cell(row=idx, column=7, value=row[6]).alignment = al_left
        ws2.cell(row=idx, column=7).font = f_text

        # Ngày bắt đầu
        ws2.cell(row=idx, column=8, value=row[7]).alignment = al_center
        ws2.cell(row=idx, column=8).font = f_text

        # Ngày hoàn thành
        ws2.cell(row=idx, column=9, value=row[8]).alignment = al_center
        ws2.cell(row=idx, column=9).font = f_text

        # Mức độ ưu tiên
        c_p = ws2.cell(row=idx, column=10, value=row[9])
        c_p.alignment = al_center
        c_p.font = Font(name=font_name, size=10, bold=True, color="C00000" if row[9]=="Bắt buộc" else "2563EB")

        # Trạng thái
        c_s = ws2.cell(row=idx, column=11, value=row[10])
        c_s.alignment = al_center
        if row[10] == "Đã hoàn thành":
            c_s.fill = fill_done
            c_s.font = font_done
        elif row[10] == "Đang phát triển":
            c_s.fill = fill_prog
            c_s.font = font_prog
        else:
            c_s.fill = fill_plan
            c_s.font = font_plan

        # Đánh giá thực tế
        ws2.cell(row=idx, column=12, value=row[11]).alignment = al_left
        ws2.cell(row=idx, column=12).font = f_text

        for c_idx in range(1, 13):
            if c_idx != 11:
                ws2.cell(row=idx, column=c_idx).fill = fill_row
            ws2.cell(row=idx, column=c_idx).border = border_thin

    col_widths_s2 = [7, 14, 18, 18, 28, 36, 56, 14, 15, 14, 18, 44]
    for i, w in enumerate(col_widths_s2, start=1):
        ws2.column_dimensions[get_column_letter(i)].width = w

    ws2.auto_filter.ref = f"A4:L{4 + len(features_all)}"


    # =========================================================================
    # SHEET 3: LỘ TRÌNH PHÁT TRIỂN (M0 ➔ M14 TRONG 1 THÁNG RƯỠI)
    # =========================================================================
    ws3 = wb.create_sheet(title="3. Lo Trinh Phat Trien M0-M14")
    ws3.views.sheetView[0].showGridLines = True

    ws3["A1"] = "LỘ TRÌNH CÁC CỘT MỐC PHÁT HÀNH (MASTER MILESTONES M0 ➔ M14)"
    ws3["A1"].font = f_title
    ws3["A2"] = "Lịch trình hoàn thiện từ 10/09/2026 đến 27/10/2026 (1,5 tháng) và kế hoạch mở rộng tương lai"
    ws3["A2"].font = f_subtitle
    ws3.row_dimensions[1].height = 25
    ws3.row_dimensions[2].height = 18

    headers_m = [
        "Mã Mốc", "Phiên Bản", "Tên Giai Đoạn Phát Triển", "Phân Môn & Khối Lớp Trọng Tâm", 
        "Bắt Đầu", "Hoàn Thành", "Số Chức Năng", "Mức Ưu Tiên", "Trạng Thái", "Sản Phẩm Nghiệm Thu Bàn Giao"
    ]

    ws3.row_dimensions[4].height = 28
    for c_idx, h_text in enumerate(headers_m, start=1):
        cell = ws3.cell(row=4, column=c_idx, value=h_text)
        cell.font = f_th
        cell.fill = fill_header
        cell.alignment = al_center
        cell.border = border_header

    ms_data = [
        ("M0", "v0.1.0", "Hạ tầng web & Nền tảng điều hướng", "Toàn hệ thống (Toàn khối 6 - 9)",
         "10/09/2026", "13/09/2026", 6, "Bắt buộc", "Đã hoàn thành", 
         "Giao diện web trực quan; điều hướng 11 khu vực học tập; tự động lưu dữ liệu ngoại tuyến không lo mất bài."),

        ("M1", "v0.5.0", "Giao diện đa giác quan & Bàn phím khoa học", "Hóa học & Vật lý (Lớp 7, 8, 9)",
         "14/09/2026", "19/09/2026", 10, "Bắt buộc", "Đã hoàn thành", 
         "Bộ nhận diện màu sắc phân môn, chế độ bảo vệ mắt Sáng/Tối, nút bấm nổi 3D, bàn phím gõ nhanh công thức Hóa học & Vật lý."),

        ("M2", "v0.8.0", "Động cơ xử lý & Bộ 10 công cụ chấm bài", "Đa môn KHTN (Toàn khối 6 - 9)",
         "20/09/2026", "26/09/2026", 14, "Bắt buộc", "Đã hoàn thành", 
         "Bộ tính khối lượng mol tự động, kiểm tra cân bằng phương trình; trọn bộ 10 dạng chấm bài tập tương tác (trắc nghiệm, nối cặp, xếp giỏ...)."),

        ("M3", "v1.0.0", "Thử nghiệm sư phạm chuyên sâu: Hóa 8 Bài 3 (Mol)", "Hóa học (Lớp 8)",
         "27/09/2026", "03/10/2026", 5, "Bắt buộc", "Đã hoàn thành", 
         "Khung giải 7 bước bài bản; chế độ hướng dẫn từng bước; thang gợi ý sư phạm 4 nấc; bảng nhận xét động viên học sinh."),

        ("M4", "v1.5.0", "Bản đồ hành trình Duolingo & Cơ chế động lực", "Toàn hệ thống (Toàn khối 6 - 9)",
         "04/10/2026", "09/10/2026", 6, "Bắt buộc", "Đã hoàn thành", 
         "Bản đồ ziczac mở khóa theo chặng; cơ chế 5 Tim năng lượng, chuỗi ngày học Streak đèn cồn, điểm kinh nghiệm XP và thăng cấp."),

        ("M5", "v1.8.0", "Bộ 10 Trò chơi khoa học tương tác (Minigames)", "Liên môn KHTN (Lớp 7, 8, 9)",
         "10/10/2026", "16/10/2026", 10, "Bắt buộc", "Đã hoàn thành", 
         "Trò chơi Cấp cứu truyền máu ABO, Cân bằng phản ứng, Ghép thẻ công thức, Phân loại giỏ, Nối cặp, Đố vui Đúng/Sai, Thử thách tốc độ..."),

        ("M6", "v2.0.0", "Ngân hàng dữ liệu KHTN 6-9 & Sinh đề tự động", "Đa môn KHTN (Trọn bộ Lớp 6, 7, 8, 9)",
         "16/10/2026", "21/10/2026", 6, "Bắt buộc", "Đã hoàn thành", 
         "Trọn bộ bài tập Hóa học (21 bài), Sinh học (64+ bài), Vật lý; thuật toán tự động đổi số sinh đề bài ngẫu nhiên nghiệm đẹp."),

        ("M7", "v2.2.0", "Ôn tập ngắt quãng Leitner & Tra cứu siêu tốc", "Liên môn KHTN (Toàn khối 6 - 9)",
         "21/10/2026", "23/10/2026", 2, "Bắt buộc", "Đã hoàn thành", 
         "Thuật toán ghi nhớ ngắt quãng 5 hộp thời gian; tự động phát hiện chủ đề yếu dưới 70%; tìm kiếm kiến thức không dấu dưới 0.02 giây."),

        ("M8", "v2.5.0", "Bộ 3 Linh vật biểu cảm & Âm thanh học đường", "Toàn hệ thống (Toàn khối 6 - 9)",
         "23/10/2026", "25/10/2026", 4, "Bắt buộc", "Đã hoàn thành", 
         "Linh vật Atom, Leafy, Proton 9 trạng thái cảm xúc; hệ thống âm thanh bấm phím, trả lời đúng, thăng cấp sống động."),

        ("M9", "v2.8.0", "Cúp vinh danh 3D & Chống học vẹt trắc nghiệm", "Toàn hệ thống (Toàn khối 6 - 9)",
         "24/10/2026", "26/10/2026", 5, "Bắt buộc", "Đã hoàn thành", 
         "Bộ 3 Cúp vàng 3D lấp lánh trao thưởng cuối chặng; tự động đảo ngẫu nhiên phương án trắc nghiệm chống học vẹt vị trí."),

        ("M10", "v3.0.0", "Hệ thống 3 Phòng Thí nghiệm Ảo (Virtual Labs)", "Đa môn KHTN (Toàn khối 6 - 9)",
         "23/10/2026", "25/10/2026", 3, "Bắt buộc", "Đã hoàn thành", 
         "Lab Hóa học (Zn + HCl sủi bọt, quỳ đổi màu), Lab Vật lý (lắp mạch điện thắp sáng đèn), Lab Sinh học (kính hiển vi soi tế bào)."),

        ("M11", "v3.1.0", "Trợ lý sư phạm chẩn đoán bẫy sai tức thì", "Liên môn KHTN (Toàn khối 6 - 9)",
         "24/10/2026", "26/10/2026", 1, "Bắt buộc", "Đã hoàn thành", 
         "Chẩn đoán chính xác nguyên nhân lỗi sai điển hình (nhầm 22.4L cũ với 24.79L chuẩn mới, quên nhân hệ số, quên đổi đơn vị)."),

        ("M14", "v3.2.0", "Lồng tiếng linh vật & Rung phản hồi xúc giác", "Toàn hệ thống (Toàn khối 6 - 9)",
         "25/10/2026", "27/10/2026", 3, "Bắt buộc", "Đã hoàn thành", 
         "Lồng tiếng động viên bằng tiếng Việt dí dỏm cho 3 linh vật; hiệu ứng rung xúc giác êm ái khi thao tác trên điện thoại."),

        ("M12", "v3.5.0", "Đấu trường so tài đối kháng 1 đấu 1 trực tiếp", "Liên môn KHTN (Toàn khối 6 - 9)",
         "01/11/2026", "15/12/2026", 1, "Khuyến nghị", "Kế hoạch", 
         "Đấu trường so tài khoa học trực tuyến; 2 học sinh cùng làm 5 câu trong 60 giây; bảng xếp hạng tài năng tuần."),

        ("M13", "v4.0.0", "Ứng dụng di động độc lập & Học ngoại tuyến", "Toàn hệ thống (Toàn khối 6 - 9)",
         "16/12/2026", "28/02/2027", 1, "Quan trọng", "Đang phát triển", 
         "Đóng gói cài đặt trực tiếp trên Google Play và App Store; tải toàn bộ bài học về máy học không cần kết nối mạng.")
    ]

    for idx, row in enumerate(ms_data, start=5):
        max_c = max(len(row[2]), len(row[9]) // 3)
        ws3.row_dimensions[idx].height = 44 if max_c < 45 else 56
        fill_row = fill_even if idx % 2 == 0 else fill_odd

        # Mã mốc
        ws3.cell(row=idx, column=1, value=row[0]).alignment = al_center
        ws3.cell(row=idx, column=1).font = f_code

        # Phiên bản
        ws3.cell(row=idx, column=2, value=row[1]).alignment = al_center
        ws3.cell(row=idx, column=2).font = f_text_bold

        # Tên giai đoạn
        ws3.cell(row=idx, column=3, value=row[2]).alignment = al_left
        ws3.cell(row=idx, column=3).font = f_text_bold

        # Phân môn & Khối lớp
        ws3.cell(row=idx, column=4, value=row[3]).alignment = al_center
        ws3.cell(row=idx, column=4).font = f_text

        # Bắt đầu
        ws3.cell(row=idx, column=5, value=row[4]).alignment = al_center
        ws3.cell(row=idx, column=5).font = f_text

        # Hoàn thành
        ws3.cell(row=idx, column=6, value=row[5]).alignment = al_center
        ws3.cell(row=idx, column=6).font = f_text

        # Số chức năng
        ws3.cell(row=idx, column=7, value=row[6]).alignment = al_center
        ws3.cell(row=idx, column=7).font = f_text

        # Mức ưu tiên
        c_p = ws3.cell(row=idx, column=8, value=row[7])
        c_p.alignment = al_center
        c_p.font = Font(name=font_name, size=10, bold=True, color="C00000" if row[7]=="Bắt buộc" else "2563EB")

        # Trạng thái
        c_s = ws3.cell(row=idx, column=9, value=row[8])
        c_s.alignment = al_center
        if row[8] == "Đã hoàn thành":
            c_s.fill = fill_done
            c_s.font = font_done
        elif row[8] == "Đang phát triển":
            c_s.fill = fill_prog
            c_s.font = font_prog
        else:
            c_s.fill = fill_plan
            c_s.font = font_plan

        # Sản phẩm bàn giao
        ws3.cell(row=idx, column=10, value=row[9]).alignment = al_left
        ws3.cell(row=idx, column=10).font = f_text

        for c_idx in range(1, 11):
            if c_idx != 9:
                ws3.cell(row=idx, column=c_idx).fill = fill_row
            ws3.cell(row=idx, column=c_idx).border = border_thin

    col_widths_s3 = [11, 14, 34, 30, 14, 14, 14, 15, 18, 64]
    for i, w in enumerate(col_widths_s3, start=1):
        ws3.column_dimensions[get_column_letter(i)].width = w


    # =========================================================================
    # SHEET 4: DANH MỤC NGHIỆP VỤ SƯ PHẠM (CATALOG)
    # =========================================================================
    ws4 = wb.create_sheet(title="4. Danh Muc Nghiep Vu Su Pham")
    ws4.views.sheetView[0].showGridLines = True

    ws4["A1"] = "DANH MỤC NGHIỆP VỤ SƯ PHẠM: PHÂN MÔN, TRÒ CHƠI & PHÒNG THÍ NGHIỆM ẢO"
    ws4["A1"].font = f_title
    ws4["A2"] = "Đối chiếu nghiệp vụ giáo dục chuẩn mực, bám sát chương trình KHTN SGK Kết nối tri thức 2018"
    ws4["A2"].font = f_subtitle
    ws4.row_dimensions[1].height = 25
    ws4.row_dimensions[2].height = 18

    # Table 1: Phân môn học
    ws4["A4"] = "1. DANH MỤC 3 PHÂN MÔN KHTN THCS & LINH VẬT ĐẠI DIỆN"
    ws4["A4"].font = f_sec_title

    sub_th = ["Mã Môn", "Tên Phân Môn", "Linh Vật Đồng Hành", "Màu Nhận Diện", "Khối Lớp Áp Dụng", "Quy Mô Bài Học", "Trọng Tâm Kiến Thức SGK Kết Nối Tri Thức"]
    ws4.row_dimensions[5].height = 26
    for c_idx, h_text in enumerate(sub_th, start=1):
        c = ws4.cell(row=5, column=c_idx, value=h_text)
        c.font = f_th
        c.fill = fill_sub_header
        c.alignment = al_center
        c.border = border_header

    sub_rows = [
        ("chem", "Hóa học", "Atom (Phân tử nước đeo kính bảo hộ)", "Xanh Lam (#2A6FDB)", "Lớp 7, Lớp 8, Lớp 9", "21 bài học then chốt",
         "Nguyên tử, Bảng tuần hoàn, Phản ứng hóa học, Mol & Tỉ khối chất khí, Nồng độ dung dịch, Acid - Base - pH - Muối, Kim loại, Phi kim, Hydrocarbon và dẫn xuất."),
        ("bio", "Sinh học", "Leafy (Ếch xanh khoác áo blouse)", "Xanh Ngọc (#0A8272)", "Lớp 6, Lớp 7, Lớp 8, Lớp 9", "Hơn 64 bài học toàn diện",
         "Tế bào - Đơn vị cơ sở của sự sống, Đa dạng sinh học, Trao đổi chất & Chuyển hóa năng lượng (Quang hợp/Hô hấp), Cơ thể người (Tuần hoàn, Nhóm máu ABO), Di truyền học Mendel, DNA & RNA."),
        ("physics", "Vật lý", "Proton (Mèo cam kỹ sư điện trường)", "Tím Đậm (#6B4DE0)", "Lớp 6, Lớp 7, Lớp 8, Lớp 9", "Hơn 24 bài học chuyên sâu",
         "Đo lường cơ bản, Lực & Biểu diễn lực, Tốc độ chuyển động, Âm thanh & Ánh sáng, Áp suất chất lỏng & Lực đẩy Archimedes, Đòn bẩy, Mạch điện kín & Định luật Ohm, Thấu kính.")
    ]

    for idx, row in enumerate(sub_rows, start=6):
        ws4.row_dimensions[idx].height = 44
        fill_row = fill_even if idx % 2 == 0 else fill_odd
        for c_idx, val in enumerate(row, start=1):
            c = ws4.cell(row=idx, column=c_idx, value=val)
            c.font = f_text_bold if c_idx in (1, 2) else f_text
            c.alignment = al_center if c_idx in (1, 4, 5, 6) else al_left
            c.fill = fill_row
            c.border = border_thin

    # Table 2: Minigames
    ws4["A10"] = "2. DANH MỤC 10 TRÒ CHƠI KHOA HỌC TƯƠNG TÁC RÈN LUYỆN TƯ DUY"
    ws4["A10"].font = f_sec_title

    mini_th = ["STT", "Tên Trò Chơi Khoa Học", "Phân Môn", "Khối Lớp Áp Dụng", "Kỹ Năng Sư Phạm Rèn Luyện", "Cơ Chế Tương Tác Học Tập"]
    ws4.row_dimensions[11].height = 26
    for c_idx, h_text in enumerate(mini_th, start=1):
        c = ws4.cell(row=11, column=c_idx, value=h_text)
        c.font = f_th
        c.fill = fill_sub_header
        c.alignment = al_center
        c.border = border_header

    mini_rows = [
        (1, "Cấp cứu truyền máu an toàn ABO", "Sinh học", "Lớp 8", "Vận dụng quy tắc kháng nguyên - kháng thể trong truyền máu", "Kéo túi máu tương thích truyền cho bệnh nhân trong ca cấp cứu"),
        (2, "Cân bằng phản ứng hóa học", "Hóa học", "Lớp 8, Lớp 9", "Rèn phản xạ cân bằng số nguyên tử 2 vế bảo toàn nguyên tố", "Bấm phím 3D tăng/giảm hệ số; theo dõi cán cân thăng bằng thời gian thực"),
        (3, "Ghép thẻ công thức phân tử", "Hóa học", "Lớp 7, Lớp 8", "Khắc sâu quy tắc hóa trị và trung hòa điện tích", "Kéo cation kim loại ghép với anion gốc acid vào khay liên kết"),
        (4, "Xây dựng chuỗi phản ứng liên hoàn", "Hóa học", "Lớp 8, Lớp 9", "Dự đoán chất tham gia, sản phẩm và điều kiện phản ứng", "Chọn và liên kết các thẻ hóa chất qua sơ đồ mũi tên chuyển hóa"),
        (5, "Nối cặp kiến thức khoa học", "Liên môn KHTN", "Toàn khối 6 - 9", "Liên kết chất với ứng dụng, định luật với công thức, bào quan với chức năng", "Chạm chọn 2 thẻ khái niệm tương ứng (hỗ trợ thao tác chạm một tay)"),
        (6, "Phân loại vào đúng giỏ quy định", "Liên môn KHTN", "Toàn khối 6 - 9", "Năng lực phân loại: Acid/Base/Muối, Kim loại/Phi kim, Đơn bào/Đa bào", "Kéo thả sự vật hiện tượng vào đúng giỏ phân loại tương ứng"),
        (7, "Đố vui phản biện Đúng / Sai", "Liên môn KHTN", "Toàn khối 6 - 9", "Tư duy phản biện khoa học, xóa bỏ ngộ nhận phổ biến", "Thẩm định 10 khẳng định khoa học bất ngờ kèm giải thích cặn kẽ"),
        (8, "Thử thách tốc độ trong 45 giây", "Liên môn KHTN", "Toàn khối 6 - 9", "Phản xạ nhanh với ký hiệu hóa học, hằng số và hiện tượng thường gặp", "Chạy đua với đồng hồ cát trả lời nhanh 10 câu trắc nghiệm ngắn"),
        (9, "Thử thách ngày liên môn", "Liên môn KHTN", "Toàn khối 6 - 9", "Tạo lập thói quen học tập đều đặn và duy trì ngọn lửa Streak", "5 câu hỏi tổng hợp mỗi ngày đổi mới tự động lúc 00:00"),
        (10, "Đấu trường ôn tập câu hỏi sai", "Liên môn KHTN", "Toàn khối 6 - 9", "Khắc phục triệt để các câu hỏi và dạng bài học sinh từng làm sai", "Tự động trích xuất câu hỏi từ các lần làm bài chưa đạt để củng cố")
    ]

    for idx, row in enumerate(mini_rows, start=12):
        ws4.row_dimensions[idx].height = 32
        fill_row = fill_even if idx % 2 == 0 else fill_odd
        for c_idx, val in enumerate(row, start=1):
            c = ws4.cell(row=idx, column=c_idx, value=val)
            c.font = f_text_bold if c_idx == 2 else f_text
            c.alignment = al_center if c_idx in (1, 3, 4) else al_left
            c.fill = fill_row
            c.border = border_thin

    # Table 3: Virtual Labs
    ws4["A23"] = "3. DANH MỤC 3 PHÒNG THÍ NGHIỆM ẢO TƯƠNG TÁC TRỰC QUAN (VIRTUAL LAB)"
    ws4["A23"].font = f_sec_title

    lab_th = ["STT", "Phòng Thí Nghiệm Ảo", "Phân Môn", "Khối Lớp Áp Dụng", "Thao Tác Thực Nghiệm Mô Phỏng", "Hiện Tượng Quan Sát Trực Quan", "Ý Nghĩa Thực Hành Theo SGK"]
    ws4.row_dimensions[24].height = 26
    for c_idx, h_text in enumerate(lab_th, start=1):
        c = ws4.cell(row=24, column=c_idx, value=h_text)
        c.font = f_th
        c.fill = fill_sub_header
        c.alignment = al_center
        c.border = border_header

    lab_rows = [
        (1, "Phòng Thí nghiệm Hóa học ảo", "Hóa học", "Lớp 8, Lớp 9",
         "Kéo ống nhỏ giọt acid HCl vào kẽm Zn; nhúng giấy quỳ tím vào dung dịch", 
         "Bọt khí H₂ sủi tăm bay lên liên tục; giấy quỳ chuyển màu đỏ (acid) hoặc xanh (base)", 
         "Thực hành tính chất hóa học của Acid và Kim loại (Hóa học 8 & 9); an toàn tuyệt đối"),

        (2, "Phòng Thí nghiệm Mạch điện Vật lý ảo", "Vật lý", "Lớp 8, Lớp 9",
         "Lắp ghép pin, công tắc, bóng đèn, điện trở, đồng hồ đo vôn kế và ampe kế", 
         "Đèn phát sáng theo cường độ dòng điện I = U/R; đứt cầu chì cảnh báo nếu bị đoản mạch", 
         "Thực hành lắp ráp mạch điện kín & Khảo sát định luật Ohm (Vật lý 8 & 9)"),

        (3, "Kính hiển vi Sinh học ảo", "Sinh học", "Lớp 6",
         "Đặt tiêu bản tế bào vảy hành / niêm mạc miệng; xoay núm vi cấp điều chỉnh độ nét", 
         "Tiêu bản chuyển từ mờ sang sắc nét ở 10x, 40x, 100x; thấy rõ nhân và màng tế bào", 
         "Thực hành quan sát tế bào - đơn vị cơ sở của sự sống (Sinh học 6)")
    ]

    for idx, row in enumerate(lab_rows, start=25):
        ws4.row_dimensions[idx].height = 42
        fill_row = fill_even if idx % 2 == 0 else fill_odd
        for c_idx, val in enumerate(row, start=1):
            c = ws4.cell(row=idx, column=c_idx, value=val)
            c.font = f_text_bold if c_idx == 2 else f_text
            c.alignment = al_center if c_idx in (1, 3, 4) else al_left
            c.fill = fill_row
            c.border = border_thin

    col_widths_s4 = [7, 28, 16, 18, 42, 45, 48]
    for i, w in enumerate(col_widths_s4, start=1):
        ws4.column_dimensions[get_column_letter(i)].width = w

    # Save to Excel file
    out_file = "LICH_CAP_NHAT_TINH_NANG_STEM_SOLVE.xlsx"
    wb.save(out_file)
    print(f"SUCCESS: Generated {out_file}")

if __name__ == "__main__":
    build_excel()
