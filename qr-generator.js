// QR Code Generator with Dynamic Customization and Custom Logo Upload

let qrCode = null;
let dotGradientEnabled = false;
let dualLayerEnabled = false;
let currentLogoDataUrl = null;
let batchQRCodes = [];
let batchData = [];
let qrHistory = [];
let currentHistoryFilter = '';

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
            type: document.querySelector('input[name="dotShape"]:checked')?.value || 'rounded',
            color: document.getElementById("dotColor").value
        },
        cornersSquareOptions: {
            type: document.querySelector('input[name="cornerShape"]:checked')?.value || 'extra-rounded',
            color: document.getElementById("cornerColor").value
        },
        cornersDotOptions: {
            type: document.querySelector('input[name="cornerDotShape"]:checked')?.value || 'dot',
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
        const gradientType = document.querySelector('input[name="dotGradientType"]:checked')?.value || 'linear';
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
        const direction = document.querySelector('input[name="dualLayerDirection"]:checked')?.value || 'horizontal';
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
    document.querySelector(`input[name="dualLayerDirection"][value="${preset.direction}"]`).checked = true;
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
    document.querySelector(`input[name="dotShape"][value="${preset.dotShape}"]`).checked = true;
    document.getElementById("dotColor").value = preset.dotColor;
    document.querySelector(`input[name="cornerShape"][value="${preset.cornerShape}"]`).checked = true;
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
    document.querySelector('input[name="dotShape"][value="rounded"]').checked = true;
    document.getElementById("dotColor").value = "#2c3e50";
    document.querySelector('input[name="cornerShape"][value="extra-rounded"]').checked = true;
    document.getElementById("cornerColor").value = "#c0392b";
    document.querySelector('input[name="cornerDotShape"][value="dot"]').checked = true;
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
    document.querySelector('input[name="dualLayerDirection"][value="horizontal"]').checked = true;
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
    
    // Initialize QR Code, drag-and-drop, and history
    setupDragAndDrop();
    loadHistory();
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

// Batch QR Code Generation Functions

// Handle batch file upload
function handleBatchUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError("Batch file too large. Please use a file under 10MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;

        if (file.name.toLowerCase().endsWith('.csv')) {
            processBatchCSV(content);
        } else {
            processBatchTextContent(content);
        }
    };
    reader.onerror = function() {
        showError("Failed to read batch file.");
    };
    reader.readAsText(file);
}

// Process CSV content
function processBatchCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const data = [];

    lines.forEach((line, index) => {
        const columns = line.split(',').map(col => col.trim());
        if (columns.length >= 1) {
            const url = columns.length >= 2 ? columns[1] : columns[0];
            const name = columns.length >= 2 ? columns[0] : `QR Code ${index + 1}`;

            if (url) {
                data.push({ name: name, url: url });
            }
        }
    });

    if (data.length === 0) {
        showError("No valid URLs found in CSV file.");
        return;
    }

    batchData = data;
    document.getElementById("batchActions").style.display = "flex";
    document.getElementById("batchInput").value = data.map(item => item.url).join('\n');
    showSuccess(`Loaded ${data.length} URLs from CSV file.`);
}

// Process text content
function processBatchTextContent(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const data = [];

    lines.forEach((line, index) => {
        const url = line.trim();
        if (url) {
            data.push({ name: `QR Code ${index + 1}`, url: url });
        }
    });

    if (data.length === 0) {
        showError("No valid URLs found.");
        return;
    }

    batchData = data;
    document.getElementById("batchActions").style.display = "flex";
    showSuccess(`Loaded ${data.length} URLs.`);
}

// Process batch text from textarea
function processBatchText() {
    const content = document.getElementById("batchInput").value;
    if (!content.trim()) {
        document.getElementById("batchActions").style.display = "none";
        batchData = [];
        return;
    }

    processBatchTextContent(content);
}

// Generate batch QR codes
function generateBatchQRs() {
    if (batchData.length === 0) {
        showError("No URLs to process.");
        return;
    }

    const container = document.getElementById("batchQRContainer");
    const preview = document.getElementById("batchPreview");
    const progress = document.getElementById("batchProgress");
    const downloadBtn = document.getElementById("downloadBatchBtn");

    container.innerHTML = "";
    preview.style.display = "block";
    downloadBtn.disabled = true;
    batchQRCodes = [];

    let processed = 0;
    const total = batchData.length;

    showSuccess(`Starting batch generation of ${total} QR codes...`);

    batchData.forEach((item, index) => {
        setTimeout(() => {
            try {
                const config = getCurrentConfig();
                config.data = item.url;
                config.width = 200;
                config.height = 200;

                const qrCode = new QRCodeStyling(config);

                const itemDiv = document.createElement('div');
                itemDiv.style.cssText = `
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                    background: white;
                `;

                const qrDiv = document.createElement('div');
                qrDiv.style.cssText = `
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 10px;
                    border: 1px solid #eee;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const nameDiv = document.createElement('div');
                nameDiv.textContent = item.name;
                nameDiv.style.cssText = `
                    font-size: 12px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                    word-break: break-word;
                `;

                const urlDiv = document.createElement('div');
                urlDiv.textContent = item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url;
                urlDiv.style.cssText = `
                    font-size: 10px;
                    color: #666;
                    word-break: break-word;
                `;

                itemDiv.appendChild(nameDiv);
                itemDiv.appendChild(qrDiv);
                itemDiv.appendChild(urlDiv);
                container.appendChild(itemDiv);

                qrCode.append(qrDiv);

                // Store for download
                batchQRCodes.push({
                    name: item.name,
                    url: item.url,
                    qrCode: qrCode
                });

                processed++;
                progress.textContent = `${processed}/${total} generated`;

                if (processed === total) {
                    downloadBtn.disabled = false;
                    showSuccess(`Batch generation complete! Generated ${total} QR codes.`);
                    progress.textContent = `${total} QR codes ready for download`;
                }

            } catch (error) {
                console.error(`Error generating QR for ${item.url}:`, error);
                processed++;
                progress.textContent = `${processed}/${total} processed (${processed - batchQRCodes.length} errors)`;
            }
        }, index * 100); // Stagger generation to avoid overwhelming the browser
    });
}

// Download all batch QR codes
function downloadAllBatch() {
    if (batchQRCodes.length === 0) {
        showError("No QR codes to download.");
        return;
    }

    let downloaded = 0;
    const total = batchQRCodes.length;

    showSuccess(`Starting download of ${total} QR codes...`);

    batchQRCodes.forEach((item, index) => {
        setTimeout(() => {
            try {
                // Download PNG
                item.qrCode.download({
                    name: `${item.name.replace(/[^a-zA-Z0-9]/g, '_')}_qr`,
                    extension: "png"
                });

                downloaded++;
                document.getElementById("batchProgress").textContent = `Downloaded ${downloaded}/${total}`;

                if (downloaded === total) {
                    setTimeout(() => {
                        showSuccess(`Batch download complete! Downloaded ${total} QR codes.`);
                    }, 1000);
                }
            } catch (error) {
                console.error(`Error downloading ${item.name}:`, error);
                downloaded++;
            }
        }, index * 300); // Stagger downloads
    });
}

// QR Code History & Favorites Functions

// Load history from localStorage
function loadHistory() {
    try {
        const saved = localStorage.getItem('qr-history');
        qrHistory = saved ? JSON.parse(saved) : [];
        updateHistoryDisplay();
    } catch (error) {
        console.error('Error loading history:', error);
        qrHistory = [];
    }
}

// Save history to localStorage
function saveHistory() {
    try {
        localStorage.setItem('qr-history', JSON.stringify(qrHistory));
    } catch (error) {
        console.error('Error saving history:', error);
        showError('Failed to save history (storage full?)');
    }
}

// Save current QR code configuration
function saveCurrentQR() {
    const content = document.getElementById('qrContent').value.trim();
    if (!content) {
        showError('Please enter some content first.');
        return;
    }

    const config = {
        content: content,
        dotShape: document.querySelector('input[name="dotShape"]:checked').value,
        dotColor: document.getElementById('dotColor').value,
        cornerShape: document.querySelector('input[name="cornerShape"]:checked').value,
        cornerColor: document.getElementById('cornerColor').value,
        cornerDotColor: document.getElementById('cornerDotColor').value,
        backgroundColor: document.getElementById('backgroundColor').value,
        logoSize: document.getElementById('logoSize').value,
        logoMargin: document.getElementById('logoMargin').value,
        hasLogo: !!currentLogoDataUrl,
        timestamp: Date.now(),
        favorite: false
    };

    // Check if already exists
    const existingIndex = qrHistory.findIndex(item => item.content === content);
    if (existingIndex !== -1) {
        qrHistory[existingIndex] = config;
        showSuccess('QR code updated in history!');
    } else {
        qrHistory.unshift(config); // Add to beginning
        showSuccess('QR code saved to history!');
    }

    // Limit history to 100 items
    if (qrHistory.length > 100) {
        qrHistory = qrHistory.slice(0, 100);
    }

    saveHistory();
    updateHistoryDisplay();
}

// Toggle history view
function toggleHistoryView() {
    const section = document.getElementById('historySection');
    const isVisible = section.style.display !== 'none';

    if (isVisible) {
        section.style.display = 'none';
    } else {
        section.style.display = 'block';
        updateHistoryDisplay();
    }
}

// Update history display
function updateHistoryDisplay() {
    const container = document.getElementById('historyContainer');
    const countSpan = document.getElementById('historyCount');

    countSpan.textContent = qrHistory.length;

    if (qrHistory.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No saved QR codes yet</div>';
        return;
    }

    const filteredHistory = currentHistoryFilter
        ? qrHistory.filter(item =>
            item.content.toLowerCase().includes(currentHistoryFilter.toLowerCase())
          )
        : qrHistory;

    if (filteredHistory.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No matching QR codes found</div>';
        return;
    }

    const itemsHTML = filteredHistory.map((item, index) => {
        const date = new Date(item.timestamp).toLocaleDateString();
        const time = new Date(item.timestamp).toLocaleTimeString();
        const truncatedContent = item.content.length > 40
            ? item.content.substring(0, 40) + '...'
            : item.content;

        return `
            <div style="border: 1px solid #ddd; border-radius: 6px; padding: 10px; margin-bottom: 10px; background: white; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #333; font-size: 13px; word-break: break-word;">${truncatedContent}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 4px;">${date} at ${time}</div>
                    </div>
                    <button onclick="toggleFavorite(${qrHistory.indexOf(item)})"
                            style="background: none; border: none; font-size: 16px; cursor: pointer; margin-left: 10px;"
                            title="${item.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                        ${item.favorite ? '⭐' : '☆'}
                    </button>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <span style="background: ${item.dotColor}; width: 15px; height: 15px; border-radius: 3px; display: inline-block;" title="Dot color"></span>
                    <span style="background: ${item.cornerColor}; width: 15px; height: 15px; border-radius: 3px; display: inline-block;" title="Corner color"></span>
                    <span style="background: ${item.backgroundColor}; width: 15px; height: 15px; border-radius: 3px; border: 1px solid #ddd; display: inline-block;" title="Background color"></span>
                    ${item.hasLogo ? '<span style="font-size: 12px; color: #666;">📷 Logo</span>' : ''}
                </div>
                <div style="display: flex; gap: 6px; margin-top: 8px;">
                    <button onclick="loadHistoryItem(${qrHistory.indexOf(item)})"
                            style="background: #3498db; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Load
                    </button>
                    <button onclick="duplicateHistoryItem(${qrHistory.indexOf(item)})"
                            style="background: #f39c12; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Duplicate
                    </button>
                    <button onclick="deleteHistoryItem(${qrHistory.indexOf(item)})"
                            style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = itemsHTML;
}

// Load a history item
function loadHistoryItem(index) {
    const item = qrHistory[index];
    if (!item) return;

    // Load configuration
    document.getElementById('qrContent').value = item.content;
    document.querySelector(`input[name="dotShape"][value="${item.dotShape}"]`).checked = true;
    document.getElementById('dotColor').value = item.dotColor;
    document.querySelector(`input[name="cornerShape"][value="${item.cornerShape}"]`).checked = true;
    document.getElementById('cornerColor').value = item.cornerColor;
    document.getElementById('cornerDotColor').value = item.cornerDotColor;
    document.getElementById('backgroundColor').value = item.backgroundColor;
    document.getElementById('logoSize').value = item.logoSize;
    document.getElementById('logoMargin').value = item.logoMargin;

    updateLogoSizeLabel();
    updateLogoMarginLabel();
    updateQRCode();
    showSuccess('QR configuration loaded!');
}

// Duplicate a history item
function duplicateHistoryItem(index) {
    const item = qrHistory[index];
    if (!item) return;

    const duplicate = { ...item };
    duplicate.timestamp = Date.now();
    duplicate.content = `${item.content} (copy)`;
    duplicate.favorite = false;

    qrHistory.unshift(duplicate);
    saveHistory();
    updateHistoryDisplay();
    showSuccess('QR code duplicated!');
}

// Delete a history item
function deleteHistoryItem(index) {
    if (index < 0 || index >= qrHistory.length) return;

    if (confirm('Are you sure you want to delete this QR code from history?')) {
        qrHistory.splice(index, 1);
        saveHistory();
        updateHistoryDisplay();
        showSuccess('QR code deleted from history.');
    }
}

// Toggle favorite status
function toggleFavorite(index) {
    const item = qrHistory[index];
    if (!item) return;

    item.favorite = !item.favorite;
    saveHistory();
    updateHistoryDisplay();
    showSuccess(item.favorite ? 'Added to favorites!' : 'Removed from favorites.');
}

// Filter history
function filterHistory() {
    currentHistoryFilter = document.getElementById('historySearch').value;
    updateHistoryDisplay();
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all QR code history? This cannot be undone.')) {
        qrHistory = [];
        saveHistory();
        updateHistoryDisplay();
        showSuccess('History cleared.');
    }
}

// vCard Builder Functions

// Show vCard builder modal
function showVCardBuilder() {
    document.getElementById('vcardModal').style.display = 'block';
    // Clear previous values
    document.getElementById('vcardFirstName').value = '';
    document.getElementById('vcardLastName').value = '';
    document.getElementById('vcardOrg').value = '';
    document.getElementById('vcardTitle').value = '';
    document.getElementById('vcardPhone').value = '';
    document.getElementById('vcardEmail').value = '';
    document.getElementById('vcardUrl').value = '';
    document.getElementById('vcardAddress').value = '';
    document.getElementById('vcardNotes').value = '';
    document.getElementById('vcardPreview').style.display = 'none';
}

// Close vCard builder modal
function closeVCardBuilder() {
    document.getElementById('vcardModal').style.display = 'none';
}

// Handle ESC key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('vcardModal');
        if (modal && modal.style.display === 'block') {
            closeVCardBuilder();
        }
    }
});

// Generate vCard content
function buildVCardContent() {
    const firstName = document.getElementById('vcardFirstName').value.trim();
    const lastName = document.getElementById('vcardLastName').value.trim();
    const org = document.getElementById('vcardOrg').value.trim();
    const title = document.getElementById('vcardTitle').value.trim();
    const phone = document.getElementById('vcardPhone').value.trim();
    const email = document.getElementById('vcardEmail').value.trim();
    const url = document.getElementById('vcardUrl').value.trim();
    const address = document.getElementById('vcardAddress').value.trim();
    const notes = document.getElementById('vcardNotes').value.trim();

    if (!firstName || !lastName) {
        throw new Error('First name and last name are required.');
    }

    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `FN:${firstName} ${lastName}\n`;
    vcard += `N:${lastName};${firstName};;;\n`;

    if (org) {
        vcard += `ORG:${org}\n`;
    }

    if (title) {
        vcard += `TITLE:${title}\n`;
    }

    if (phone) {
        vcard += `TEL:${phone}\n`;
    }

    if (email) {
        vcard += `EMAIL:${email}\n`;
    }

    if (url) {
        vcard += `URL:${url}\n`;
    }

    if (address) {
        vcard += `ADR:;;${address};;;;\n`;
    }

    if (notes) {
        vcard += `NOTE:${notes}\n`;
    }

    vcard += 'END:VCARD';
    return vcard;
}

// Preview vCard content
function previewVCard() {
    try {
        const vcard = buildVCardContent();
        const preview = document.getElementById('vcardPreview');
        preview.textContent = vcard;
        preview.style.display = 'block';
    } catch (error) {
        showError(error.message);
    }
}

// Generate vCard QR code
function generateVCard() {
    try {
        const vcard = buildVCardContent();
        document.getElementById('qrContent').value = vcard;
        updateQRCode();
        closeVCardBuilder();
        showSuccess('Contact vCard QR code generated!');
    } catch (error) {
        showError(error.message);
    }
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