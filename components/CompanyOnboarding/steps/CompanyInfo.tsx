'use client';

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/Toasts/use-toast";
import { useCompanyOnboarding } from "@/components/CompanyOnboarding/CompanyOnboardingContext";
import { createClient } from "@/utils/supabase/client";
import { updateCompany, getRecruiter, getCompany } from "@/utils/supabase/queries";

// Common industries
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Media",
  "Transportation",
  "Construction",
  "Energy",
  "Agriculture",
  "Real Estate",
  "Legal Services",
  "Consulting",
  "Other"
];

// Form schema
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
});

// Helper to get stored form data
const getStoredFormData = () => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('companyFormData');
    return storedData ? JSON.parse(storedData) : null;
  }
  return null;
};

interface CompanyInfoStepProps {
  onCompletion: (isComplete: boolean) => void;
}

/**
 * CompanyInfoStep Component
 *
 * This component handles the collection and submission of company information
 * during the onboarding process.
 *
 * @component
 * @returns {JSX.Element} The rendered CompanyInfoStep component
 */
export function CompanyInfoStep({ onCompletion }: CompanyInfoStepProps) {
  const { toast } = useToast();
  const { companyData, updateCompanyData, nextStep } = useCompanyOnboarding();
  const [loading, setLoading] = useState(false);
  
  // Get initial data from localStorage or context
  const storedData = getStoredFormData();
  
  // Add local state for form values with localStorage persistence
  const [companyName, setCompanyName] = useState(
    storedData?.companyName || companyData.companyName || ""
  );
  const [location, setLocation] = useState(
    storedData?.location || companyData.location || ""
  );
  const [industry, setIndustry] = useState(
    storedData?.industry || companyData.industry || ""
  );

  // Initialize form with values from local state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: companyName,
      location: location,
      industry: industry,
    },
  });

  // Load existing company data from database in the background
  useEffect(() => {
    async function fetchCompanyData() {
      try {
        // Get current user
        const supabase = await createClient();
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user) {
          console.error("User not found");
          return;
        }

        // Get recruiter to get company ID
        const recruiter = await getRecruiter(userData.user.id);
        
        if (!recruiter || !recruiter.company_id) {
          console.log("No company associated with this recruiter yet");
          return;
        }

        // Get company data
        const company = await getCompany(recruiter.company_id);
        
        if (company) {
          // Only update if we have new data and form is not dirty
          if (!form.formState.isDirty) {
            // Update local state with fetched data
            setCompanyName(company.name || "");
            setLocation(company.location || "");
            setIndustry(company.industry || "");
            
            // Update form with fetched data
            form.reset({
              companyName: company.name || "",
              location: company.location || "",
              industry: company.industry || "",
            });
            
            // Update context with fetched data
            updateCompanyData({
              companyName: company.name || "",
              location: company.location || "",
              industry: company.industry || "",
            });
            
            // Update localStorage
            localStorage.setItem('companyFormData', JSON.stringify({
              companyName: company.name || "",
              location: company.location || "",
              industry: company.industry || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }

    fetchCompanyData();
  }, [form, updateCompanyData]);

  // Watch form values for real-time updates
  const formValues = useWatch({
    control: form.control,
  });

  // Update local state and localStorage when form values change
  useEffect(() => {
    if (formValues.companyName || formValues.location || formValues.industry) {
      // Update local state
      if (formValues.companyName) setCompanyName(formValues.companyName);
      if (formValues.location) setLocation(formValues.location);
      if (formValues.industry) setIndustry(formValues.industry);
      
      // Update context
      updateCompanyData({
        companyName: formValues.companyName || "",
        location: formValues.location || "",
        industry: formValues.industry || "",
      });
      
      // Update localStorage
      localStorage.setItem('companyFormData', JSON.stringify({
        companyName: formValues.companyName || "",
        location: formValues.location || "",
        industry: formValues.industry || "",
      }));
    }
  }, [formValues, updateCompanyData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      throw new Error("User not found");
    }

    try {
      // Update local state
      setCompanyName(values.companyName);
      setLocation(values.location);
      setIndustry(values.industry);
      
      // Update context with form values
      updateCompanyData({
        companyName: values.companyName,
        location: values.location,
        industry: values.industry,
      });
      
      // Update localStorage
      localStorage.setItem('companyFormData', JSON.stringify({
        companyName: values.companyName,
        location: values.location,
        industry: values.industry,
      }));

      // Get the recruiter to fetch the company ID
      const recruiter = await getRecruiter(userData.user.id);
      
      if (!recruiter || !recruiter.company_id) {
        throw new Error("Company information not found");
      }

      // Update the company in the database
      const result = await updateCompany(recruiter.company_id, {
        name: values.companyName,
        location: values.location,
        industry: values.industry,
      });
      
      if (!result) {
        throw new Error("Failed to update company information");
      }

      // Mark this step as complete
      onCompletion(true);
      
      // Proceed to next step
      nextStep();
    } catch (error) {
      console.error("Error saving company info:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save company information. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Event handlers for direct state updates
  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    form.setValue("companyName", e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    form.setValue("location", e.target.value);
  };

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    form.setValue("industry", value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Information</h2>
        <p className="text-muted-foreground">
          Tell us about your company so we can personalize your experience.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Acme Inc." 
                    {...field} 
                    value={companyName}
                    onChange={handleCompanyNameChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headquarters Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="San Francisco, CA" 
                    {...field} 
                    value={location}
                    onChange={handleLocationChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  onValueChange={(value) => handleIndustryChange(value)}
                  value={industry}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industryOption) => (
                      <SelectItem key={industryOption} value={industryOption}>
                        {industryOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
