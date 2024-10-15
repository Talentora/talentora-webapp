"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { createClient } from '@/utils/supabase/client';

interface CompanyFormProps {
  companyName: string;
  companySize: string;
  industry: string;
}

export default function CompanyForm({ companyName, companySize, industry }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormProps>({
    defaultValues: { companyName, companySize, industry }
  });

  const onSubmit = async (data: CompanyFormProps) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('user_details')
        .update({
          company_name: data.companyName,
          company_size: data.companySize,
          industry: data.industry
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      toast.success('Company information updated successfully!');
    } catch (error) {
      console.error('Error updating company information:', error);
      toast.error('Failed to update company information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          {...register('companyName', { required: 'Company name is required' })}
          id="companyName"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
      </div>

      <div>
        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
          Company Size
        </label>
        <select
          {...register('companySize', { required: 'Company size is required' })}
          id="companySize"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501+">501+ employees</option>
        </select>
        {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize.message}</p>}
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <input
          {...register('industry', { required: 'Industry is required' })}
          id="industry"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? 'Updating...' : 'Update Company Information'}
      </button>
    </form>
  );
}