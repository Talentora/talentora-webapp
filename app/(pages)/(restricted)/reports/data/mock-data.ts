export interface ApplicantData {
  id: string;
  name: string;
  age: number;
  experience: number;
  education: string;
  location: string;
  skills: string[];
  job: string;
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xAxis: {
    type: "value" | "category" | "time";
    label: string;
  };
  yAxis?: {
    type: "value" | "category";
    label: string;
  };
  columnField?: string | undefined; // Make it explicitly optional
}

export type ChartType = "bar" | "line" | "scatter" | "pie" | "area";
export type MetricType = "value" | "time" | "category";

// Mock data generator
export function generateMockData(count: number): ApplicantData[] {
  const names = ["John", "Jane", "Robert", "Sarah", "Michael", "Emma", "David", "Olivia", "James", "Sophia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
  const locations = ["New York", "San Francisco", "Austin", "Seattle", "Boston", "Chicago", "Los Angeles", "Miami", "Denver", "Portland"];
  const education = ["Bachelor's", "Master's", "PhD", "High School", "Associate's"];
  const skillsList = ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "SQL", "TypeScript", "Java", "Go", "C#", "Ruby"];
  const jobs = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "UI/UX Designer", "Product Manager", "QA Engineer", "Mobile Developer", "ML Engineer"];

  return Array.from({ length: count }, (_, i) => {
    const randomSkillsCount = Math.floor(Math.random() * 5) + 1;
    const skillsSet = new Set<string>();
    
    while(skillsSet.size < randomSkillsCount) {
      skillsSet.add(skillsList[Math.floor(Math.random() * skillsList.length)]);
    }
    
    return {
      id: `app${i + 1}`,
      name: `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      age: Math.floor(Math.random() * 30) + 22,
      experience: Math.floor(Math.random() * 15) + 1,
      education: education[Math.floor(Math.random() * education.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      skills: Array.from(skillsSet),
      job: jobs[Math.floor(Math.random() * jobs.length)]
    };
  });
}

export const initialCharts: ChartConfig[] = [
  {
    id: "chart1",
    type: "line",
    title: "Experience Distribution",
    xAxis: {
      type: "value",
      label: "Experience"
    },
    yAxis: {
      type: "value",
      label: "Count"
    }
  },
  {
    id: "chart2",
    type: "pie",
    title: "Education Background",
    xAxis: {
      type: "category",
      label: "Education"
    },
    yAxis: {
      type: "value",
      label: "Count"
    }
  },
  {
    id: "chart3",
    type: "scatter",
    title: "Age vs Experience",
    xAxis: {
      type: "value",
      label: "Age"
    },
    yAxis: {
      type: "value",
      label: "Experience"
    }
  },
  {
    id: "chart4",
    type: "bar",
    title: "Skills Distribution",
    xAxis: {
      type: "category",
      label: "Skills"
    },
    yAxis: {
      type: "value",
      label: "Count"
    }
  },
  {
    id: "chart5",
    type: "line",
    title: "Average Age by Location",
    xAxis: {
      type: "category",
      label: "Location"
    },
    yAxis: {
      type: "value",
      label: "Average"
    }
  }
]; 