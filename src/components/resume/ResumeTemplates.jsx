import React from 'react';

export const ModernTemplate = ({ data }) => (
  <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg">
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">{data.personalInfo.name}</h1>
      <p className="text-gray-600">{data.personalInfo.email} | {data.personalInfo.phone}</p>
      <p className="text-gray-600">{data.personalInfo.location}</p>
    </header>

    <section className="mb-6">
    <h2 className="text-xl font-semibold text-indigo-600 pb-1 mb-3 border-b-2 border-indigo-600 w-fit">
  Professional Summary
</h2>

      <p className="text-gray-700">{data.summary}</p>
    </section>

    <section className="mb-6">
    <h2 className="text-xl font-semibold text-indigo-600 pb-1 mb-3 border-b-2 border-indigo-600 w-fit">
  Work Experience
</h2>

      {data.workExperience.map((exp, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold">{exp.position}</h3>
          <p className="text-gray-600">{exp.company} | {exp.duration}</p>
          <ul className="list-disc list-inside text-gray-700">
            {exp.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section className="mb-6">
    <h2 className="text-xl font-semibold text-indigo-600 pb-1 mb-3 border-b-2 border-indigo-600 w-fit">
  Education
</h2>

      {data.education.map((edu, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold">{edu.degree}</h3>
          <p className="text-gray-600">
            {edu.school} | {edu.year}
            {edu.gpa && ` | GPA: ${edu.gpa}`}
          </p>
        </div>
      ))}
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold text-indigo-600 pb-1 mb-3 border-b-2 border-indigo-600 w-fit">
        Skills
      </h2>
      {Object.entries(data.skills).map(([category, skills]) => (
        skills.length > 0 && (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">{category}</h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{skill.name}</span>
                  <div className="w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-500 h-2.5 rounded-full" 
                           style={{ width: `${skill.level * 20}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{skill.level * 20}%</span>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </section>

    {data.projects && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-indigo-600 pb-1 mb-3 border-b-2 border-indigo-600 w-fit">
  Projects
</h2>

        {data.projects.map((project, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-gray-700">{project.description}</p>
          </div>
        ))}
      </section>
    )}
  </div>
);

export const MinimalTemplate = ({ data }) => (
  <div className="max-w-2xl mx-auto p-8 bg-white">
    <header className="border-b-2 border-gray-300 pb-4 mb-6">
      <h1 className="text-4xl font-light text-gray-800">{data.personalInfo.name}</h1>
      <div className="flex gap-4 text-gray-600 mt-2">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </header>

    <section className="mb-6">
      <p className="text-gray-700 leading-relaxed">{data.summary}</p>
    </section>

    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Experience</h2>
      {data.workExperience.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium">{exp.position}</h3>
            <span className="text-gray-600 text-sm">{exp.duration}</span>
          </div>
          <p className="text-gray-600 mb-2">{exp.company}</p>
          <ul className="list-disc list-inside text-gray-700">
            {exp.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <div className="grid grid-cols-2 gap-6">
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-medium">{edu.degree}</h3>
            <p className="text-gray-600">
              {edu.school}, {edu.year}
              {edu.gpa && (
                <span className="block text-gray-500 text-sm mt-1">
                  GPA: {edu.gpa}
                </span>
              )}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Skills</h2>
        <div className="space-y-4">
          {Object.entries(data.skills).map(([category, skills]) => (
            skills.length > 0 && (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">{category}</h3>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{skill.name}</span>
                      <div className="w-24">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" 
                               style={{ width: `${skill.level * 20}%` }}></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{skill.level * 20}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  </div>
);