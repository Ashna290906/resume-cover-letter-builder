import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ExportOptions({ resumeData, componentRef }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportAsPDF = async () => {
    if (!componentRef?.current) {
      console.error('Component reference is not available');
      alert('Error: Cannot access resume content. Please refresh and try again.');
      return;
    }

    setIsExporting(true);
    setExportProgress(10);

    try {
      console.log('Starting PDF export...');
      const element = componentRef.current;
      
      // Add a temporary class to ensure proper rendering
      element.classList.add('exporting-pdf');
      
      console.log('Creating canvas...');
      // Calculate optimal scale based on device pixel ratio
      const devicePixelRatio = window.devicePixelRatio || 1;
      const scale = devicePixelRatio >= 2 ? 2 : 1; // Use 2x scale for high DPI screens, 1x for others
      
      // Add viewport meta tag for better mobile rendering
      const metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(metaViewport);
      
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth * scale,
        windowHeight: element.scrollHeight * scale
      });
      
      // Remove the viewport meta tag after canvas creation
      metaViewport.remove();
      
      console.log('Canvas created, dimensions:', canvas.width, 'x', canvas.height);
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas has zero dimensions');
      }

      setExportProgress(50);
      console.log('Converting to image data...');
      
      const imgData = canvas.toDataURL('image/png');
      if (!imgData || imgData === 'data:,') {
        throw new Error('Failed to convert canvas to image data');
      }

      console.log('Creating PDF...');
      // Calculate optimal dimensions for mobile devices
      const maxWidth = Math.min(canvas.width, 1240); // Limit max width to A4 width in pixels (1240px)
      const maxHeight = Math.min(canvas.height, 1754); // Limit max height to A4 height in pixels (1754px)
      
      // Calculate scale factor to fit content within A4 dimensions
      const scaleWidth = maxWidth / canvas.width;
      const scaleHeight = maxHeight / canvas.height;
      const scaleFactor = Math.min(scaleWidth, scaleHeight);
      
      // Apply scaling to dimensions
      const scaledWidth = canvas.width * scaleFactor;
      const scaledHeight = canvas.height * scaleFactor;
      
      // Convert scaled dimensions to millimeters
      const widthInMM = (scaledWidth * 0.264583);
      const heightInMM = (scaledHeight * 0.264583);
      
      // Create PDF with proper dimensions and scaling
      const pdf = new jsPDF({
        orientation: widthInMM > heightInMM ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [widthInMM, heightInMM]
      });
      
      // Scale the image to fit within the PDF dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, widthInMM, heightInMM, undefined, 'FAST');

      console.log('Adding image to PDF...');
      pdf.addImage(imgData, 'PNG', 0, 0, widthInMM, heightInMM);
      setExportProgress(80);

      const fileName = `${resumeData?.personalInfo?.name || 'Resume'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
      console.log('Saving PDF as:', fileName);
      
      pdf.save(fileName);
      console.log('PDF saved successfully');
      setExportProgress(100);
    } catch (error) {
      console.error('Error in exportAsPDF:', error);
      alert(`Failed to export PDF: ${error.message || 'Unknown error'}`);
    } finally {
      // Clean up
      const element = componentRef.current;
      if (element) {
        element.classList.remove('exporting-pdf');
      }
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={exportAsPDF}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting PDF ({exportProgress}%)
            </>
          ) : (
            'Export as PDF'
          )}
        </button>
      </div>

      {isExporting && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${exportProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
