import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ModernTemplate, MinimalTemplate } from './ResumeTemplates';
import { generateResumeContent } from '../../config/gemini';
import ExportOptions from './ExportOptions';
import { motion } from 'framer-motion';
import { FaUser, FaBriefcase, FaGraduationCap, FaTools, FaProjectDiagram, FaChevronDown } from 'react-icons/fa';

const templates = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const FormCard = ({ children, title, icon: Icon }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden"
  >
    <div className="flex items-center space-x-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [template, setTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    summary: '',
    workExperience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      tools: []
    },
    projects: [],
  });
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const componentRef = useRef();
  const { register, handleSubmit, reset } = useForm();

  // Define CSS classes
  const labelClasses = 'block text-sm font-medium text-gray-300 mb-1';
  const inputClasses = 'w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  const sections = {
    personalInfo: {
      id: 'personalInfo',
      label: 'Personal Info',
      icon: FaUser,
      content: (
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Full Name</label>
            <input type="text" {...register('fullName')} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Email</label>
            <input type="email" {...register('email')} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Phone Number</label>
            <input type="tel" {...register('phone')} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Location</label>
            <input type="text" {...register('location')} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>LinkedIn Profile</label>
            <input type="url" {...register('linkedin')} className={inputClasses} />
          </div>
        </div>
      )
    },
    workExperience: {
      id: 'workExperience',
      label: 'Experience',
      icon: FaBriefcase,
      content: (
        <div className="space-y-4">
          {resumeData.workExperience.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-200 mb-3">Your Experience</h4>
              <div className="space-y-3">
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-white">{exp.position || 'Position'}</h5>
                        <p className="text-sm text-gray-300">{exp.company || 'Company'}</p>
                        <p className="text-xs text-gray-400">{exp.duration || 'Duration'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExperience(index);
                            reset({
                              position: exp.position,
                              company: exp.company,
                              duration: exp.duration,
                              achievements: exp.achievements?.join('\n') || ''
                            });
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              workExperience: prev.workExperience.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-gray-200 mb-4">
              {editingExperience !== null ? 'Edit Experience' : 'Add New Experience'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Position</label>
                <input type="text" {...register('position')} className={inputClasses} placeholder="Software Engineer" />
              </div>
              <div>
                <label className={labelClasses}>Company</label>
                <input type="text" {...register('company')} className={inputClasses} placeholder="Tech Company Inc." />
              </div>
              <div>
                <label className={labelClasses}>Duration</label>
                <input type="text" {...register('duration')} className={inputClasses} placeholder="Jan 2020 - Present" />
              </div>
              <div>
                <label className={labelClasses}>Achievements & Responsibilities</label>
                <textarea 
                  {...register('achievements')} 
                  rows={3} 
                  className={inputClasses} 
                  placeholder="• Achievement 1\n• Responsibility 2\n• Result 3" 
                />
                <p className="mt-1 text-xs text-gray-400">Enter each item on a new line, starting with •</p>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <input 
                  type="checkbox" 
                  {...register('useAI')} 
                  className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700" 
                />
                <div className="flex items-center">
                  <FaMagic className="text-blue-400 mr-2" />
                  <span className="text-sm text-gray-300">Use AI to generate professional description</span>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                {editingExperience !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExperience(null);
                      reset();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingExperience !== null ? 'Update Experience' : 'Add Experience'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    education: {
      id: 'education',
      label: 'Education',
      icon: FaGraduationCap,
      content: (
        <div className="space-y-4">
          {resumeData.education.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-200 mb-3">Your Education</h4>
              <div className="space-y-3">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-white">{edu.degree || 'Degree'}</h5>
                          <p className="text-sm text-gray-300">{edu.school || 'School'}</p>
                          <p className="text-xs text-gray-400">{edu.year || 'Year'}</p>
                          {edu.gpa && (
                            <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEducation(index);
                              reset({
                                degree: edu.degree,
                                school: edu.school,
                                year: edu.year,
                                gpa: edu.gpa
                              });
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setResumeData(prev => ({
                                ...prev,
                                education: prev.education.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-gray-200 mb-4">Add Education</h4>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Degree</label>
                <input type="text" {...register('degree')} className={inputClasses} placeholder="Bachelor's, Master's, etc." />
              </div>
              <div>
                <label className={labelClasses}>School</label>
                <input type="text" {...register('school')} className={inputClasses} placeholder="University Name" />
              </div>
              <div>
                <label className={labelClasses}>Year</label>
                <input type="text" {...register('year')} className={inputClasses} placeholder="2020 - 2024" />
              </div>
              <div>
                <label className={labelClasses}>GPA (Optional)</label>
                <input type="number" step="0.01" {...register('gpa')} className={inputClasses} placeholder="3.5" />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Education
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    skills: {
      id: 'skills',
      label: 'Skills',
      icon: FaTools,
      content: (
        <div className="space-y-4">
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            skills.length > 0 && (
              <div key={category} className="mb-6">
                <h4 className="text-lg font-medium text-gray-200 mb-3 capitalize">
                  {category} Skills
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{skill.name}</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div 
                              key={level}
                              className={`h-2 w-2 rounded-full ${level <= skill.level ? 'bg-blue-500' : 'bg-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResumeData(prev => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              [category]: prev.skills[category].filter((_, i) => i !== index)
                            }
                          }));
                        }}
                        className="mt-2 text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-gray-200 mb-4">Add New Skill</h4>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Skill Name</label>
                <input 
                  type="text" 
                  {...register('skillName')} 
                  className={inputClasses} 
                  placeholder="e.g., React, Project Management, Spanish" 
                />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <select 
                  {...register('category')} 
                  className={inputClasses}
                  defaultValue="technical"
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="languages">Languages</option>
                  <option value="tools">Tools</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Proficiency Level</label>
                <div className="mt-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400">Beginner</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      defaultValue="3"
                      {...register('proficiency')}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-400">Expert</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <input 
                  type="checkbox" 
                  {...register('useAI')} 
                  className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700" 
                />
                <div className="flex items-center">
                  <FaMagic className="text-blue-400 mr-2" />
                  <span className="text-sm text-gray-300">Use AI to suggest relevant skills</span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    projects: {
      id: 'projects',
      label: 'Projects',
      icon: FaProjectDiagram,
      content: (
        <div className="space-y-4">
          {resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-200 mb-3">Your Projects</h4>
              <div className="space-y-3">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                    <div className="flex flex-col space-y-2">
                      <h5 className="font-medium text-white">{project.name || 'Project Name'}</h5>
                      <div className="text-sm text-gray-300">
                        {project.technologies?.split(',').map((tech, i) => (
                          <span key={i} className="mr-2">
                            <span className="bg-blue-500/20 px-2 py-1 rounded-full text-blue-400 text-xs">
                              {tech.trim()}
                            </span>
                          </span>
                        ))}
                      </div>
                      <div className="text-gray-400">
                        {project.description?.split('\n').map((line, i) => (
                          <p key={i} className="mb-1">{line}</p>
                        ))}
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(index);
                            reset({
                              name: project.name,
                              technologies: project.technologies,
                              description: project.description
                            });
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeData(prev => ({
                              ...prev,
                              projects: prev.projects.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-gray-200 mb-4">
              {editingProject !== null ? 'Edit Project' : 'Add New Project'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Project Name</label>
                <input type="text" {...register('name')} className={inputClasses} placeholder="Project Management System" />
              </div>
              <div>
                <label className={labelClasses}>Technologies Used</label>
                <textarea {...register('technologies')} rows={2} className={inputClasses} 
                  placeholder="React, Node.js, MongoDB, etc." />
                <p className="mt-1 text-xs text-gray-400">Enter technologies separated by commas</p>
              </div>
              <div>
                <label className={labelClasses}>Project Description</label>
                <textarea {...register('description')} rows={4} className={inputClasses} 
                  placeholder="• Project overview\n• Key features\n• Technologies used\n• Impact or results" />
                <p className="mt-1 text-xs text-gray-400">Enter each point on a new line, starting with •</p>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <input type="checkbox" {...register('useAI')} 
                  className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700" />
                <div className="flex items-center">
                  <FaMagic className="text-blue-400 mr-2" />
                  <span className="text-sm text-gray-300">Use AI to generate professional project description</span>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                {editingProject !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      reset();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingProject !== null ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    summary: {
      id: 'summary',
      label: 'Summary',
      icon: FaChevronDown,
      content: (
        <div className="space-y-4">
          {resumeData.summary && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-200 mb-3">Current Summary</h4>
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                <p className="text-white">{resumeData.summary}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-gray-200 mb-4">Generate Summary</h4>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Current Role</label>
                <input type="text" {...register('role')} className={inputClasses} placeholder="Senior Software Engineer" />
              </div>
              <div>
                <label className={labelClasses}>Key Expertise</label>
                <textarea {...register('expertise')} rows={3} className={inputClasses} 
                  placeholder="Enter your key areas of expertise" />
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <input type="checkbox" {...register('useAI')} 
                  className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700" />
                <div className="flex items-center">
                  <FaMagic className="text-blue-400 mr-2" />
                  <span className="text-sm text-gray-300">Generate professional summary based on your experience</span>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };


  const generateAIContent = async (section, data) => {
    try {
      let aiData = {};
      switch (section) {
        case 'workExperience':
          aiData = {
            company: data.company,
            position: data.position,
            duration: data.duration,
          };
          break;
        case 'skills':
          aiData = {
            role: data.role,
            focusAreas: data.focusAreas,
          };
          break;
        case 'projects':
          aiData = {
            name: data.name,
            technologies: data.technologies,
          };
          break;
        case 'summary':
          aiData = {
            role: data.role,
            experience: data.experience,
            expertise: data.expertise
          };
          break;
        default:
          aiData = {};
      }
      return aiData;
    } catch (error) {
      console.error('Error processing form data:', error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      const aiData = await generateAIContent(activeSection, data);
      setResumeData({ ...resumeData, [activeSection]: aiData });
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error.message || 'An error occurred while generating AI content';
      alert(`AI Enhancement failed: ${errorMessage}`);
    }
  };

  const TemplateComponent = templates[template] || templates.modern;
  const currentSection = sections[activeSection];
  
  return (
    <div className="min-h-screen bg-gray-900 py-6 sm:py-12 px-3 sm:px-4 lg:px-8 relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setTemplate('modern')}
                className={`px-4 py-2 rounded-lg ${
                  template === 'modern' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Modern
              </button>
              <button
                onClick={() => setTemplate('minimal')}
                className={`px-4 py-2 rounded-lg ${
                  template === 'minimal' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Minimal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="space-y-6">
                {Object.values(sections).map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg ${
                      activeSection === section.id
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="text-blue-400" />
                      <span className="text-white">{section.label}</span>
                    </div>
                    {activeSection === section.id && (
                      <FaChevronDown className="text-blue-400" />
                    )}
                  </button>
                ))}
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mt-8"
              >
                {currentSection && (
                  <motion.div variants={itemVariants}>
                    <FormCard title={currentSection.label} icon={currentSection.icon}>
                      {currentSection.content}
                    </FormCard>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

