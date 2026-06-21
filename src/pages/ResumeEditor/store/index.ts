import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, BasicInfo, Education, Experience, Project, Certificate } from '../types'
import { DEFAULT_PHOTO_CONFIG } from '../types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function createDefaultResume(id?: string): ResumeData {
  return {
    id: id || generateId(),
    title: '未命名简历',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templateId: 'classic',
    basic: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      birthDate: '',
      employementStatus: '',
      photo: '',
      photoConfig: DEFAULT_PHOTO_CONFIG,
      customFields: [],
      layout: 'left',
    },
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    customData: {},
    skillContent: '',
    selfEvaluationContent: '',
    activeSection: 'basic',
    menuSections: [
      { id: 'basic', title: '基本信息', icon: '👤', enabled: true, order: 0 },
      { id: 'education', title: '教育经历', icon: '🎓', enabled: true, order: 1 },
      { id: 'experience', title: '工作经历', icon: '💼', enabled: true, order: 2 },
      { id: 'projects', title: '项目经历', icon: '🚀', enabled: true, order: 3 },
      { id: 'skills', title: '专业技能', icon: '⚡', enabled: true, order: 4 },
      { id: 'selfEvaluation', title: '自我评价', icon: '💬', enabled: true, order: 5 },
    ],
    globalSettings: {
      themeColor: '#000000',
      fontFamily: "'Noto Sans SC', sans-serif",
      baseFontSize: 14,
      pagePadding: 20,
      paragraphSpacing: 8,
      lineHeight: 1.6,
      sectionSpacing: 16,
      headerSize: 24,
      subheaderSize: 16,
      useIconMode: false,
      centerSubtitle: false,
      flexibleHeaderLayout: false,
      autoOnePage: false,
    },
  }
}

interface ResumeEditorState {
  resumes: ResumeData[]
  currentResumeId: string | null
  currentResume: ResumeData | null

  // Actions
  addResume: (resume?: Partial<ResumeData>) => string
  updateResume: (id: string, data: Partial<ResumeData>) => void
  deleteResume: (id: string) => void
  setCurrentResume: (id: string) => void
  clearCurrentResume: () => void

  // Section updates
  updateBasicInfo: (info: Partial<BasicInfo>) => void
  addEducation: (education?: Partial<Education>) => void
  updateEducation: (educationId: string, data: Partial<Education>) => void
  removeEducation: (educationId: string) => void
  addExperience: (experience?: Partial<Experience>) => void
  updateExperience: (experienceId: string, data: Partial<Experience>) => void
  removeExperience: (experienceId: string) => void
  addProject: (project?: Partial<Project>) => void
  updateProject: (projectId: string, data: Partial<Project>) => void
  removeProject: (projectId: string) => void
  updateSkillContent: (skillContent: string) => void
  updateSelfEvaluationContent: (content: string) => void
  addCertificate: (certificate?: Partial<Certificate>) => void
  updateCertificate: (id: string, updates: Partial<Certificate>) => void
  removeCertificate: (id: string) => void
  updateGlobalSettings: (settings: Partial<ResumeData['globalSettings']>) => void
  updateMenuSections: (sections: ResumeData['menuSections']) => void
  setActiveSection: (section: string) => void
}

export const useResumeEditorStore = create<ResumeEditorState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      currentResume: null,

      addResume: (resumeData?: Partial<ResumeData>) => {
        const newResume = { ...createDefaultResume(), ...resumeData }
        set(state => ({
          resumes: [...state.resumes, newResume],
          currentResumeId: newResume.id,
          currentResume: newResume,
        }))
        return newResume.id
      },

      updateResume: (id: string, data: Partial<ResumeData>) => {
        set(state => {
          const resumes = state.resumes.map(r =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          )
          const currentResume =
            state.currentResumeId === id
              ? { ...state.currentResume!, ...data, updatedAt: new Date().toISOString() }
              : state.currentResume
          return { resumes, currentResume }
        })
      },

      deleteResume: (id: string) => {
        set(state => ({
          resumes: state.resumes.filter(r => r.id !== id),
          currentResumeId: state.currentResumeId === id ? null : state.currentResumeId,
          currentResume: state.currentResumeId === id ? null : state.currentResume,
        }))
      },

      setCurrentResume: (id: string) => {
        const resume = get().resumes.find(r => r.id === id)
        if (resume) {
          set({ currentResumeId: id, currentResume: { ...resume } })
        }
      },

      clearCurrentResume: () => {
        set({ currentResumeId: null, currentResume: null })
      },

      updateBasicInfo: (info: Partial<BasicInfo>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          ...currentResume,
          basic: { ...currentResume.basic, ...info },
          updatedAt: new Date().toISOString(),
        }
        get().updateResume(currentResumeId, { basic: updated.basic })
        set({ currentResume: updated })
      },

      addEducation: (education?: Partial<Education>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const newEdu: Education = {
          id: generateId(),
          school: '',
          major: '',
          degree: '',
          startDate: '',
          endDate: '',
          visible: true,
          ...education,
        }
        const updated = { education: [...currentResume.education, newEdu] }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateEducation: (educationId: string, data: Partial<Education>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          education: currentResume.education.map((e: Education) =>
            e.id === educationId ? { ...e, ...data } : e
          ),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      removeEducation: (educationId: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          education: currentResume.education.filter((e: Education) => e.id !== educationId),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      addExperience: (experience?: Partial<Experience>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const newExp: Experience = {
          id: generateId(),
          company: '',
          position: '',
          date: '',
          details: '',
          visible: true,
          ...experience,
        }
        const updated = { experience: [...currentResume.experience, newExp] }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateExperience: (experienceId: string, data: Partial<Experience>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          experience: currentResume.experience.map((e: Experience) =>
            e.id === experienceId ? { ...e, ...data } : e
          ),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      removeExperience: (experienceId: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          experience: currentResume.experience.filter((e: Experience) => e.id !== experienceId),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      addProject: (project?: Partial<Project>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const newProject: Project = {
          id: generateId(),
          name: '',
          role: '',
          date: '',
          description: '',
          visible: true,
          ...project,
        }
        const updated = { projects: [...currentResume.projects, newProject] }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateProject: (projectId: string, data: Partial<Project>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          projects: currentResume.projects.map((p: Project) =>
            p.id === projectId ? { ...p, ...data } : p
          ),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      removeProject: (projectId: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          projects: currentResume.projects.filter((p: Project) => p.id !== projectId),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateSkillContent: (skillContent: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        get().updateResume(currentResumeId, { skillContent })
        set({ currentResume: { ...currentResume, skillContent } })
      },

      updateSelfEvaluationContent: (selfEvaluationContent: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        get().updateResume(currentResumeId, { selfEvaluationContent })
        set({ currentResume: { ...currentResume, selfEvaluationContent } })
      },

      addCertificate: (certificate?: Partial<Certificate>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const newCert: Certificate = {
          id: generateId(),
          url: '',
          width: 100,
          ...certificate,
        }
        const updated = { certificates: [...currentResume.certificates, newCert] }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateCertificate: (id: string, updates: Partial<Certificate>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          certificates: currentResume.certificates.map((c: Certificate) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      removeCertificate: (id: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          certificates: currentResume.certificates.filter((c: Certificate) => c.id !== id),
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateGlobalSettings: (settings: Partial<ResumeData['globalSettings']>) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        const updated = {
          globalSettings: { ...currentResume.globalSettings, ...settings },
        }
        get().updateResume(currentResumeId, updated)
        set({ currentResume: { ...currentResume, ...updated } })
      },

      updateMenuSections: (sections: ResumeData['menuSections']) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        get().updateResume(currentResumeId, { menuSections: sections })
        set({ currentResume: { ...currentResume, menuSections: sections } })
      },

      setActiveSection: (section: string) => {
        const { currentResume, currentResumeId } = get()
        if (!currentResume || !currentResumeId) return
        get().updateResume(currentResumeId, { activeSection: section })
        set({ currentResume: { ...currentResume, activeSection: section } })
      },
    }),
    {
      name: 'resume-editor-storage',
      partialize: state => ({ resumes: state.resumes }),
    }
  )
)
