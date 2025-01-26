'use client';

import { Card } from "@/components/ui/card";

const ThemePage = () => {
  const colorSections = [
    {
      title: "Base Colors",
      colors: [
        { name: "Background", class: "bg-background" },
        { name: "Foreground", class: "bg-foreground text-background" },
        { name: "Border", class: "bg-border" },
        { name: "Input", class: "bg-input" },
        { name: "Ring", class: "bg-ring text-background" },
      ]
    },
    {
      title: "Primary Colors",
      colors: [
        { name: "Primary", class: "bg-primary text-primary-foreground" },
        { name: "Primary Foreground", class: "bg-primary-foreground text-primary" },
      ]
    },
    {
      title: "Secondary Colors", 
      colors: [
        { name: "Secondary", class: "bg-secondary text-secondary-foreground" },
        { name: "Secondary Foreground", class: "bg-secondary-foreground text-secondary" },
      ]
    },
    {
      title: "Accent Colors",
      colors: [
        { name: "Accent", class: "bg-accent text-accent-foreground" },
        { name: "Accent Foreground", class: "bg-accent-foreground text-accent" },
      ]
    },
    {
      title: "Muted Colors",
      colors: [
        { name: "Muted", class: "bg-muted text-muted-foreground" },
        { name: "Muted Foreground", class: "bg-muted-foreground text-muted" },
      ]
    },
    {
      title: "Destructive Colors",
      colors: [
        { name: "Destructive", class: "bg-destructive text-destructive-foreground" },
        { name: "Destructive Foreground", class: "bg-destructive-foreground text-destructive" },
      ]
    },
    {
      title: "Sidebar Colors",
      colors: [
        { name: "Sidebar", class: "bg-sidebar text-sidebar-foreground" },
        { name: "Sidebar Primary", class: "bg-sidebar-primary text-sidebar-primary-foreground" },
        { name: "Sidebar Accent", class: "bg-sidebar-accent text-sidebar-accent-foreground" },
        { name: "Sidebar Border", class: "bg-sidebar-border" },
      ]
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Theme Colors</h1>
      
      <div className="space-y-8">
        {colorSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.colors.map((color) => (
                <Card key={color.name} className="p-4">
                  <div className={`h-24 rounded-md ${color.class} flex items-center justify-center mb-2`}>
                    <span className="font-medium">{color.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{color.name}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePage;
