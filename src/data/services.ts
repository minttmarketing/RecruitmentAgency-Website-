// DEMO CONTENT
export type Service = {
  title: string
  description: string
  visual: 'shortlist' | 'contract' | 'search' | 'campus' | 'insights' | 'screening'
}

export const services: Service[] = [
  { title: 'Permanent hiring', description: 'We learn what the role and team need, then bring you a focused shortlist.', visual: 'shortlist' },
  { title: 'Contract staffing', description: 'Find experienced people for a defined project, peak season or planned cover.', visual: 'contract' },
  { title: 'Executive search', description: 'A discreet search for senior people who can lead your next stage of growth.', visual: 'search' },
  { title: 'Bulk and campus hiring', description: 'Plan larger intakes with clear milestones from first conversation to joining.', visual: 'campus' },
  { title: 'Salary and market insights', description: 'Make informed decisions with current hiring and compensation context.', visual: 'insights' },
  { title: 'Candidate screening', description: 'We discuss experience, availability and expectations before an introduction.', visual: 'screening' },
]
