import { useState, useEffect, useCallback } from 'react';
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
import { Plus, Edit, Trash2, LogOut, Eye, Copy, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '@/components/RichTextEditor';
import MediaUpload from '@/components/MediaUpload';

interface CaseStudy {
  id: string;
  title: string;
  subtitle?: string;
  client_name: string;
  access_code: string;
  description?: string;
  challenge?: string;
  solution?: string;
  result?: string;
  tags: string[];
  categories: string[];
  media_urls: string[];
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const EnhancedAdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    client_name: '',
    access_code: 'OSCAR',
    description: '',
    challenge: '',
    solution: '',
    result: '',
    tags: '',
    categories: '',
    media_urls: [] as string[],
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCaseStudies((data as any[]) || []);
    } catch (error) {
      toast.error('Failed to fetch case studies');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      client_name: '',
      access_code: 'OSCAR',
      description: '',
      challenge: '',
      solution: '',
      result: '',
      tags: '',
      categories: '',
      media_urls: [],
      status: 'draft'
    });
    setEditingStudy(null);
  };

  const openEditDialog = (study: CaseStudy) => {
    setEditingStudy(study);
    setFormData({
      title: study.title,
      subtitle: study.subtitle || '',
      client_name: study.client_name,
      access_code: study.access_code,
      description: study.description || '',
      challenge: study.challenge || '',
      solution: study.solution || '',
      result: study.result || '',
      tags: study.tags.join(', '),
      categories: study.categories.join(', '),
      media_urls: study.media_urls || [],
      status: study.status
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const duplicateStudy = async (studyId: string) => {
    try {
      const originalStudy = caseStudies.find(s => s.id === studyId);
      if (!originalStudy) return;

      const duplicatedData = {
        title: `${originalStudy.title} (Copy)`,
        subtitle: originalStudy.subtitle,
        client_name: originalStudy.client_name,
        access_code: originalStudy.access_code,
        description: originalStudy.description,
        challenge: originalStudy.challenge,
        solution: originalStudy.solution,
        result: originalStudy.result,
        tags: originalStudy.tags,
        categories: originalStudy.categories,
        media_urls: originalStudy.media_urls,
        status: 'draft' as const,
        created_by: user?.id
      };

      const { error } = await supabase
        .from('case_studies')
        .insert([duplicatedData]);
      
      if (error) throw error;
      toast.success('Case study duplicated successfully');
      fetchCaseStudies();
    } catch (error: any) {
      toast.error('Failed to duplicate case study: ' + error.message);
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!editingStudy || !formData.title) return;

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const categoriesArray = formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat);
      
      const caseStudyData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        client_name: formData.client_name,
        access_code: formData.access_code,
        description: formData.description || null,
        challenge: formData.challenge || null,
        solution: formData.solution || null,
        result: formData.result || null,
        tags: tagsArray,
        categories: categoriesArray,
        media_urls: formData.media_urls,
        status: formData.status,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        created_by: user?.id
      };

      const { error } = await supabase
        .from('case_studies')
        .update(caseStudyData)
        .eq('id', editingStudy.id);
      
      if (error) throw error;
      // Silently update without showing success message for auto-save
    } catch (error) {
      // Silently fail for auto-save
    }
  }, [editingStudy, formData, user?.id]);

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    if (editingStudy && formData.title) {
      const timeout = setTimeout(() => {
        autoSave();
      }, 2000); // Auto-save after 2 seconds of no changes
      
      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [formData, editingStudy, autoSave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const categoriesArray = formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat);
      
      const caseStudyData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        client_name: formData.client_name,
        access_code: formData.access_code,
        description: formData.description || null,
        challenge: formData.challenge || null,
        solution: formData.solution || null,
        result: formData.result || null,
        tags: tagsArray,
        categories: categoriesArray,
        media_urls: formData.media_urls,
        status: formData.status,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        created_by: user?.id
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

  const togglePublish = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('case_studies')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Case study ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
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
            <h1 className="text-2xl font-bold">Enhanced Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage case studies with rich editing</p>
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudy ? 'Edit Case Study' : 'Create New Case Study'}
                  {editingStudy && <span className="text-sm text-muted-foreground ml-2">(Auto-saving enabled)</span>}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for the case study. Rich text formatting is supported.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_name">Client Name *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="access_code">Access Code</Label>
                    <Input
                      id="access_code"
                      value={formData.access_code}
                      onChange={(e) => setFormData({...formData, access_code: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({...formData, description: value})}
                    placeholder="Write a compelling description..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="challenge">Challenge</Label>
                  <RichTextEditor
                    value={formData.challenge}
                    onChange={(value) => setFormData({...formData, challenge: value})}
                    placeholder="Describe the challenge..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="solution">Solution</Label>
                  <RichTextEditor
                    value={formData.solution}
                    onChange={(value) => setFormData({...formData, solution: value})}
                    placeholder="Explain the solution..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="result">Result</Label>
                  <RichTextEditor
                    value={formData.result}
                    onChange={(value) => setFormData({...formData, result: value})}
                    placeholder="Showcase the results..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="B2B SaaS, Lead Generation, AI"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categories">Categories (comma-separated)</Label>
                    <Input
                      id="categories"
                      value={formData.categories}
                      onChange={(e) => setFormData({...formData, categories: e.target.value})}
                      placeholder="Technology, Marketing, Design"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Media Files</Label>
                  <MediaUpload
                    mediaUrls={formData.media_urls}
                    onMediaChange={(urls) => setFormData({...formData, media_urls: urls})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData({...formData, status: e.target.checked ? 'published' : 'draft'})}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
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
                    <Save className="w-4 h-4 mr-2" />
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
                {study.media_urls.length > 0 && study.media_urls[0] ? (
                  <img
                    src={study.media_urls[0]}
                    alt={study.client_name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={study.status === 'published' ? "default" : "secondary"}>
                    {study.status === 'published' ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{study.title}</CardTitle>
                <CardDescription>{study.client_name}</CardDescription>
                {study.subtitle && (
                  <p className="text-sm text-muted-foreground">{study.subtitle}</p>
                )}
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
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(study.id, study.status)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {study.status === 'published' ? 'Unpublish' : 'Publish'}
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
                    onClick={() => duplicateStudy(study.id)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
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

export default EnhancedAdminDashboard;