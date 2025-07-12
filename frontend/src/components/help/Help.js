// src/components/BookingHelps.jsx
import { set } from 'date-fns';
import React, { useState } from 'react';
// import HelpData from './bookingHelpData.json';
// import EventHelpData from './eventHelpData.json';

const Help = ({ tz }) => {
  const [activeSection, setActiveSection] = useState();

  const HelpData = tz;

  React.useEffect(() => {
    if (HelpData && HelpData.sections && HelpData.sections.length > 0) {
      setActiveSection(HelpData.sections[0].id);
    }
  }, [HelpData]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-white p-4 md:h-screen md:sticky md:top-0">
        <h1 className="text-xl font-bold mb-6 pt-4"> Help Center</h1>
        <nav className="space-y-2">
          {HelpData.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-200 hover:bg-gray-700'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
        
        {/* <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-medium mb-2">{HelpData.contact.title}</h3>
          <p className="text-sm text-gray-300">
            Email: {HelpData.contact.email}<br />
            Phone: {HelpData.contact.phone}
          </p>
        </div> */}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto">
          {HelpData.sections.map((section) => (
            activeSection === section.id && (
              <Section 
                key={section.id}
                title={section.title}
                intro={section.intro}
                features={section.features}
                notes={section.notes}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, intro, features, notes }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-600 mb-6">{intro}</p>
    
    <div className="space-y-5">
      {features.map((feature, index) => (
        <FeatureCard 
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          bullets={feature.bullets}
          subsections={feature.subsections}
          table={feature.table}
        />
      ))}
    </div>
    
    {notes && notes.map((note, index) => (
      <NoteCard 
        key={index}
        type={note.type}
        title={note.title}
        content={note.content}
        bullets={note.bullets}
      />
    ))}
  </div>
);

// Reusable Feature Card Component
const FeatureCard = ({ title, description, icon, bullets, subsections, table }) => (
  <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="text-2xl mr-4 mt-1">{icon}</div>
    <div className="flex-1">
      <h4 className="text-lg font-medium text-gray-700 mb-2">{title}</h4>
      {description && <p className="text-gray-600 mb-3">{description}</p>}
      
      {bullets && (
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          {bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      )}
      
      {subsections && subsections.map((subsection, idx) => (
        <div key={idx} className="mt-3">
          <p className="font-medium mb-1">{subsection.title}:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            {subsection.bullets.map((bullet, bIdx) => (
              <li key={bIdx}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
      
      {table && (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                {table.columns.map((col, idx) => (
                  <th key={idx} className="border p-2 text-left">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="border p-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

// Reusable Note Card Component
const NoteCard = ({ type, title, content, bullets }) => {
  const colors = {
    tip: { bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-800', text: 'text-green-700' },
    important: { bg: 'bg-yellow-50', border: 'border-yellow-200', title: 'text-yellow-800', text: 'text-yellow-700' },
    consideration: { bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-800', text: 'text-blue-700' },
    default: { bg: 'bg-gray-50', border: 'border-gray-200', title: 'text-gray-800', text: 'text-gray-700' }
  };
  
  const colorSet = colors[type] || colors.default;
  
  return (
    <div className={`mt-8 p-4 rounded-lg border ${colorSet.bg} ${colorSet.border}`}>
      <p className={`font-medium ${colorSet.title}`}>{title}</p>
      
      {content && <p className={`mt-1 ${colorSet.text}`}>{content}</p>}
      
      {bullets && (
        <ul className={`list-disc pl-5 mt-1 space-y-1 ${colorSet.text}`}>
          {bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Help;