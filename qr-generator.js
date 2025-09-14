// QR Code Generator with Dynamic Customization and Custom Logo Upload

let qrCode = null;
let dotGradientEnabled = false;
let dualLayerEnabled = false;
let currentLogoDataUrl = null;

// Base QR Code configuration
let currentExportSize = 1024;
const qrConfig = {
    width: 300,
    height: 300,
    type: "svg",
    data: "https://example.com",
    qrOptions: {
        errorCorrectionLevel: "H", // High error correction for logo overlay
        typeNumber: 0 // Auto-detect optimal size
    },
    imageOptions: {
        imageSize: 0.22,
        margin: 8,
        crossOrigin: "anonymous",
        hideBackgroundDots: true
    },
    dotsOptions: {
        type: "extra-rounded",
        color: "#2c3e50"
    },
    backgroundOptions: {
        color: "#ffffff"
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#c0392b"
    },
    cornersDotOptions: {
        type: "dot",
        color: "#2c3e50"
    }
};

// Fashion-inspired preset configurations
const presets = {
    professional: {
        dotShape: "classy",
        dotColor: "#2c3e50",
        cornerShape: "extra-rounded",
        cornerColor: "#34495e",
        cornerDotColor: "#2c3e50",
        backgroundColor: "#ffffff"
    },
    vibrant: {
        dotShape: "extra-rounded",
        dotColor: "#e74c3c",
        cornerShape: "extra-rounded",
        cornerColor: "#f39c12",
        cornerDotColor: "#e74c3c",
        backgroundColor: "#ffffff"
    },
    minimal: {
        dotShape: "square",
        dotColor: "#1a1a1a",
        cornerShape: "square",
        cornerColor: "#1a1a1a",
        cornerDotColor: "#1a1a1a",
        backgroundColor: "#ffffff"
    },
    corporate: {
        dotShape: "rounded",
        dotColor: "#3498db",
        cornerShape: "extra-rounded",
        cornerColor: "#2980b9",
        cornerDotColor: "#3498db",
        backgroundColor: "#f8f9fa"
    }
};

// Initialize QR Code
function initQRCode() {
    try {
        qrCode = new QRCodeStyling(qrConfig);
        qrCode.append(document.getElementById("qr-code"));
        console.log("Fashion QR Code generated successfully");
        updateFormFromConfig();
    } catch (error) {
        console.error("Error generating QR code:", error);
        showError("Failed to generate QR code. Please check console for details.");
    }
}

// Update QR Code based on form inputs
function updateQRCode() {
    const container = document.getElementById("qr-code");
    container.innerHTML = "";

    // Get current form values
    const config = getCurrentConfig();

    if (!config) {
        return; // Don't generate QR for empty content
    }

    try {
        qrCode = new QRCodeStyling(config);
        qrCode.append(container);
        console.log("QR Code updated with new styling");
    } catch (error) {
        console.error("Error updating QR code:", error);
        showError("Failed to update QR code");
    }
}

// Get current configuration from form inputs
function getCurrentConfig(exportMode = false) {
    const logoSize = document.getElementById("logoSize").value / 100;
    const logoMargin = document.getElementById("logoMargin").value;
    
    const size = exportMode ? currentExportSize : 300;
    
    const qrContent = document.getElementById("qrContent").value || "https://example.com";

    if (!qrContent.trim()) {
        return null;
    }
    
    const config = {
        width: size,
        height: size,
        type: "svg",
        data: qrContent,
        qrOptions: {
            errorCorrectionLevel: "H",
            typeNumber: 0
        },
        backgroundOptions: {
            color: document.getElementById("backgroundColor").value
        },
        dotsOptions: {
            type: document.getElementById("dotShape").value,
            color: document.getElementById("dotColor").value
        },
        cornersSquareOptions: {
            type: document.getElementById("cornerShape").value,
            color: document.getElementById("cornerColor").value
        },
        cornersDotOptions: {
            type: document.getElementById("cornerDotShape").value,
            color: document.getElementById("cornerDotColor").value
        }
    };
    
    // Add logo if uploaded
    if (currentLogoDataUrl) {
        config.image = currentLogoDataUrl;
        config.imageOptions = {
            imageSize: logoSize,
            margin: parseInt(logoMargin),
            crossOrigin: "anonymous",
            hideBackgroundDots: true
        };
    }
    
    // Add gradient if enabled (but not if dual layer is enabled)
    if (dotGradientEnabled && !dualLayerEnabled) {
        const gradientType = document.getElementById("dotGradientType").value;
        const color2 = document.getElementById("dotColor2").value;
        
        config.dotsOptions.gradient = {
            type: gradientType,
            rotation: gradientType === "linear" ? Math.PI / 4 : 0,
            colorStops: [
                { offset: 0, color: document.getElementById("dotColor").value },
                { offset: 1, color: color2 }
            ]
        };
    }
    
    // Add dual layer effect if enabled
    if (dualLayerEnabled) {
        const direction = document.getElementById("dualLayerDirection").value;
        const dualColor = document.getElementById("dotDualColor").value;
        const splitPosition = document.getElementById("dualLayerSplit").value / 100;
        const mainColor = document.getElementById("dotColor").value;
        
        let rotation = 0;
        
        switch(direction) {
            case 'horizontal':
                rotation = Math.PI / 2; // 90 degrees for horizontal split
                break;
            case 'vertical':
                rotation = 0; // 0 degrees for vertical split
                break;
            case 'diagonal':
                rotation = Math.PI / 4; // 45 degrees for diagonal
                break;
        }
        
        config.dotsOptions.gradient = {
            type: "linear",
            rotation: rotation,
            colorStops: [
                { offset: 0, color: mainColor },
                { offset: splitPosition - 0.01, color: mainColor },
                { offset: splitPosition, color: dualColor },
                { offset: 1, color: dualColor }
            ]
        };
    }
    
    return config;
}

// Update form inputs from current config
function updateFormFromConfig() {
    // This function would set form values based on current config
    // Called during initialization
}

// Color preset functions
function setDotColor(color) {
    document.getElementById("dotColor").value = color;
    updateQRCode();
}

function setCornerColor(color) {
    document.getElementById("cornerColor").value = color;
    updateQRCode();
}

// Toggle gradient functionality
function toggleDotGradient() {
    dotGradientEnabled = !dotGradientEnabled;
    const toggle = document.getElementById("dotGradientToggle");
    const controls = document.getElementById("dotGradientControls");
    
    // Disable dual layer if gradient is enabled
    if (dotGradientEnabled && dualLayerEnabled) {
        toggleDualLayer();
    }
    
    if (dotGradientEnabled) {
        toggle.textContent = "Disable Gradient";
        toggle.classList.remove("inactive");
        controls.classList.add("active");
    } else {
        toggle.textContent = "Enable Gradient";
        toggle.classList.add("inactive");
        controls.classList.remove("active");
    }
    
    updateQRCode();
}

// Toggle dual layer functionality
function toggleDualLayer() {
    dualLayerEnabled = !dualLayerEnabled;
    const toggle = document.getElementById("dotDualLayerToggle");
    const controls = document.getElementById("dotDualLayerControls");
    
    // Disable gradient if dual layer is enabled
    if (dualLayerEnabled && dotGradientEnabled) {
        toggleDotGradient();
    }
    
    if (dualLayerEnabled) {
        toggle.textContent = "Disable Dual Layer";
        toggle.classList.remove("inactive");
        controls.classList.add("active");
    } else {
        toggle.textContent = "Enable Dual Layer";
        toggle.classList.add("inactive");
        controls.classList.remove("active");
    }
    
    updateQRCode();
}

// Update split position label
function updateSplitLabel() {
    const value = document.getElementById("dualLayerSplit").value;
    document.getElementById("splitLabel").textContent = value + "%";
}

// Apply dual layer color presets
function applyDualLayerPreset(presetName) {
    const presets = {
        christmas: {
            color1: '#e74c3c', // Red
            color2: '#27ae60', // Green
            direction: 'horizontal',
            split: 50
        },
        sunset: {
            color1: '#f39c12', // Orange
            color2: '#e74c3c', // Red
            direction: 'vertical',
            split: 60
        },
        ocean: {
            color1: '#3498db', // Blue
            color2: '#2ecc71', // Green
            direction: 'horizontal',
            split: 40
        },
        royal: {
            color1: '#9b59b6', // Purple
            color2: '#f39c12', // Gold
            direction: 'diagonal',
            split: 50
        }
    };
    
    const preset = presets[presetName];
    if (!preset) return;
    
    // Enable dual layer if not already enabled
    if (!dualLayerEnabled) {
        toggleDualLayer();
    }
    
    // Apply preset values
    document.getElementById('dotColor').value = preset.color1;
    document.getElementById('dotDualColor').value = preset.color2;
    document.getElementById('dualLayerDirection').value = preset.direction;
    document.getElementById('dualLayerSplit').value = preset.split;
    
    updateSplitLabel();
    updateQRCode();
    showSuccess(`Applied ${presetName} dual-layer preset!`);
}

// Update slider labels
function updateLogoSizeLabel() {
    const value = document.getElementById("logoSize").value;
    document.getElementById("logoSizeLabel").textContent = value + "%";
}

function updateLogoMarginLabel() {
    const value = document.getElementById("logoMargin").value;
    document.getElementById("logoMarginLabel").textContent = value + "px";
}

// Content presets
function usePresetContent(type) {
    const qrContentInput = document.getElementById("qrContent");
    let content = "";
    
    switch(type) {
        case 'contact':
            content = "https://example.com/contact";
            break;
        case 'website':
            content = "https://example.com";
            break;
        case 'email':
            content = "mailto:contact@example.com";
            break;
        case 'phone':
            content = "tel:+1234567890";
            break;
        case 'wifi':
            content = "WIFI:T:WPA;S:NetworkName;P:password123;;";
            break;
        case 'text':
            content = "Enter your custom text here!";
            break;
        default:
            content = "https://example.com";
    }
    
    qrContentInput.value = content;
    updateQRCode();
    showSuccess(`Applied ${type} preset!`);
}

// Apply preset configurations
function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;
    
    // Update form inputs
    document.getElementById("dotShape").value = preset.dotShape;
    document.getElementById("dotColor").value = preset.dotColor;
    document.getElementById("cornerShape").value = preset.cornerShape;
    document.getElementById("cornerColor").value = preset.cornerColor;
    document.getElementById("cornerDotColor").value = preset.cornerDotColor;
    document.getElementById("backgroundColor").value = preset.backgroundColor;
    
    // Disable gradient and dual layer for presets
    if (dotGradientEnabled) {
        toggleDotGradient();
    }
    if (dualLayerEnabled) {
        toggleDualLayer();
    }
    
    updateQRCode();
    showSuccess(`Applied ${presetName} preset!`);
}

// Reset to default configuration
function resetToDefault() {
    // Reset form to default values
    document.getElementById("dotShape").value = "extra-rounded";
    document.getElementById("dotColor").value = "#2c3e50";
    document.getElementById("cornerShape").value = "extra-rounded";
    document.getElementById("cornerColor").value = "#c0392b";
    document.getElementById("cornerDotShape").value = "dot";
    document.getElementById("cornerDotColor").value = "#2c3e50";
    document.getElementById("backgroundColor").value = "#ffffff";
    document.getElementById("logoSize").value = 22;
    document.getElementById("logoMargin").value = 8;
    // Reset logo upload
    currentLogoDataUrl = null;
    document.getElementById("logoUpload").value = "";
    document.getElementById("logoControls").style.display = "none";
    document.getElementById("logoActions").style.display = "none";
    
    // Reset gradient and dual layer
    if (dotGradientEnabled) {
        toggleDotGradient();
    }
    if (dualLayerEnabled) {
        toggleDualLayer();
    }
    
    // Reset dual layer controls
    document.getElementById("dualLayerDirection").value = "horizontal";
    document.getElementById("dotDualColor").value = "#27ae60";
    document.getElementById("dualLayerSplit").value = 50;
    updateSplitLabel();
    
    updateLogoSizeLabel();
    updateLogoMarginLabel();
    updateQRCode();
    showSuccess("Reset to default configuration!");
}

// Export size management
function updateExportSize() {
    const exportSizeSelect = document.getElementById("exportSize");
    const customSizeGroup = document.getElementById("customSizeGroup");
    const customSizeInput = document.getElementById("customSize");
    
    if (exportSizeSelect.value === "custom") {
        customSizeGroup.style.display = "flex";
        currentExportSize = parseInt(customSizeInput.value);
    } else {
        customSizeGroup.style.display = "none";
        currentExportSize = parseInt(exportSizeSelect.value);
    }
}

// Update custom size
function updateCustomSize() {
    const customSize = document.getElementById("customSize").value;
    currentExportSize = parseInt(customSize);
}

// Generate QR code for export with specific size
function generateExportQR(size) {
    const config = getCurrentConfig(true);
    config.width = size;
    config.height = size;
    
    // Wait a moment for the QR to render before downloading
    const tempQR = new QRCodeStyling(config);
    return tempQR;
}

// Download functions
function downloadSVG() {
    try {
        const exportQR = generateExportQR(currentExportSize);
        
        // Small delay to ensure QR is fully generated
        setTimeout(() => {
            exportQR.download({
                name: `qr-code-${currentExportSize}px`,
                extension: "svg"
            });
            showSuccess(`SVG downloaded successfully! (${currentExportSize}px)`);
        }, 100);
    } catch (error) {
        console.error("Error downloading SVG:", error);
        showError("Failed to download SVG");
    }
}

function downloadPNG() {
    try {
        const exportQR = generateExportQR(currentExportSize);
        
        // Small delay to ensure QR is fully generated
        setTimeout(() => {
            exportQR.download({
                name: `qr-code-${currentExportSize}px`,
                extension: "png"
            });
            showSuccess(`PNG downloaded successfully! (${currentExportSize}px)`);
        }, 100);
    } catch (error) {
        console.error("Error downloading PNG:", error);
        showError("Failed to download PNG");
    }
}

// Download multiple sizes pack
function downloadMultipleSizes() {
    const sizes = {
        "512px-social": 512,
        "1024px-standard": 1024,
        "2048px-hq": 2048,
        "4096px-print": 4096
    };
    
    let downloadCount = 0;
    const totalDownloads = Object.keys(sizes).length * 2; // SVG + PNG for each size
    
    showSuccess(`Starting download pack (${totalDownloads} files)...`);
    
    Object.entries(sizes).forEach(([suffix, size]) => {
        try {
            const exportQR = generateExportQR(size);
            
            // Download SVG
            setTimeout(() => {
                exportQR.download({
                    name: `qr-code-${suffix}`,
                    extension: "svg"
                });
                downloadCount++;
                
                if (downloadCount === totalDownloads) {
                    setTimeout(() => showSuccess("Download pack completed!"), 1000);
                }
            }, downloadCount * 200);
            
            // Download PNG
            setTimeout(() => {
                const exportQRPng = generateExportQR(size);
                exportQRPng.download({
                    name: `qr-code-${suffix}`,
                    extension: "png"
                });
                downloadCount++;
                
                if (downloadCount === totalDownloads) {
                    setTimeout(() => showSuccess("Download pack completed!"), 1000);
                }
            }, (downloadCount + 1) * 200);
        } catch (error) {
            console.error(`Error downloading ${suffix}:`, error);
        }
    });
}

// Success message
function showSuccess(message) {
    const successDiv = document.createElement("div");
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Error message
function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showError("Logo file too large. Please use a file under 5MB.");
        return;
    }

    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|svg\+xml)$/)) {
        showError("Please upload a valid image file (PNG, JPG, GIF, SVG).");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        currentLogoDataUrl = e.target.result;
        document.getElementById("logoControls").style.display = "flex";
        document.getElementById("logoActions").style.display = "flex";
        updateQRCode();
        showSuccess("Logo uploaded successfully!");
    };
    reader.onerror = function() {
        showError("Failed to read logo file.");
    };
    reader.readAsDataURL(file);
}

// Remove logo
function removeLogo() {
    currentLogoDataUrl = null;
    document.getElementById("logoUpload").value = "";
    document.getElementById("logoControls").style.display = "none";
    document.getElementById("logoActions").style.display = "none";
    updateQRCode();
    showSuccess("Logo removed!");
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing QR Code Generator...");
    
    // Initialize controls
    updateLogoSizeLabel();
    updateLogoMarginLabel();
    updateExportSize();
    updateSplitLabel();
    
    // Add event listener for custom size input
    const customSizeInput = document.getElementById("customSize");
    if (customSizeInput) {
        customSizeInput.addEventListener("input", updateCustomSize);
    }
    
    // Initialize QR Code and drag-and-drop
    setupDragAndDrop();
    initQRCode();
});

// Handle drag and drop for logo upload
function setupDragAndDrop() {
    const logoUpload = document.getElementById("logoUpload");
    const container = logoUpload.parentElement;

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.style.backgroundColor = '#f0f8ff';
        container.style.borderColor = '#007bff';
    });

    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        container.style.backgroundColor = '';
        container.style.borderColor = '#ddd';
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.style.backgroundColor = '';
        container.style.borderColor = '#ddd';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            logoUpload.files = files;
            handleLogoUpload({ target: { files: files } });
        }
    });
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);