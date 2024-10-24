import { useState, useEffect } from 'react'
import { Job } from '@/types/greenhouse'
import { SearchFilter } from './search-filer'
import { JobTable } from './job-table'

type SortField = 'name' | 'status' | 'created_at' | 'opened_at'

export default function JobListPage({ jobs: initialJobs }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    let filteredJobs = initialJobs

    // Only apply filtering if the search term is not empty
    if (searchTerm.trim()) {
      filteredJobs = initialJobs.filter(job => 
        job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requisition_id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    const sortedJobs = filteredJobs.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    setJobs(sortedJobs)
  }, [searchTerm, sortField, sortDirection, initialJobs])

  const handleSearch = (term: string) => setSearchTerm(term)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
     
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <SearchFilter 
        onSearch={handleSearch} 
        searchTerm={searchTerm} 
      />
      <JobTable 
        jobs={jobs} 
        sortField={sortField} 
        sortDirection={sortDirection} 
        onSort={handleSort} 
      />
    </div>
  )
}
