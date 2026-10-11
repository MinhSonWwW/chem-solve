import os
import cv2
import numpy as np
from PIL import Image

def remove_white_background(img_path, output_path=None, threshold=238, feather_pixels=2):
    if output_path is None:
        output_path = img_path

    img_bgr = cv2.imread(img_path)
    if img_bgr is None:
        print(f"Error reading {img_path}")
        return False

    h, w = img_bgr.shape[:2]

    # HSV color space
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    sat = hsv[:, :, 1]
    val = hsv[:, :, 2]
    
    # White background: low saturation and high value
    is_white_candidate = (sat < 35) & (val >= threshold)

    # Connected components from the 4 outer borders
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(is_white_candidate.astype(np.uint8), connectivity=8)

    border_pixels = np.concatenate([
        labels[0, :], labels[h - 1, :],
        labels[:, 0], labels[:, w - 1]
    ])
    border_labels = set(border_pixels)
    border_labels.discard(0)  # 0 is non-white foreground

    is_bg = np.isin(labels, list(border_labels))

    # Create alpha channel
    alpha = np.ones((h, w), dtype=np.float32)
    alpha[is_bg] = 0.0

    # Anti-aliasing / edge feathering along the transition border
    if feather_pixels > 0:
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        dilated_bg = cv2.dilate(is_bg.astype(np.uint8), kernel, iterations=feather_pixels)
        fringe = (dilated_bg > 0) & (~is_bg)

        for y, x in zip(*np.where(fringe)):
            v = float(val[y, x])
            if v > 180:
                alpha[y, x] = max(0.0, min(1.0, (float(threshold) - v) / (float(threshold) - 180.0)))

    # Color decontamination for semi-transparent border pixels
    bgr_clean = img_bgr.astype(np.float32).copy()
    m = (alpha < 1.0) & (alpha > 0.0)
    for c in range(3):
        bgr_clean[m, c] = np.clip(
            (bgr_clean[m, c] - (1.0 - alpha[m]) * 255.0) / np.maximum(alpha[m], 0.05),
            0.0,
            255.0
        )

    # Assemble RGBA
    rgba = np.dstack([
        bgr_clean.astype(np.uint8)[:, :, 0],  # B
        bgr_clean.astype(np.uint8)[:, :, 1],  # G
        bgr_clean.astype(np.uint8)[:, :, 2],  # R
        (alpha * 255).astype(np.uint8)        # A
    ])

    pil_img = Image.fromarray(cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA))
    pil_img.save(output_path, "PNG", optimize=True)
    return True

def process_all_directories():
    target_dirs = [
        'public/assets/mascot',
        'public/assets/roadmap',
        'public/assets/icons',
        'public/assets/ui',
        'public/assets/vfx'
    ]
    
    processed = []
    skipped = []

    for d in target_dirs:
        if not os.path.exists(d):
            continue
        for fname in os.listdir(d):
            if not fname.endswith('.png'):
                continue
            fpath = os.path.join(d, fname)
            
            # Check if image already has transparent alpha
            img = Image.open(fpath)
            needs_processing = False
            if img.mode != 'RGBA':
                needs_processing = True
            else:
                alpha = img.split()[-1]
                if alpha.getextrema()[0] == 255:
                    needs_processing = True

            img.close()

            if needs_processing:
                print(f"Processing: {fpath}...")
                ok = remove_white_background(fpath, fpath)
                if ok:
                    processed.append(fpath)
            else:
                skipped.append(fpath)

    print(f"\nDone! Processed: {len(processed)}, Skipped (already transparent): {len(skipped)}")

if __name__ == "__main__":
    # Clean up scratch test files if any
    for st in [
        'scratch_test_node-chest-completed.png',
        'scratch_test_bio-idle.png',
        'scratch_test_achievement-first-lesson.png'
    ]:
        if os.path.exists(st):
            os.remove(st)

    process_all_directories()
