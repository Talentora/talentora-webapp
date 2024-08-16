"use client"

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { BriefcaseIcon, SearchIcon, PlusIcon, FilterIcon, MoreVerticalIcon, HomeIcon, UsersIcon, BarChartIcon, SettingsIcon, LayoutGridIcon, ListIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Component() {

  const router = useRouter()

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

  const activeFilterCount = Object.values(filters).flat().length

  const CardView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredJobs.map((job) => (
        <Card key={job.id} onClick={router.push("./JobPage")}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div>{job.department}</div>
              <div>{job.location}</div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{job.applicants} applicants</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Badge variant={job.status === 'Active' ? 'default' : job.status === 'Closed' ? 'secondary' : 'outline'}>
              {job.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  const TableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Applicants</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredJobs.map((job) => (
          <TableRow key={job.id} onClick={router.push("./JobPage")}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.department}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>{job.applicants}</TableCell>
            <TableCell>
              <Badge variant={job.status === 'Active' ? 'default' : job.status === 'Closed' ? 'secondary' : 'outline'}>
                {job.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const FilterDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Jobs</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-medium">Department</h3>
            {filterOptions.departments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`dept-${dept}`}
                  checked={filters.departments.includes(dept)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      departments: checked
                        ? [...prev.departments, dept]
                        : prev.departments.filter(d => d !== dept)
                    }))
                  }}
                />
                <label htmlFor={`dept-${dept}`}>{dept}</label>
              </div>
            ))}
          </div>
          <div className="grid gap-2">
            <h3 className="font-medium">Location</h3>
            {filterOptions.locations.map((loc) => (
              <div key={loc} className="flex items-center space-x-2">
                <Checkbox
                  id={`loc-${loc}`}
                  checked={filters.locations.includes(loc)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      locations: checked
                        ? [...prev.locations, loc]
                        : prev.locations.filter(l => l !== loc)
                    }))
                  }}
                />
                <label htmlFor={`loc-${loc}`}>{loc}</label>
              </div>
            ))}
          </div>
          <div className="grid gap-2">
            <h3 className="font-medium">Status</h3>
            {filterOptions.statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.statuses.includes(status)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      statuses: checked
                        ? [...prev.statuses, status]
                        : prev.statuses.filter(s => s !== status)
                    }))
                  }}
                />
                <label htmlFor={`status-${status}`}>{status}</label>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )



  return (
    <div className="flex flex-col min-h-screen bg-background">

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <div className="flex items-center space-x-4">
            <form className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Search jobs..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Job
            </Button>
            <FilterDialog />
          </div>
        </div>
        {activeFilterCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {Object.entries(filters).map(([key, values]) =>
              values.map(value => (
                <Badge key={`${key}-${value}`} variant="secondary" className="text-xs">
                  {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      [key]: prev[key].filter(v => v !== value)
                    }))}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove filter</span>
                  </Button>
                </Badge>
              ))
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setFilters({ departments: [], locations: [], statuses: [] })}
            >
              Clear all
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <LayoutGridIcon className="h-4 w-4" />
          <Switch
            checked={!isCardView}
            onCheckedChange={() => setIsCardView(!isCardView)}
            id="view-toggle"
          />
          <ListIcon className="h-4 w-4" />
          <label htmlFor="view-toggle" className="text-sm text-muted-foreground">
            {isCardView ? 'Card View' : 'Table View'}
          </label>
        </div>
        {isCardView ? <CardView /> : <TableView />}
      </main>
    </div>
  )
}