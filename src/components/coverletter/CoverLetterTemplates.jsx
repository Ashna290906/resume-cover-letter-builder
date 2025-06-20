import React from 'react';

export const ModernTemplate = ({ data }) => (
  <div className="max-w-2xl mx-auto p-8 bg-white">
    <header className="mb-8">
      <div className="text-right mb-8">
        <p>{data.personalInfo.name}</p>
        <p>{data.personalInfo.email}</p>
        <p>{data.personalInfo.phone}</p>
        <p>{data.personalInfo.location}</p>
      </div>
      <div className="mb-8">
        <p>{new Date().toLocaleDateString()}</p>
      </div>
      <div className="mb-8">
        <p>{data.recipientName}</p>
        <p>{data.companyName}</p>
        <p>{data.companyAddress}</p>
      </div>
    </header>

    <main className="space-y-6 text-gray-800">
      <p>Dear {data.recipientName || 'Hiring Manager'},</p>
      
      <div className="whitespace-pre-line">
        {data.content}
      </div>

      <div className="mt-8">
        <p>Sincerely,</p>
        <p className="mt-4">{data.personalInfo.name}</p>
      </div>
    </main>
  </div>
);

export const MinimalTemplate = ({ data }) => {
  // Ensure all required data is available with fallbacks
  const personalInfo = data?.personalInfo || {};
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white">
      {/* Header with contact information */}
      <header className="border-b pb-6 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-light text-gray-800">
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className="text-gray-600 space-x-4">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
          </div>
        </div>
      </header>

      <main className="space-y-6 text-gray-800">
        {/* Date and recipient information */}
        <div className="mb-8">
          <p>{currentDate}</p>
          {(data.recipientName || data.companyName || data.companyAddress) && (
            <div className="mt-4 space-y-1">
              {data.recipientName && <p>{data.recipientName}</p>}
              {data.companyName && <p>{data.companyName}</p>}
              {data.companyAddress && <p>{data.companyAddress}</p>}
            </div>
          )}
        </div>

        {/* Salutation */}
        <p>Dear {data.recipientName || 'Hiring Manager'},</p>
        
        {/* Main content */}
        <div className="whitespace-pre-line leading-relaxed">
          {data.content || 'Your cover letter content will appear here...'}
        </div>

        {/* Closing */}
        <div className="mt-12">
          <p>Sincerely,</p>
          <p className="mt-4">{personalInfo.name || 'Your Name'}</p>
        </div>
      </main>
    </div>
  );
};