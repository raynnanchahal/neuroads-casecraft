import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AccessGateProps {
  children: React.ReactNode;
}

const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if access code is stored in localStorage
    const storedAccess = localStorage.getItem('case_study_access');
    if (storedAccess === 'granted') {
      setHasAccess(true);
    }
  }, []);

  const verifyAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('verify_access_code', {
        input_code: accessCode
      });

      if (error || !data) {
        toast.error('Invalid access code');
        return;
      }

      setHasAccess(true);
      localStorage.setItem('case_study_access', 'granted');
      toast.success('Access granted!');
    } catch (error) {
      toast.error('Invalid access code');
    } finally {
      setLoading(false);
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Access Required</CardTitle>
          <CardDescription>
            Enter the access code to view case studies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={verifyAccessCode} className="space-y-4">
            <div>
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="text"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="uppercase"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !accessCode}
            >
              {loading ? 'Verifying...' : 'Enter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessGate;