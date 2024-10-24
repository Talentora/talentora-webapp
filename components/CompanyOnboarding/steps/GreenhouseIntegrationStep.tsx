import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompany } from '@/hooks/useCompany';
import { createClient } from '@/utils/supabase/client';
import { ToastAction } from '@/components/Toasts/toast';
import { useToast } from '@/components/Toasts/use-toast';
import { Loader2 } from 'lucide-react';

export const GreenhouseIntegrationStep: React.FC<{ onCompletion: (isComplete: boolean) => void }> = ({ onCompletion }) => {
  const { company, loading } = useCompany(); // Added isLoading
  const hasGreenhouseKey = company?.greenhouse_api_key;
  const { toast } = useToast();
  const [greenhouseKey, setGreenhouseKey] = useState<string>('');

  useEffect(() => {
    onCompletion(hasGreenhouseKey ? true : false);
  }, [hasGreenhouseKey]);

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

      onCompletion(true); // Mark step as complete and navigate to next step

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

  if (loading) {
    return <Loader2 />; // Loading icon
  }

  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Greenhouse Integration</h3>
        {
          hasGreenhouseKey &&
            <p><i>Your company is already associated with a Greenhouse API key. If you need to update your Greenhouse API key, please contact support.</i>  </p>
        }
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="greenhouse-key">Greenhouse API Key</Label>
          <Input
            type='password'
            id="greenhouse-key"
            placeholder="Enter your Greenhouse API key"
            
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