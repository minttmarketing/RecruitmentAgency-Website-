// DEMO CONTENT
export type Job = {
  id: number
  title: string
  company: string
  location: string
  type: string
  industry: 'IT' | 'Finance' | 'Healthcare' | 'Other'
  posted: string
}

export const jobs: Job[] = [
  { id: 1, title: 'Frontend Developer', company: 'Confidential client', location: 'Pune', type: 'Full-time', industry: 'IT', posted: '2 days ago' },
  { id: 2, title: 'Accounts Executive', company: 'Meridian Textiles', location: 'Mumbai', type: 'Full-time', industry: 'Finance', posted: '3 days ago' },
  { id: 3, title: 'Staff Nurse', company: 'Lakeview Hospital', location: 'Thane', type: 'Full-time', industry: 'Healthcare', posted: 'last week' },
  { id: 4, title: 'Customer Support Associate', company: 'Confidential client', location: 'Navi Mumbai', type: 'Contract', industry: 'Other', posted: '2 days ago' },
  { id: 5, title: 'React Developer', company: 'Brightloop Systems', location: 'Remote', type: 'Full-time', industry: 'IT', posted: '3 days ago' },
  { id: 6, title: 'Credit Analyst', company: 'Confidential client', location: 'Mumbai', type: 'Full-time', industry: 'Finance', posted: 'last week' },
]
