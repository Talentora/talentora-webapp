import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompany } from '@/hooks/useCompany';
import { createClient } from '@/utils/supabase/client';
import { ToastAction } from '@/components/Toasts/toast';
import { useToast } from '@/components/Toasts/use-toast';
import { useRecruiter } from '@/hooks/useRecruiter';
import { useUser } from '@/hooks/useUser';
export const GreenhouseIntegrationStep = () => {
  const { company } = useCompany();
  const { toast } = useToast();
  const [greenhouseKey, setGreenhouseKey] = useState<string>('');

  const handleGreenhouseIntegration = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = createClient();

    try {
      


      const { error: updateError } = await supabase
        .from('companies')
        .update({ greenhouse_api_key: greenhouseKey })
        .eq('id', company?.id || '');

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Greenhouse API key saved successfully",
        duration: 5000,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save Greenhouse API key. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const { recruiter } = useRecruiter();
  const { user } = useUser();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Greenhouse Integration</h3>
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="greenhouse-key">Greenhouse API Key</Label>
        <Input
          type="password"
          id="greenhouse-key"
          placeholder="Enter your Greenhouse API key"
          value={greenhouseKey}
          onChange={(e) => setGreenhouseKey(e.target.value)}
          required
        />
      </div>
      <Button onClick={handleGreenhouseIntegration}>
        Connect Greenhouse
      </Button>
    </div>
  );
};
