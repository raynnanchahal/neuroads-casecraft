import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface MediaUploadProps {
  mediaUrls: string[];
  onMediaChange: (urls: string[]) => void;
  maxFiles?: number;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mediaUrls,
  onMediaChange,
  maxFiles = 10
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('case-study-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('case-study-media')
        .getPublicUrl(filePath);

      const newUrls = [...mediaUrls, data.publicUrl];
      onMediaChange(newUrls);
      
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  }, [mediaUrls, onMediaChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (mediaUrls.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    Array.from(files).forEach(uploadFile);
    event.target.value = '';
  }, [uploadFile, mediaUrls.length, maxFiles]);

  const removeMedia = useCallback((indexToRemove: number) => {
    const newUrls = mediaUrls.filter((_, index) => index !== indexToRemove);
    onMediaChange(newUrls);
  }, [mediaUrls, onMediaChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading || mediaUrls.length >= maxFiles}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading || mediaUrls.length >= maxFiles}
          onClick={() => {
            const clickableElement = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (clickableElement) {
              clickableElement.click();
            }
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Media'}
        </Button>
      </div>
      
      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMedia(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;