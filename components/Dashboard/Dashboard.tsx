"use client"

import { useState, useMemo,useEffect } from 'react'
import JobList from './JobList'
import JobPostingsHeader from '@/components/Dashboard/JobPostingsHeader';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface Props {
  jobs: Job[]
}

export default function  Dashboard(
  { jobs }: Props
) {

  const [searchTerm, setSearchTerm] = useState('')
  const [isCardView, setIsCardView] = useState(true)
  const [filters, setFilters] = useState({
    departments: [],
    locations: [],
  })

  // const jobs = [
  //   { id: 1, title: "Senior React Developer", department: "Engineering", location: "Remote", applicants: 45, status: "Active" },
  //   { id: 2, title: "Product Manager", department: "Product", location: "New York", applicants: 32, status: "Active" },
  //   { id: 3, title: "UX Designer", department: "Design", location: "San Francisco", applicants: 18, status: "Closed" },
  //   { id: 4, title: "Data Scientist", department: "Data", location: "Boston", applicants: 27, status: "Active" },
  //   { id: 5, title: "Marketing Specialist", department: "Marketing", location: "Chicago", applicants: 12, status: "Draft" },
  //   { id: 6, title: "DevOps Engineer", department: "Engineering", location: "Remote", applicants: 8, status: "Active" },
  // ]

  useEffect(() => {
    console.log('jobs',jobs)
  }, [jobs])


  const filterOptions = useMemo(() => ({
    departments: [...new Set(jobs.map(job => job.department))],
    locations: [...new Set(jobs.map(job => job.location))],
  }), [jobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = filters.departments.length === 0 || filters.departments.includes(job.department)
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(job.location)

      return matchesSearch && matchesDepartment && matchesLocation
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
        {jobs ?
          <JobList
            jobs={jobs}
            filteredJobs={filteredJobs}
            isCardView={isCardView}
            toggleView={() => setIsCardView(!isCardView)}
          />
          :
          <div className="flex items-center justify-center h-96">
            <p className="text-lg text-primary-400">No jobs found</p>
          </div>
        }
      </main>
    </div>
  )
}
