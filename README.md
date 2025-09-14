# 🎨 QR Code Generator

**🌐 Live App: https://qr-maker-psi.vercel.app/**

A powerful, feature-rich QR code generator with custom styling, batch processing, and advanced management tools. Create beautiful, professional QR codes with custom logos, colors, and effects - all running entirely in your browser with no server required.

![QR Generator Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Version](https://img.shields.io/badge/Version-2.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features Overview

### 🎯 **Core QR Generation**
- **Real-time Generation**: QR codes update instantly as you type
- **High Error Correction**: Level H (30% damage tolerance) for reliable scanning
- **Multiple Content Types**: URLs, text, email, phone, WiFi, and contact cards
- **Custom Sizing**: Export from 256px to 8K (8192px) for any use case

### 🎨 **Visual Customization**
- **Custom Logo Upload**: Drag & drop your own logos with size and margin control
- **Shape Options**: 6 different dot styles (Square, Dots, Rounded, Extra Rounded, Classy, Classy Rounded)
- **Color Schemes**: Full color picker for dots, corners, and background
- **Gradient Effects**: Linear and radial gradients with dual colors
- **Dual-Layer Effects**: Split colors with horizontal, vertical, or diagonal layouts
- **Professional Presets**: Pre-designed themes (Professional, Vibrant, Minimal, Corporate)

### 📦 **Batch Processing**
- **CSV Upload**: Process multiple QR codes from spreadsheet data
- **Text Lists**: Paste multiple URLs (one per line)
- **Bulk Export**: Download all generated QR codes at once
- **Progress Tracking**: Real-time generation and download progress
- **Grid Preview**: See all generated QR codes in an organized layout

### 💾 **History & Management**
- **Local Storage**: All history saved in your browser (no server required)
- **Search & Filter**: Find specific QR codes quickly
- **Favorites System**: Star important QR codes for quick access
- **Load & Duplicate**: Reuse previous configurations instantly
- **Export History**: Download your QR code collection
- **Auto-Save**: Configurations saved automatically

### 📱 **Contact Cards (vCard)**
- **Professional Builder**: Create contact QR codes with a dedicated form
- **Complete Contact Info**: Name, company, title, phone, email, website, address, notes
- **vCard 3.0 Standard**: Compatible with all modern devices and apps
- **Preview Mode**: See the generated vCard data before creating QR code

### 🔧 **Export Options**
- **Multiple Formats**: PNG (raster) and SVG (vector) support
- **Size Presets**: Social Media (512px), Standard (1024px), High Quality (2048px), Print Ready (4096px)
- **Custom Sizes**: Any size from 256px to 8192px
- **Batch Downloads**: Download entire collections with one click
- **Optimized Files**: Clean filenames and efficient file sizes

## 🚀 Getting Started

### **🌐 Online Use (Recommended)**
Simply visit **https://qr-maker-psi.vercel.app/** - no installation required!

### **💻 Local Development**
```bash
# Clone the repository
git clone https://github.com/r4z33n4l1/qr-maker.git
cd qr-maker

# Start local server
python3 -m http.server 8000
# or
npm run dev

# Open in browser
open http://localhost:8000
```

## 📖 How to Use

### **Basic QR Code Creation**
1. **Enter Content**: Type your URL, text, or data in the input field
2. **Customize Style**: Choose colors, shapes, and effects using the radio buttons
3. **Upload Logo** (optional): Drag & drop your logo file or click to browse
4. **Export**: Download as PNG or SVG in your preferred size

### **Batch QR Generation**
1. **Prepare Data**: Create a CSV file with format: `name,url` or prepare a text list
2. **Upload/Paste**: Use the batch section to upload CSV or paste text
3. **Generate**: Click "Generate Batch QRs" to create all codes
4. **Download**: Use "Download All" to get the complete collection

### **Contact Cards (vCard)**
1. **Click Contact Button**: In the content type options
2. **Fill Form**: Enter contact details in the modal
3. **Preview** (optional): Check the vCard format
4. **Generate**: Create the contact QR code
5. **Test**: Scan with your phone to add the contact

### **Managing History**
1. **Save Current**: Click "Save Current" to store your QR configuration
2. **View History**: Toggle history panel to see saved codes
3. **Search**: Use the search box to find specific QR codes
4. **Favorites**: Star important QR codes for quick access
5. **Load/Duplicate**: Reuse or copy previous configurations

## 💡 Pro Tips

### **For Best Scanning Results**
- Use high contrast colors (dark QR on light background)
- Keep logos under 25% of QR size for optimal scanning
- Test QR codes on different devices before printing
- Maintain minimum size of 2cm (0.8") for printed materials

### **File Organization**
- Use descriptive names when saving to history
- Favorite frequently-used QR codes for quick access
- Export important QR codes as backups
- Use batch generation for events or campaigns

### **Performance Optimization**
- Clear history periodically (limit: 100 saved codes)
- Close batch preview after downloading to free memory
- Use standard sizes for faster generation
- Avoid extremely large custom sizes unless necessary

## 🗄️ Data Storage

### **Local Storage (Browser)**
- **QR History**: Saved in `localStorage` - persistent across sessions
- **Configurations**: Colors, shapes, and settings remembered
- **Uploaded Logos**: Processed in memory only (not stored permanently)
- **Privacy**: All data stays on your device, never sent to servers

### **File Exports**
- **QR Codes**: Downloaded to your default downloads folder
- **Batch Downloads**: Multiple files with organized naming
- **Format**: `qr-code-{size}px.png/svg` or `{name}_qr.png` for batch

## 🛠️ Technical Specifications

### **Browser Compatibility**
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **File Support**
- **Logo Upload**: PNG, JPG, GIF, SVG (max 5MB)
- **Batch Input**: CSV, TXT files (max 10MB)
- **Export**: PNG (raster), SVG (vector)

### **QR Code Specifications**
- **Error Correction**: Level H (30% recovery capability)
- **Version**: Auto-detected based on content length
- **Encoding**: UTF-8 for international characters
- **Standards**: ISO/IEC 18004:2015 compliant

## 🔒 Privacy & Security

- **No Data Collection**: Zero user data sent to external servers
- **Local Processing**: All QR generation happens in your browser
- **No Registration**: No accounts, passwords, or personal information required
- **Open Source**: Full code available for review on GitHub
- **No Tracking**: No analytics, cookies, or user tracking

## 📱 Mobile Experience

- **Responsive Design**: Optimized for phones and tablets
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Drag & Drop**: Works on mobile with file picker fallback
- **Offline Ready**: Works without internet after first load
- **Share Integration**: Easy sharing of generated QR codes

## 🆘 Troubleshooting

### **QR Code Not Generating**
- Ensure content is not empty
- Check browser console for errors
- Try refreshing the page
- Clear browser cache if issues persist

### **Logo Not Appearing**
- Check file format (PNG, JPG, GIF, SVG only)
- Ensure file size is under 5MB
- Try a different image file
- Verify logo controls are visible after upload

### **Batch Generation Issues**
- Check CSV format: `name,url` (comma-separated)
- Ensure URLs are complete (include http/https)
- Limit batch size for better performance
- Check browser memory if generation stops

### **Export Problems**
- Allow pop-ups and downloads in browser settings
- Check available disk space
- Try smaller export sizes
- Use different browser if downloads fail

## 🤝 Contributing

Found a bug or want to suggest a feature?
1. **GitHub Issues**: https://github.com/r4z33n4l1/qr-maker/issues
2. **Fork & Pull Request**: Contributions welcome!
3. **Feature Requests**: Use GitHub issues with "enhancement" label

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🔗 Links

- **🌐 Live App**: https://qr-maker-psi.vercel.app/
- **📁 GitHub**: https://github.com/r4z33n4l1/qr-maker
- **🐛 Report Issues**: https://github.com/r4z33n4l1/qr-maker/issues
- **📖 Documentation**: This README file

---

**Made with ❤️ for the community | Powered by qr-code-styling library**