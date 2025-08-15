
import React, { useState, useCallback } from 'react';
import { Upload, File, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });

    toast.success(`${fileList.length} file(s) uploaded successfully`);
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100);
          const isCompleted = newProgress >= 100;
          
          return {
            ...file,
            progress: newProgress,
            status: isCompleted ? 'completed' : 'uploading'
          };
        }
        return file;
      }));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, progress: 100, status: 'completed' } : file
      ));
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="text-2xl text-medical-primary flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload MRI Scans
          </CardTitle>
          <p className="text-muted-foreground">
            Upload DICOM, NIfTI, PNG, or JPEG files for brain tumor segmentation analysis.
          </p>
        </CardHeader>
        
        <CardContent>
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${dragActive 
                ? 'border-medical-primary bg-medical-primary/5 scale-105' 
                : 'border-border hover:border-medical-primary/50 hover:bg-medical-primary/2'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="scan-overlay">
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full transition-colors duration-200 ${
                  dragActive ? 'bg-medical-primary text-white' : 'bg-medical-primary/10 text-medical-primary'
                }`}>
                  <Upload className="h-8 w-8" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {dragActive ? 'Drop files here' : 'Upload Medical Images'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your MRI scans here, or click to browse
                  </p>
                  
                  <Button 
                    className="medical-button-primary"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    Choose Files
                  </Button>
                  
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".dcm,.nii,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Supported formats: DICOM (.dcm), NIfTI (.nii), PNG, JPEG • Max size: 100MB per file
                </div>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-foreground">Uploaded Files</h4>
              {files.map(file => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <File className="h-4 w-4 text-medical-primary flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="processing-indicator">
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-medical-success" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
