import os
import shutil
from PIL import Image

SRC_DIR = r"d:\dow\dự án hóa học web\ảnh chi tiết"
PUBLIC_DIR = r"d:\dow\dự án hóa học web\public\assets"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def main():
    # 1. Directories
    mascot_dir = os.path.join(PUBLIC_DIR, "mascot")
    icons_dir = os.path.join(PUBLIC_DIR, "icons")
    roadmap_dir = os.path.join(PUBLIC_DIR, "roadmap")
    vfx_dir = os.path.join(PUBLIC_DIR, "vfx")
    anim_dir = os.path.join(PUBLIC_DIR, "animations")
    ui_dir = os.path.join(PUBLIC_DIR, "ui")

    for d in [mascot_dir, icons_dir, roadmap_dir, vfx_dir, anim_dir, ui_dir]:
        ensure_dir(d)

    print("Copying Mascot and Videos...")
    # 2. Mascot Full images
    shutil.copy(os.path.join(SRC_DIR, "bth.png"), os.path.join(mascot_dir, "atom-idle.png"))
    shutil.copy(os.path.join(SRC_DIR, "traloidung.png"), os.path.join(mascot_dir, "atom-correct.png"))
    shutil.copy(os.path.join(SRC_DIR, "traloisai.png"), os.path.join(mascot_dir, "atom-wrong.png"))

    # 3. Copy MP4 Videos
    video_mappings = {
        "doodle-color-1103-confetti-hover-pinch.mp4": "confetti.mp4",
        "doodle-motif-237-star-hover-rotation.mp4": "star.mp4",
        "wired-lineal-153-bar-chart-vertical-grow-loop-all.mp4": "chart.mp4",
        "wired-lineal-1780-medal-first-place-hover-pinch.mp4": "medal.mp4",
        "wired-lineal-3235-badge-ribbon-hover-enlarge.mp4": "badge.mp4",
        "wired-lineal-412-gift-hover-roll.mp4": "gift.mp4",
        "wired-lineal-63-home-morph-neighbourhood.mp4": "home.mp4",
    }
    for src_name, dst_name in video_mappings.items():
        src_path = os.path.join(SRC_DIR, src_name)
        if os.path.exists(src_path):
            shutil.copy(src_path, os.path.join(anim_dir, dst_name))

    print("Cropping Gamification Icons...")
    stats_img_path = os.path.join(SRC_DIR, "Bộ Icon chỉ số Game (Stats, Currencies, Lives).jpeg")
    if os.path.exists(stats_img_path):
        stats_img = Image.open(stats_img_path)
        # Exact pixel boxes on 1376x768
        crop_save(stats_img, (180, 60, 465, 380), os.path.join(icons_dir, "heart-flask.png"))
        crop_save(stats_img, (550, 60, 825, 380), os.path.join(icons_dir, "streak-flame.png"))
        crop_save(stats_img, (920, 75, 1205, 380), os.path.join(icons_dir, "gem-crystal.png"))
        crop_save(stats_img, (340, 410, 630, 715), os.path.join(icons_dir, "chem-coin.png"))
        crop_save(stats_img, (730, 390, 1030, 720), os.path.join(icons_dir, "xp-potion.png"))

    print("Cropping Roadmap Nodes & Trophies...")
    road_img_path = os.path.join(SRC_DIR, "Các nút mốc trên Lộ trình học (Roadmap Milestone Nodes & Trophies).jpeg")
    if os.path.exists(road_img_path):
        road_img = Image.open(road_img_path)
        crop_save(road_img, (60, 80, 330, 360), os.path.join(roadmap_dir, "node-locked.png"))
        crop_save(road_img, (390, 80, 665, 360), os.path.join(roadmap_dir, "node-active.png"))
        crop_save(road_img, (760, 50, 990, 360), os.path.join(roadmap_dir, "trophy-bronze.png"))
        crop_save(road_img, (1080, 80, 1330, 360), os.path.join(roadmap_dir, "trophy-silver.png"))
        crop_save(road_img, (375, 415, 680, 710), os.path.join(roadmap_dir, "node-completed.png"))
        crop_save(road_img, (1060, 415, 1335, 710), os.path.join(roadmap_dir, "trophy-gold.png"))

    print("Cropping Reaction VFX...")
    # 6. Crop 'Bộ Hiệu ứng Phản ứng & Nhận biết chất (Reaction VFX & Indicators).jpeg'
    vfx_img_path = os.path.join(SRC_DIR, "Bộ Hiệu ứng Phản ứng & Nhận biết chất (Reaction VFX & Indicators).jpeg")
    if os.path.exists(vfx_img_path):
        vfx_img = Image.open(vfx_img_path)
        W, H = vfx_img.size
        # Row 1:
        # - Gas beaker: x: 10% to 24%, y: 10% to 48%
        # - Precipitate flask: x: 42% to 57%, y: 12% to 48%
        # - Explosion smoke: x: 70% to 90%, y: 12% to 48%
        # Row 2:
        # - Litmus paper blue: x: 22% to 40%, y: 57% to 92%
        # - Litmus paper red: x: 60% to 78%, y: 57% to 92%
        crop_save(vfx_img, (0.10*W, 0.10*H, 0.24*W, 0.48*H), os.path.join(vfx_dir, "reaction-gas.png"))
        crop_save(vfx_img, (0.42*W, 0.12*H, 0.57*W, 0.48*H), os.path.join(vfx_dir, "reaction-precipitate.png"))
        crop_save(vfx_img, (0.70*W, 0.12*H, 0.90*W, 0.48*H), os.path.join(vfx_dir, "reaction-explosion.png"))
        crop_save(vfx_img, (0.22*W, 0.57*H, 0.40*W, 0.92*H), os.path.join(vfx_dir, "litmus-blue.png"))
        crop_save(vfx_img, (0.60*W, 0.57*H, 0.78*W, 0.92*H), os.path.join(vfx_dir, "litmus-red.png"))

    print("Cropping Feedback Bottom Sheet Headers...")
    # 7. Crop 'Khung Thông báo Đúng  Sai trượt từ đáy màn hình (Bottom Feedback Sheet).jpeg'
    sheet_img_path = os.path.join(SRC_DIR, "Khung Thông báo Đúng  Sai trượt từ đáy màn hình (Bottom Feedback Sheet).jpeg")
    if os.path.exists(sheet_img_path):
        sheet_img = Image.open(sheet_img_path)
        W, H = sheet_img.size
        # Left card (Celebration): x: 0.07*W to 0.48*W, y: 0.10*H to 0.90*H
        # Right card (Error): x: 0.51*W to 0.92*W, y: 0.10*H to 0.90*H
        # Check badge: around x: 0.22*W to 0.34*W, y: 0.21*H to 0.46*H
        # Cross badge: around x: 0.65*W to 0.78*W, y: 0.21*H to 0.46*H
        crop_save(sheet_img, (0.21*W, 0.20*H, 0.35*W, 0.46*H), os.path.join(ui_dir, "badge-check.png"))
        crop_save(sheet_img, (0.65*W, 0.20*H, 0.79*W, 0.46*H), os.path.join(ui_dir, "badge-cross.png"))

    print("Asset pipeline completed successfully!")

def crop_save(img, box, dest_path):
    # Convert box coordinates to int
    box = [int(round(c)) for c in box]
    cropped = img.crop(box)
    
    # Trim transparent or pure white borders if needed
    # Convert to RGBA
    cropped = cropped.convert("RGBA")
    datas = cropped.getdata()
    
    # Optional: make pure white background transparent
    newData = []
    for item in datas:
        # If nearly pure white (#fefefe to #ffffff)
        if item[0] > 248 and item[1] > 248 and item[2] > 248:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
    cropped.putdata(newData)
    
    # Save as PNG
    cropped.save(dest_path, "PNG")
    print("Saved asset: " + os.path.basename(dest_path))

if __name__ == "__main__":
    main()
