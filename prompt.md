Awesome question. You can make beautiful, still-scannable custom QR codes a few different ways. Here’s the playbook, plus drop-in code.

# Quick plan

1. **Shorten your target URL** (own domain redirect if possible) → smaller, denser QR = more styling headroom.
2. **Generate base QR with high error correction (ECC = H)**.
3. **Export as SVG** (best for design tweaks) or PNG (for quick logo overlays).
4. **Add styling** (rounded dots, custom “eyes”, gradients) and **embed a logo** with a white “knockout” behind it.
5. **Keep it scannable** (rules below), then test on multiple phones/apps.

---

# No-code tools (fastest)

Look for features like: SVG export, logo overlay, gradients, corner styles (“eyes”), dynamic links, and analytics. Search for: **“QR code styling tool”** or **“QR code with logo generator”**—pick one that exports **SVG** and lets you set **ECC H**.

---

# Code options

## A) Browser/Node (highly customizable)

Use **qr-code-styling** (supports shapes, gradients, logo).

```js
// npm i qr-code-styling
import QRCodeStyling from "qr-code-styling";

const qr = new QRCodeStyling({
  width: 1024,
  height: 1024,
  type: "svg",
  data: "https://yourdomain.com/qr?to=promo", // use your short/dynamic URL
  qrOptions: { errorCorrectionLevel: "H" },
  image: "/path/to/logo.png", // optional logo
  imageOptions: { imageSize: 0.22, margin: 8, crossOrigin: "anonymous" }, // ~22% width
  dotsOptions: { type: "rounded", /* "dots","classy","classy-rounded","extra-rounded" */ },
  backgroundOptions: { color: "#FFFFFF" },
  cornersSquareOptions: { type: "extra-rounded" },
  cornersDotOptions: { type: "dot" },
  gradient: null // or supply linear/radial gradient if your lib version supports it
});

// In browser:
// qr.append(document.getElementById("qr"));
// Download:
// qr.download({ name: "custom-qr", extension: "svg" });
```

### Optional: Mask into a shape (SVG clipPath)

If you want the **overall silhouette** (e.g., circle/brand shape) without breaking readability:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <defs>
    <clipPath id="brandMask">
      <!-- Replace with your vector shape -->
      <circle cx="512" cy="512" r="500"/>
    </clipPath>
  </defs>
  <g clip-path="url(#brandMask)">
    <!-- paste the QR <svg> content here -->
  </g>
  <!-- Add your logo centered on top -->
  <rect x="362" y="362" width="300" height="300" fill="white" rx="24"/>
  <image x="387" y="387" width="250" height="250" href="logo.png"/>
</svg>
```

(You’re **clipping**, not warping modules—warping breaks scan reliability.)

---

## B) Python (quick logo overlay workflow)

```python
# pip install qrcode[pil] pillow
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageOps

DATA = "https://yourdomain.com/qr/offer"  # keep it short/dynamic
LOGO_PATH = "logo.png"

qr = qrcode.QRCode(
    version=None,  # let it fit automatically
    error_correction=ERROR_CORRECT_H,
    box_size=18,   # larger for print; 10–12 for screen
    border=4       # >= 4 modules quiet zone
)
qr.add_data(DATA)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")

# Logo overlay (~20–25% of QR width)
logo = Image.open(LOGO_PATH).convert("RGBA")
qr_w, qr_h = img.size
target_w = int(qr_w * 0.22)
logo.thumbnail((target_w, target_w), Image.LANCZOS)

# White knockout behind logo
pad = int(target_w * 0.12)
knockout = Image.new("RGBA", (logo.width + 2*pad, logo.height + 2*pad), "white")

# Composite centered
x = (qr_w - knockout.width)//2
y = (qr_h - knockout.height)//2
img.alpha_composite(knockout, (x, y))
img.alpha_composite(logo, (x+pad, y+pad))

img.save("custom_qr.png")  # for web use
```

For **vector output**, generate with `segno`:

```python
# pip install segno
import segno
q = segno.make(DATA, error='h', micro=False)
q.save('base.svg', scale=20, dark='black', light='white')  # edit SVG in Figma/Illustrator
```

---

# Design & scannability rules (super important)

* **ECC**: Use **H** (≈ up to 30% damage tolerance in theory; keep your overlay smaller: **≤ 22–25% QR width**).
* **Quiet zone**: Keep **≥ 4 modules** of clear margin all around; more if background is busy.
* **Don’t disturb** the **finder eyes** (the big squares in 3 corners) or the **timing pattern** (the dotted line). Styling is okay; distortion/misalignment is not.
* **Contrast**: Dark modules on a **light** background. Aim for ≥ 40% luminance difference. Avoid “inverted” (light modules on dark).
* **Minimum size**:

  * **Print**: module (single square) **≥ 0.9–1.2 mm**; overall code width often ≥ **25–30 mm** for hand-scan.
  * **Viewing distance rule of thumb**: Code width ≈ **scan distance / 10** (e.g., 2 m viewing → \~200 mm wide code).
* **Gradients/textures**: Keep them subtle in the **data area**; avoid transparency on critical elements.
* **Logo**: Add a **white knockout** under it; round the knockout corners to look intentional.
* **Testing**: Try multiple devices (iOS/Android), default camera apps, a few third-party scanners, **low light**, and **at angles**. Print and test at actual size.

---

# Dynamic links & tracking (recommended)

* Point the QR to **your short domain** (e.g., `qr.yourbrand.com/x`) that **redirects** to the real destination.
* Add **UTM parameters** for campaign analytics.
* This lets you **change the target later** without reprinting codes.

---

# Common “unique shapes” that still work

* **Rounded dots** or **“classy” corners** for modules.
* **Custom corner eyes** matching your brand shape.
* **Silhouette mask** (circle/leaf/badge) via SVG `clipPath` (do **not** warp modules).
* **Photo-fill** behind the code with a semi-transparent white panel under the modules.

---

# Workflow I recommend

1. Create a **short/dynamic URL**.
2. Generate **SVG QR (ECC H)**.
3. Apply **module style + corner style** in code (qr-code-styling) or edit in Figma/Illustrator.
4. Add **logo with knockout**.
5. Export **SVG (print)** and **PNG 1024–2048 px (digital)**.
6. **Test** aggressively; iterate style only if scans stay instant.

---

If you want, share:

* your target URL,
* a brand color, and
* a logo (PNG/SVG),

…and I’ll generate a couple of ready-to-use variants (clean vs. heavily styled) right here.
