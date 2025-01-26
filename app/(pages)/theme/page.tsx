'use client';

import { Card } from "@/components/ui/card";

const ThemePage = () => {
  const colorSections = [
    {
      title: "Generic Colors",
      colors: [
        { name: "Primary Base", class: "bg-[var(--primary-base)] text-white" },
        { name: "Primary Dark", class: "bg-[var(--primary-dark)] text-white" },
        { name: "Secondary Base", class: "bg-[var(--secondary-base)] text-white" },
        { name: "Secondary Dark", class: "bg-[var(--secondary-dark)] text-white" },
        { name: "Destructive Base", class: "bg-[var(--destructive-base)] text-white" },
        { name: "Muted Base", class: "bg-[var(--muted-base)]" },
        { name: "Accent Base", class: "bg-[var(--accent-base)]" },
      ]
    },
    {
      title: "Light Theme",
      colors: [
        { name: "Background", class: "bg-background text-foreground" },
        { name: "Foreground", class: "bg-foreground text-background" },
        { name: "Border", class: "bg-border" },
        { name: "Input", class: "bg-input" },
        { name: "Ring", class: "bg-ring text-white" },
      
      ]
    },
  
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
