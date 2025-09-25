import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, LogOut, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseStudy {
  id: string;
  client_name: string;
  headline: string;
  tags: string[];
  background_image: string;
  overview: string;
  challenge: string;
  solution: string;
  results: any[];
  testimonial?: string;
  published: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    headline: '',
    tags: '',
    background_image: '',
    overview: '',
    challenge: '',
    solution: '',
    testimonial: '',
    published: false
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      toast.error('Failed to fetch case studies');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      headline: '',
      tags: '',
      background_image: '',
      overview: '',
      challenge: '',
      solution: '',
      testimonial: '',
      published: false
    });
    setEditingStudy(null);
  };

  const openEditDialog = (study: CaseStudy) => {
    setEditingStudy(study);
    setFormData({
      client_name: study.client_name,
      headline: study.headline,
      tags: study.tags.join(', '),
      background_image: study.background_image,
      overview: study.overview,
      challenge: study.challenge,
      solution: study.solution,
      testimonial: study.testimonial || '',
      published: study.published
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const caseStudyData = {
        client_name: formData.client_name,
        headline: formData.headline,
        tags: tagsArray,
        background_image: formData.background_image,
        overview: formData.overview,
        challenge: formData.challenge,
        solution: formData.solution,
        testimonial: formData.testimonial || null,
        published: formData.published,
        results: [] // Start with empty results, can be expanded later
      };

      if (editingStudy) {
        const { error } = await supabase
          .from('case_studies')
          .update(caseStudyData)
          .eq('id', editingStudy.id);
        
        if (error) throw error;
        toast.success('Case study updated successfully');
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([caseStudyData]);
        
        if (error) throw error;
        toast.success('Case study created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCaseStudies();
    } catch (error: any) {
      toast.error('Failed to save case study: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Case study deleted successfully');
      fetchCaseStudies();
    } catch (error) {
      toast.error('Failed to delete case study');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Case study ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchCaseStudies();
    } catch (error) {
      toast.error('Failed to update publication status');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your case studies</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Case Studies</h2>
            <p className="text-muted-foreground">
              {caseStudies.length} total case studies
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                New Case Study
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudy ? 'Edit Case Study' : 'Create New Case Study'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for the case study.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="B2B SaaS, Lead Generation, AI Targeting"
                  />
                </div>
                
                <div>
                  <Label htmlFor="background_image">Background Image URL</Label>
                  <Input
                    id="background_image"
                    type="url"
                    value={formData.background_image}
                    onChange={(e) => setFormData({...formData, background_image: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={(e) => setFormData({...formData, overview: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="challenge">Challenge</Label>
                  <Textarea
                    id="challenge"
                    value={formData.challenge}
                    onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="solution">Solution</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({...formData, solution: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="testimonial">Testimonial (optional)</Label>
                  <Textarea
                    id="testimonial"
                    value={formData.testimonial}
                    onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingStudy ? 'Update' : 'Create'} Case Study
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Case Studies Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Card key={study.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={study.background_image}
                  alt={study.client_name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={study.published ? "default" : "secondary"}>
                    {study.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{study.headline}</CardTitle>
                <CardDescription>{study.client_name}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {study.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {study.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{study.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(study.id, study.published)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {study.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(study)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(study.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {caseStudies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-muted-foreground">
              No case studies yet
            </h3>
            <p className="text-muted-foreground">
              Create your first case study to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;