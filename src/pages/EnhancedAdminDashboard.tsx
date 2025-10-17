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
  content?: string; // Single rich content field
  slug?: string;
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
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    client_name: '',
    access_code: 'OSCAR',
    content: '', // Single rich content field
    tags: '',
    categories: '',
    media_urls: [] as string[],
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    fetchCaseStudies();
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('tags');
      
      if (error) throw error;
      
      // Extract unique tags from all case studies
      const uniqueTags = new Set<string>();
      data?.forEach((study: any) => {
        if (study.tags && Array.isArray(study.tags)) {
          study.tags.forEach((tag: string) => uniqueTags.add(tag));
        }
      });
      
      setAllTags(Array.from(uniqueTags).sort());
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

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
      content: '',
      tags: '',
      categories: '',
      media_urls: [],
      status: 'draft'
    });
    setEditingStudy(null);
  };

  const openEditDialog = (study: CaseStudy) => {
    setEditingStudy(study);
    const tagsString = study.tags.join(', ');
    setFormData({
      title: study.title,
      subtitle: study.subtitle || '',
      client_name: study.client_name,
      access_code: study.access_code,
      content: study.content || '',
      tags: tagsString,
      categories: study.categories.join(', '),
      media_urls: study.media_urls || [],
      status: study.status
    });
    setTagInput(tagsString);
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
        content: originalStudy.content,
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
      toast.error(`Failed to duplicate case study: ${error.message}`);
    }
  };

  const autoSave = useCallback(async () => {
    if (!editingStudy) return;

    try {
      const updateData = {
        title: formData.title,
        subtitle: formData.subtitle,
        client_name: formData.client_name,
        access_code: formData.access_code,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        categories: formData.categories.split(',').map(c => c.trim()).filter(c => c),
        media_urls: formData.media_urls,
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('case_studies')
        .update(updateData)
        .eq('id', editingStudy.id);
        
    } catch (error) {
      // Silent fail for auto-save
    }
  }, [editingStudy, formData]);

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

  const handleSubmit = async () => {
    try {
      if (!formData.title.trim() || !formData.client_name.trim()) {
        toast.error('Please fill in required fields');
        return;
      }

      const submitData = {
        title: formData.title,
        subtitle: formData.subtitle,
        client_name: formData.client_name,
        access_code: formData.access_code,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        categories: formData.categories.split(',').map(c => c.trim()).filter(c => c),
        media_urls: formData.media_urls,
        status: formData.status,
        created_by: user?.id
      };

      if (editingStudy) {
        const { error } = await supabase
          .from('case_studies')
          .update(submitData)
          .eq('id', editingStudy.id);

        if (error) throw error;
        toast.success('Case study updated successfully');
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([submitData]);

        if (error) throw error;
        toast.success('Case study created successfully');
      }

      fetchCaseStudies();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving case study:', error);
      toast.error(`Failed to save case study: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study?')) {
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
    }
  };

  const togglePublish = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('case_studies')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Case study ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      fetchCaseStudies();
    } catch (error) {
      toast.error('Failed to update case study status');
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login');
  };

  const viewCaseStudy = (study: CaseStudy) => {
    if (study.status === 'published') {
      window.open(`/case-study/${study.slug || study.id}`, '_blank');
    } else {
      toast.error('Only published case studies can be viewed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Case Study Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Case Studies</h2>
            <p className="text-muted-foreground">Create and manage your case studies</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Case Study
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudy ? 'Edit Case Study' : 'Create New Case Study'}
                </DialogTitle>
                <DialogDescription>
                  {editingStudy ? 'Update your case study information' : 'Create a new case study with rich content'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Case Study Title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_name">Client Name *</Label>
                    <Input
                      id="client_name"
                      placeholder="Client or Company Name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Brief subtitle or tagline"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="access_code">Access Code</Label>
                  <Input
                    id="access_code"
                    placeholder="Access code for viewing"
                    value={formData.access_code}
                    onChange={(e) => setFormData({...formData, access_code: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Case Study Content</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    placeholder="Write your case study content here. Create sections, add headings, format text, and insert images inline..."
                    height="400px"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the editor to create your case study sections. Add headings (H1-H4), format text, create lists, and insert images inline.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="React, E-commerce, Mobile"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setFormData({...formData, tags: e.target.value});
                        setShowTagSuggestions(true);
                      }}
                      onFocus={() => setShowTagSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    />
                    {showTagSuggestions && tagInput && allTags.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {allTags
                          .filter(tag => tag.toLowerCase().includes(tagInput.split(',').pop()?.trim().toLowerCase() || ''))
                          .map((tag, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-accent/10 cursor-pointer text-sm"
                              onMouseDown={() => {
                                const currentTags = tagInput.split(',').map(t => t.trim()).filter(t => t);
                                currentTags.pop(); // Remove the last incomplete tag
                                currentTags.push(tag);
                                const newValue = currentTags.join(', ') + ', ';
                                setTagInput(newValue);
                                setFormData({...formData, tags: newValue});
                              }}
                            >
                              {tag}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="categories">Categories (comma-separated)</Label>
                    <Input
                      id="categories"
                      placeholder="Web Development, Design, Strategy"
                      value={formData.categories}
                      onChange={(e) => setFormData({...formData, categories: e.target.value})}
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
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingStudy ? 'Update' : 'Create'} Case Study
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Case Studies Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading case studies...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <Card key={study.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{study.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {study.client_name}
                      </CardDescription>
                    </div>
                    <Badge variant={study.status === 'published' ? 'default' : 'secondary'}>
                      {study.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {study.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {study.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{study.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(study)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => viewCaseStudy(study)}
                        disabled={study.status !== 'published'}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      
                      <Button size="sm" variant="outline" onClick={() => duplicateStudy(study.id)}>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant={study.status === 'published' ? 'secondary' : 'default'}
                        onClick={() => togglePublish(study.id, study.status)}
                      >
                        {study.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(study.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {caseStudies.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No case studies found. Create your first one!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EnhancedAdminDashboard;