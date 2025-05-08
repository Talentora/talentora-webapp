interface ScoreSection {
  score: number;
  explanation: string;
  supporting_quotes: string[];
}

export interface TechnicalFeedback {
  overall_score: number;
  knowledge_depth: ScoreSection;
  problem_solving: ScoreSection;
  best_practices: ScoreSection;
  system_design: ScoreSection;
  testing_approach: ScoreSection;
  hiring_recommendation: string;
  key_strengths: string[];
  areas_for_improvement: string[];
}

export interface CommunicationFeedback {
  overall_score: number;
  clarity: ScoreSection;
  articulation: ScoreSection;
  listening_skills: ScoreSection;
  professionalism: ScoreSection;
}

export interface ExperienceFeedback {
  overall_score: number;
  project_complexity: ScoreSection;
  impact: ScoreSection;
  growth: ScoreSection;
  technical_breadth: ScoreSection;
}

export interface BehavioralFeedback {
  overall_score: number;
  problem_approach: ScoreSection;
  collaboration: ScoreSection;
  learning_attitude: ScoreSection;
  initiative: ScoreSection;
}

export interface InterviewFeedback {
  technical: TechnicalFeedback;
  communication: CommunicationFeedback;
  experience: ExperienceFeedback;
  behavioral: BehavioralFeedback;
}

export const interviewFeedback: InterviewFeedback = {
  technical: {
    overall_score: 9.0,
    knowledge_depth: {
      score: 9.0,
      explanation: "Ben's experience with tools like React, TypeScript, and GraphQL shows strong front-end technical knowledge. She discusses using React DevTools and Chrome's Performance tab, which aligns with industry-standard practices for debugging and performance profiling. Her ability to work with both frontend and backend technologies displays a comprehensive understanding of the tech stack. Her contribution to open-source projects further emphasizes her depth of knowledge.",
      supporting_quotes: [
        "\"I led the redesign of our customer dashboard using React, TypeScript, and GraphQL.\"",
        "\"I've also dabbled in backend development, working with Node.js and Express.\""
      ]
    },
    problem_solving: {
      score: 9.0,
      explanation: "Ben's approach to solving performance issues demonstrates excellent problem-solving skills. She identified the use of code splitting, lazy loading, and custom memoization strategy to optimize performance, reducing load times significantly. Her methodical use of performance profiling tools to pinpoint issues and efforts to balance impact versus implementation time is impressive.",
      supporting_quotes: [
        "\"I implemented code splitting, lazy loading, and virtualization for long lists.\"",
        "\"I started with performance profiling using React DevTools and Chrome's Performance tab to identify bottlenecks.\""
      ]
    },
    best_practices: {
      score: 9.0,
      explanation: "Ben shows familiarity with state management, testing, and optimization strategies. She uses Redux with Redux Toolkit and is exploring Zustand, both popular choices. Her testing pyramid approach is aligned with best practices, as is her attention to accessibility.",
      supporting_quotes: [
        "\"For simpler applications, React's built-in useState and useContext are often sufficient.\"",
        "\"I'm a strong advocate for testing and follow a pyramid approach.\""
      ]
    },
    system_design: {
      score: 8.0,
      explanation: "While Ben shows strong practical coding and optimization skills, the transcript lacks deep exploration of system architecture principles, such as microservices or cloud-native design. Nonetheless, her experience with continuous integration suggests a solid foundation.",
      supporting_quotes: [
        "I also worked closely with our DevOps team to implement a continuous integration pipeline that automated performance testing and monitoring.\""
      ]
    },
    testing_approach: {
      score: 10.0,
      explanation: "Ben's testing strategy follows a comprehensive testing pyramid with unit, integration, and end-to-end tests. Her use of Jest, React Testing Library, and Cypress reflects robust testing aligned with business-critical needs.",
      supporting_quotes: [
        "I write unit tests for individual components using Jest and React Testing Library.\""
      ]
    },
    hiring_recommendation: "Strongly Recommended",
    key_strengths: [
      "Extensive knowledge in React and modern frontend frameworks",
      "Strong problem-solving abilities with practical examples",
      "Excellent testing strategies and practices",
      "Sound understanding of accessibility and responsive design",
      "Adherence to best practices and continuous learning"
    ],
    areas_for_improvement: [
      "Explore deeper into backend technologies to enhance full-stack capabilities",
      "Consider broader exposure to different state management libraries beyond React ecosystem"
    ]
  },
  communication: {
    overall_score: 8.25,
    clarity: {
      score: 9.0,
      explanation: "Ben articulates her experiences and thoughts clearly, using straightforward language that conveys her technical skills effectively. She provides concrete examples to support her statements, enhancing understanding.",
      supporting_quotes: [
        "I implemented code splitting, lazy loading, and virtualization for long lists.",
        "I believe in using the right tool for the job."
      ]
    },
    articulation: {
      score: 8.0,
      explanation: "While Ben explains complex concepts like performance profiling and state management well, there are moments where she could have broken down her explanations further for clarity, especially when discussing technical methodologies.",
      supporting_quotes: [
        "I prioritized based on impact vs. implementation effort, which led to tackling code splitting first.",
        "I follow a pattern of collocating state as close as possible to where it's used."
      ]
    },
    listening_skills: {
      score: 8.0,
      explanation: "Ben demonstrates listening skills by answering questions thoroughly and appropriately responding to prompts, indicating she understands what is being asked. However, there were few follow-up questions or clarifications.",
      supporting_quotes: [
        "I'd love to know more about how your team handles technical debt."
      ]
    },
    professionalism: {
      score: 9.0,
      explanation: "Throughout the interview, Ben maintains a professional tone and shows respect for the interviewer's time. Her engagement in the discussion and knowledge of the subject matter emphasizes her professionalism.",
      supporting_quotes: [
        "I'm a strong advocate for testing and follow a pyramid approach.",
        "I regularly read tech blogs, follow key developers on Twitter, and participate in the React community."
      ]
    }
  },
  experience: {
    overall_score: 8.0,
    project_complexity: {
      score: 9.0,
      explanation: "The candidate described leading a major redesign project that involved significant performance issues with over 50 data visualization components, showcasing complex problem-solving skills.",
      supporting_quotes: [
        "led the redesign of our customer dashboard using React, TypeScript, and GraphQL",
        "faced significant performance issues with our dashboard that had over 50 different data visualization components"
      ]
    },
    impact: {
      score: 9.0,
      explanation: "The optimizations resulted in a dramatic decrease in load time and increased user engagement, indicating a clear positive impact on the business.",
      supporting_quotes: [
        "brought the load time down to under 2 seconds",
        "we saw a significant increase in user engagement"
      ]
    },
    growth: {
      score: 7.0,
      explanation: "The candidate demonstrated a proactive approach to learning and community involvement, though the focus shifted primarily to technical skills rather than managerial or leadership growth.",
      supporting_quotes: [
        "I've also dabbled in backend development",
        "I've contributed to several open-source projects"
      ]
    },
    technical_breadth: {
      score: 8.0,
      explanation: "The candidate showcased a solid understanding of both frontend and backend technologies and testing frameworks, indicating a wide range of technical skills.",
      supporting_quotes: [
        "I've also dabbled in backend development, working with Node.js and Express",
        "I also implemented a testing framework for our GraphQL API using Apollo Client and Mock Service Worker"
      ]
    }
  },
  behavioral: {
    overall_score: 8.0,
    problem_approach: {
      score: 9.0,
      explanation: "Ben demonstrates a strong problem-solving approach through her detailed explanation of how she addressed performance issues at TechCorp. She employed multiple strategies, including code splitting, lazy loading, and memoization, which not only indicates her technical proficiency but also her ability to assess problems methodically and prioritize solutions. Her approach to profiling and analyzing performance bottlenecks also showcases her analytical skills. She clearly understands the impact of her solutions, as seen in the decrease of load time from 8 seconds to under 2 seconds, which led to greater user engagement.",
      supporting_quotes: [
        "\"I implemented code splitting, lazy loading, and virtualization for long lists.\"",
        "\"I started with performance profiling using React DevTools and Chrome's Performance tab to identify bottlenecks.\""
      ]
    },
    collaboration: {
      score: 8.0,
      explanation: "Ben's collaboration skills are highlighted through her mention of working closely with the DevOps team to implement a performance testing and monitoring pipeline. Her experience in organizing meetups and workshops in the tech community also illustrates her commitment to community engagement and knowledge sharing. This suggests she values collective efforts and seeks to empower others, indicating strong collaborative qualities.",
      supporting_quotes: [
        "\"I also worked closely with our DevOps team to implement a continuous integration pipeline that automated performance testing and monitoring.\"",
        "\"I've also been involved in the local tech community, organizing meetups and workshops to help others learn and grow in their careers.\""
      ]
    },
    learning_attitude: {
      score: 9.0,
      explanation: "Ben displays a proactive learning attitude by actively engaging with the latest technologies, contributing to open-source projects, and building side projects to explore new concepts. Her mention of reading tech blogs and following industry leaders shows a consistent commitment to self-improvement and staying current in her field. Additionally, her pragmatic approach to adopting new technologies reveals her understanding of practical application rather than following trends blindly, showcasing a well-rounded attitude towards continuous learning.",
      supporting_quotes: [
        "\"I regularly read tech blogs, follow key developers on Twitter, and participate in the React community.\"",
        "\"I believe in being pragmatic about adopting new technologies - evaluating them based on project needs rather than just hype.\""
      ]
    },
    initiative: {
      score: 7.0,
      explanation: "Ben shows good initiative through her actions at TechCorp and her involvement in the tech community. Leading the redesign of a complex customer dashboard and advocating for performance improvements demonstrates her ability to take ownership of projects. However, while she has occasionally explored and implemented new technologies, there could be a more evident demonstration of proactivity in identifying challenges or suggesting improvements beyond her direct responsibilities. Encouragingly, her efforts in local community engagements reflect her willingness to share knowledge and mentor others, a strong indicator of initiative as well.",
      supporting_quotes: [
        "\"I led the redesign of our customer dashboard using React, TypeScript, and GraphQL.\"",
        "\"I've also dabbled in backend development, working with Node.js and Express.\""
      ]
    }
  }
}; 