import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export default function CoverLetterExport({ coverLetterData }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportAsWord = async () => {
    if (!coverLetterData) {
      alert('No cover letter data available to export');
      return;
    }
    
    // Ensure workExperience exists on coverLetterData
    if (!coverLetterData.workExperience) {
      coverLetterData.workExperience = [];
    }

    setIsExporting(true);
    setExportProgress(10);

    try {
      // Create a new Document
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: {
                width: 11906, // A4 width in twentieths of a point
                height: 16838, // A4 height in twentieths of a point
              },
              margin: {
                top: 1440,    // 1 inch
                right: 1440,  // 1 inch
                bottom: 1440, // 1 inch
                left: 1440,   // 1 inch
              },
            },
          },
          children: [
            // Sender's Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: coverLetterData.personalInfo.name || '',
                  size: 22,
                }),
                new TextRun({
                  text: '\n' + (coverLetterData.personalInfo.location || ''),
                  size: 22,
                }),
                new TextRun({
                  text: '\n' + (coverLetterData.personalInfo.email || ''),
                  size: 22,
                }),
                new TextRun({
                  text: '\n' + (coverLetterData.personalInfo.phone || ''),
                  size: 22,
                }),
              ],
              alignment: 'right',
              spacing: { after: 400 },
            }),

            // Date
            new Paragraph({
              text: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              alignment: 'right',
              spacing: { after: 400 },
            }),

            // Recipient Information
            new Paragraph({
              text: coverLetterData.recipientName || '',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: coverLetterData.companyName || '',
              spacing: { after: 200 },
            }),
            ...(coverLetterData.companyAddress 
              ? coverLetterData.companyAddress.split('\n').map((line, index) => 
                new Paragraph({
                  text: line,
                  spacing: { after: index === 0 ? 200 : 100 },
                })
              ) 
              : []
            ),

            // Salutation
            new Paragraph({
              text: 'Dear ' + (coverLetterData.recipientName ? coverLetterData.recipientName : 'Hiring Manager') + ',',
              spacing: { after: 400 },
            }),

            // Work Experience Section
            new Paragraph({
              text: 'Work Experience',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            
            // Add work experience items if they exist
            ...(coverLetterData.workExperience && coverLetterData.workExperience.length > 0
              ? coverLetterData.workExperience.map((exp, idx) => [
                  new Paragraph({
                    text: exp.jobTitle || '',
                    bold: true,
                    size: 22,
                    spacing: { before: idx > 0 ? 200 : 0, after: 100 },
                  }),
                  new Paragraph({
                    text: `${exp.companyName || ''}${exp.location ? ' | ' + exp.location : ''}${exp.startDate || exp.endDate ? ' | ' + [exp.startDate, exp.endDate].filter(Boolean).join(' - ') : ''}`,
                    italics: true,
                    spacing: { after: 100 },
                  }),
                  ...(exp.responsibilities || []).map((resp, i) => 
                    new Paragraph({
                      text: `• ${resp}`,
                      indent: { left: 400 },
                      spacing: { after: 100 },
                    })
                  ),
                ]).flat()
              : [new Paragraph({
                  text: 'No work experience provided',
                  italics: true,
                  spacing: { before: 200, after: 200 },
                })]
            ),

            // Cover Letter Content
            new Paragraph({
              text: 'Cover Letter',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            ...(coverLetterData.content ? coverLetterData.content.split('\n\n').map((paragraph, index) => 
              new Paragraph({
                text: paragraph,
                spacing: { after: index === coverLetterData.content.split('\n\n').length - 1 ? 400 : 200 },
              })
            ) : []),

            // Closing
            new Paragraph({
              text: 'Sincerely,',
              spacing: { after: 400 },
              alignment: 'right',
            }),

            // Signature Line
            new Paragraph({
              text: coverLetterData.personalInfo.name || '',
              alignment: 'right',
              spacing: { after: 400 },
            }),
          ],
        }],
      });

      setExportProgress(60);

      // Generate the Word document
      const blob = await Packer.toBlob(doc);
      
      // Save the file
      const fileName = `${coverLetterData.personalInfo.name || 'Cover_Letter'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.docx`;
      saveAs(blob, fileName);
      
      setExportProgress(100);
    } catch (error) {
      console.error('Error in exportAsWord:', error);
      alert(`Failed to export Word document: ${error.message || 'Unknown error'}`);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={exportAsWord}
        disabled={isExporting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          'Export to Word'
        )}
      </button>

      {isExporting && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${exportProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
