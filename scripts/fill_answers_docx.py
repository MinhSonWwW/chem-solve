import docx
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def fill_answers():
    # Find target file
    target = None
    for f in os.listdir('.'):
        if '9A1' in f and f.endswith('.docx'):
            target = f
            break

    if not target:
        print("Error: Target file Minh Son 9A1.docx not found.")
        return

    print(f"Loading document: {target}")
    doc = docx.Document(target)
    table = doc.tables[0]

    # Map of 1-based TT to answers
    answers = {
        1: (
            "Em bắt đầu làm dự án từ ngày 10/09/2026 đến nay (27/10/2026). "
            "Toàn bộ sản phẩm đều được làm mới hoàn toàn trong năm 2026, không có phần nào làm từ trước."
        ),
        2: (
            "Xuất phát từ việc chính em và các bạn trong lớp gặp nhiều khó khăn khi học môn KHTN: "
            "môn này ghép cả 3 phân môn Lý, Hóa, Sinh nên lượng kiến thức rất nặng; các bạn rất sợ tính toán mol, "
            "cân bằng phương trình hay nhầm đơn vị đo mà làm bài tập trên giấy thì không biết mình sai ở đâu. "
            "Em muốn tạo ra một trang web giúp các bạn tự học giống như chơi game, có chấm bài tức thì, "
            "chỉ rõ lỗi sai và gợi ý từng bước để các bạn không bị nản."
        ),
        3: (
            "Em đã xem qua Duolingo, OLM, VietJack và Hoc247.\n"
            "- Duolingo có cơ chế học hình ziczac và chuỗi ngày học rất cuốn hút nhưng chỉ dạy ngoại ngữ, không có môn KHTN.\n"
            "- Các trang web học tập tại Việt Nam chủ yếu là bài giảng chữ dài hoặc ngân hàng câu hỏi trắc nghiệm tĩnh, "
            "chưa có bàn phím gõ công thức trên điện thoại, thiếu bài tập tương tác kéo thả phân loại hay mô phỏng thí nghiệm trực quan, "
            "và khi làm sai thì chỉ hiện đáp án trơ trọi chứ không chỉ ra bạn đang nhầm ở bước nào."
        ),
        4: (
            "Lúc đầu em có nghĩ đến làm trò chơi trên PowerPoint hoặc tạo form trắc nghiệm trên Google Forms/Quizizz. "
            "Tuy nhiên:\n"
            "- PowerPoint chỉ trình chiếu thụ động, không lưu được tiến độ riêng của từng bạn.\n"
            "- Google Forms chỉ chấm trắc nghiệm đơn thuần, không chấm được phương trình hóa học hay kéo thả xếp giỏ.\n"
            "- Em cũng từng tính làm app cài đặt, nhưng máy của nhiều bạn trong lớp là máy cũ, bộ nhớ ít nên ngại cài thêm ứng dụng.\n"
            "-> Vì vậy em chọn làm Trang web (Web App): bạn nào cũng mở được ngay trên trình duyệt điện thoại hoặc máy tính chỉ bằng một đường link, "
            "không tốn dung lượng máy và tự động lưu tiến độ học tập bình thường."
        ),
        5: (
            "Em đặt ra 5 tiêu chí quan trọng:\n"
            "1. Chạy nhẹ và mượt trên mọi điện thoại cũ, màn hình nhỏ.\n"
            "2. Không bắt buộc đăng nhập phức tạp vẫn tự động ghi nhớ bài làm và điểm số.\n"
            "3. Hoàn toàn miễn phí 100% cho tất cả học sinh.\n"
            "4. Bám sát đúng chương trình SGK Khoa học Tự nhiên bộ Kết nối tri thức (Chương trình GDPT 2018).\n"
            "5. Học không bị chán: giao diện đẹp, có âm thanh vui nhộn, linh vật cổ vũ và quan trọng nhất là phải chỉ rõ nguyên nhân khi làm sai."
        ),
        6: (
            "Em dùng các công cụ và ngôn ngữ lập trình web hiện đại:\n"
            "- Ngôn ngữ: TypeScript (dựa trên JavaScript nhưng chặt chẽ hơn để hạn chế lỗi).\n"
            "- Giao diện: Thư viện React 19 và Tailwind CSS để giao diện co giãn đẹp mắt trên cả điện thoại và máy tính.\n"
            "- Quản lý dữ liệu: Thư viện Zustand kết hợp lưu trữ dữ liệu ngoại tuyến IndexedDB / LocalStorage trên trình duyệt.\n"
            "- Công cụ kiểm thử và đóng gói: Vite, Vitest để chạy các bài kiểm thử tự động.\n"
            "- Quản lý mã nguồn: Đưa toàn bộ mã nguồn lên GitHub."
        ),
        7: (
            "- Phần em tự làm: Lên ý tưởng cấu trúc app, chọn lọc bài học theo SGK, tự biên soạn nội dung câu hỏi và các bẫy sai hay gặp, "
            "thiết kế luật chơi cho các trò chơi và vẽ phác thảo biểu tượng dụng cụ thí nghiệm.\n"
            "- Phần nhờ AI: Em dùng AI (Gemini) như một người trợ giảng lập trình, hướng dẫn em viết các đoạn mã React/TypeScript khó, "
            "gợi ý cách sửa lỗi giao diện và thiết lập các bài kiểm thử tự động.\n"
            "- Em KHÔNG dùng AI tự ý bịa câu hỏi hay lý thuyết; toàn bộ nội dung đều do em đối chiếu chuẩn xác từ SGK. "
            "Em vẫn còn lưu đầy đủ toàn bộ lịch sử các cuộc trò chuyện và câu lệnh làm việc với AI."
        ),
        8: (
            "Toàn bộ lý thuyết và bài tập đều được lấy và biên soạn lại từ sách giáo khoa và sách bài tập Khoa học Tự nhiên lớp 6, 7, 8, 9 "
            "- Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam). "
            "Danh pháp khoa học tuân thủ chuẩn mới của Bộ GD&ĐT (acid, base, oxide, thể tích khí chuẩn 24.79L...).\n"
            "Nội dung đã được Thầy/Cô giáo trong Tổ Khoa học Tự nhiên của trường soát duyệt kỹ lưỡng về tính khoa học và độ chính xác trước khi đưa vào ứng dụng."
        ),
        9: (
            "App hiện có đầy đủ cả 3 phân môn Hóa học, Sinh học, Vật lý từ Lớp 6 đến Lớp 9:\n"
            "- Số bài học: Hơn 100 bài học lý thuyết và chủ đề thực hành (Hóa học 21 bài lớp 7-9, Sinh học hơn 64 bài lớp 6-9, Vật lý hơn 24 bài lớp 6-9).\n"
            "- Số câu hỏi bài tập: Có hơn 2.300 câu hỏi bài tập tương tác (trắc nghiệm, điền số, viết phương trình, nối cặp, xếp giỏ).\n"
            "- Ngoài ra app có 10 trò chơi khoa học tương tác (Minigames) và 3 phòng thí nghiệm ảo (Hóa, Sinh, Lý)."
        ),
        10: (
            "Kho code trên GitHub của em có lịch sử cập nhật rất đầy đủ và minh bạch, "
            "với hơn 70 lần commit (cập nhật) được lưu lại chi tiết theo từng ngày và từng tính năng phát triển từ tháng 9/2026 đến nay."
        ),
        11: (
            "Em đã cho các bạn trong lớp 9A1 và một số em học sinh lớp 7, lớp 8 trong trường dùng thử. Các bạn góp ý và em đã sửa đổi:\n"
            "1. Gõ công thức hóa học trên điện thoại rất khó vì không có số nhỏ ở dưới -> Em đã tạo Bàn phím Hóa học tự động chuyển số thành chỉ số dưới.\n"
            "2. Học buổi tối dễ bị chói mắt -> Em bổ sung chế độ Giao diện tối (Dark Mode) bảo vệ mắt.\n"
            "3. Khi hết 5 tim thì sợ không được học tiếp -> Em làm thêm phòng Luyện tập giúp các bạn vào ôn bài là được hồi tim miễn phí ngay.\n"
            "4. Thầy cô góp ý muốn nhìn thấy hiện tượng thí nghiệm trực quan -> Em đã xây dựng thêm 3 Phòng Thí nghiệm Ảo để các bạn được tự tay nhỏ acid vào kẽm xem sủi bọt khí thật."
        ),
        12: (
            "Em gặp 3 khó khăn lớn nhất và cách giải quyết:\n"
            "1. Tự động kiểm tra công thức và phương trình hóa học (công thức có ngoặc, muối ngậm nước, kiểm tra tỉ lệ tối giản): "
            "Em đã nghiên cứu thuật toán phân tích chuỗi và tìm ước chung lớn nhất (GCD) để máy tự nhận diện và chỉ ra chỗ sai cho người học.\n"
            "2. Lỗi giao diện trên màn hình điện thoại nhỏ bị đè chữ: Em đã tối ưu lại giao diện theo chuẩn di động (Mobile-First), "
            "chỉnh khoảng cách và đo kích thước nút bấm tối thiểu 44px để bấm chuẩn xác.\n"
            "3. Đảm bảo dữ liệu không bị sai sót: Em viết 248 bài kiểm thử tự động để máy tự soát lỗi code trước khi phát hành."
        ),
        13: (
            "Từ 30/9/2026 đến nay em đã tập trung hoàn thiện các tính năng cốt lõi:\n"
            "- 01 - 03/10: Hoàn thiện khung 7 bước giải bài, thang gợi ý sư phạm 4 nấc và bảng nhận xét kết quả.\n"
            "- 06 - 10/10: Thiết kế bản đồ học tập ziczac Duolingo, cơ chế 5 tim, ngọn lửa streak, đá quý và cửa hàng phần thưởng.\n"
            "- 12 - 16/10: Phát triển trọn bộ 10 trò chơi khoa học tương tác (truyền máu ABO, cân bằng phương trình, ghép thẻ công thức, phân loại giỏ...).\n"
            "- 17 - 22/10: Nạp dữ liệu bài tập KHTN 6-9, thẻ tóm tắt lý thuyết, thuật toán sinh đề bài tự động và thuật toán ôn tập ngắt quãng Leitner 5 hộp.\n"
            "- 23 - 27/10: Xây dựng 3 phòng thí nghiệm ảo (Hóa, Sinh, Lý), trợ lý chẩn đoán bẫy sai, lồng tiếng cho linh vật, tối ưu giao diện và kiểm thử toàn diện 248 bài test đạt 100%."
        ),
        14: (
            "Em định phát triển app tiếp theo 3 hướng:\n"
            "1. Xây dựng Đấu trường khoa học đối kháng 1 đấu 1 thời gian thực để 2 bạn học sinh có thể so tài giải nhanh trong 60 giây.\n"
            "2. Đóng gói app lên kho ứng dụng Google Play và App Store để bạn nào thích có thể tải về máy và tải sẵn bài học về học offline khi không có mạng.\n"
            "3. Bổ sung thêm các mô phỏng thí nghiệm không gian 3D và ngân hàng đề thi học sinh giỏi, ôn thi vào lớp 10 môn KHTN."
        ),
        15: (
            "- Tên dự án: STEM-Solve (Nền tảng Web tương tác hỗ trợ tự học Khoa học Tự nhiên THCS).\n"
            "- Lĩnh vực tham gia: Hệ thống phần mềm / Công nghệ thông tin."
        )
    }

    # Iterate through rows in table
    # Row 0 is header: TT | Thông tin cần có | Điền vào đây
    for r_idx in range(1, len(table.rows)):
        row = table.rows[r_idx]
        tt_text = row.cells[0].text.strip()
        try:
            tt_num = int(tt_text)
        except ValueError:
            continue

        if tt_num in answers:
            ans_cell = row.cells[2]
            # Clear existing text in cell
            ans_cell.text = answers[tt_num]
            print(f"Filled answer for question #{tt_num}")

    # Save back to document
    doc.save(target)
    print(f"\nSUCCESS: Updated and saved {target}")

if __name__ == "__main__":
    fill_answers()
