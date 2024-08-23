"use client"

import { useState, useMemo } from 'react'
import JobList from './JobList'
import JobPostingsHeader from '@/components/Dashboard/JobPostingsHeader';

export default function Dashboard() {

  const [searchTerm, setSearchTerm] = useState('')
  const [isCardView, setIsCardView] = useState(true)
  const [filters, setFilters] = useState({
    departments: [],
    locations: [],
    statuses: []
  })

  const jobs = [
    { id: 1, title: "Senior React Developer", department: "Engineering", location: "Remote", applicants: 45, status: "Active" },
    { id: 2, title: "Product Manager", department: "Product", location: "New York", applicants: 32, status: "Active" },
    { id: 3, title: "UX Designer", department: "Design", location: "San Francisco", applicants: 18, status: "Closed" },
    { id: 4, title: "Data Scientist", department: "Data", location: "Boston", applicants: 27, status: "Active" },
    { id: 5, title: "Marketing Specialist", department: "Marketing", location: "Chicago", applicants: 12, status: "Draft" },
    { id: 6, title: "DevOps Engineer", department: "Engineering", location: "Remote", applicants: 8, status: "Active" },
  ]

  const filterOptions = useMemo(() => ({
    departments: [...new Set(jobs.map(job => job.department))],
    locations: [...new Set(jobs.map(job => job.location))],
    statuses: [...new Set(jobs.map(job => job.status))]
  }), [jobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = filters.departments.length === 0 || filters.departments.includes(job.department)
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(job.location)
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(job.status)

      return matchesSearch && matchesDepartment && matchesLocation && matchesStatus
    })
  }, [jobs, searchTerm, filters])

  return (
    <div className="flex flex-col min-h-screen bg-background">

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <JobPostingsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
        />
        <JobList
          jobs={jobs}
          filteredJobs={filteredJobs}
          isCardView={isCardView}
          toggleView={() => setIsCardView(!isCardView)}
        />
      </main>
    </div>
  )
}
