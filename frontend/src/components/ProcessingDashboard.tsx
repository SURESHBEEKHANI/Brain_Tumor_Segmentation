
import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, AlertTriangle, Brain, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProcessingJob {
  id: string;
  filename: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  estimatedTime?: number;
  results?: {
    tumorDetected: boolean;
    confidence: number;
    volume: number;
  };
}

const ProcessingDashboard = () => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([
    {
      id: '1',
      filename: 'brain_scan_001.dcm',
      status: 'processing',
      progress: 67,
      startTime: new Date(Date.now() - 45000),
      estimatedTime: 25
    },
    {
      id: '2',
      filename: 'mri_sequence_t1.nii',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 180000),
      results: {
        tumorDetected: true,
        confidence: 94.7,
        volume: 12.3
      }
    },
    {
      id: '3',
      filename: 'brain_scan_002.dcm',
      status: 'queued',
      progress: 0,
      startTime: new Date()
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status === 'processing' && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 5, 100);
          return {
            ...job,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'processing',
            ...(newProgress >= 100 && {
              results: {
                tumorDetected: Math.random() > 0.3,
                confidence: 85 + Math.random() * 15,
                volume: Math.random() * 20
              }
            })
          };
        }
        return job;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-medical-primary animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-medical-success" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: ProcessingJob['status']) => {
    const variants = {
      queued: 'secondary',
      processing: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;
    
    const colors = {
      queued: 'bg-muted text-muted-foreground',
      processing: 'bg-medical-primary text-white animate-pulse',
      completed: 'bg-medical-success text-white',
      failed: 'bg-destructive text-white'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-medical-primary mb-2">Processing Dashboard</h2>
        <p className="text-muted-foreground">Monitor real-time analysis of your MRI scans</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scanned</p>
                <p className="text-2xl font-bold text-medical-primary">1,247</p>
              </div>
              <Brain className="h-8 w-8 text-medical-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-medical-primary">
                  {jobs.filter(job => job.status === 'processing').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-medical-primary/60 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing</p>
                <p className="text-2xl font-bold text-medical-primary">28s</p>
              </div>
              <Clock className="h-8 w-8 text-medical-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-medical-success">98.7%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-medical-success/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Queue */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-medical-primary" />
            Processing Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="font-medium">{job.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        Started at {formatTime(job.startTime)}
                        {job.estimatedTime && job.status === 'processing' && (
                          <span> • Est. {job.estimatedTime}s remaining</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(job.status)}
                    {job.status === 'completed' && (
                      <Button size="sm" variant="outline" className="medical-button-secondary">
                        <Eye className="h-4 w-4 mr-1" />
                        View Results
                      </Button>
                    )}
                  </div>
                </div>

                {job.status === 'processing' && (
                  <div className="processing-indicator mb-3">
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}

                {job.results && (
                  <div className="flex items-center gap-6 text-sm bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        job.results.tumorDetected ? 'bg-medical-warning' : 'bg-medical-success'
                      }`}></div>
                      <span>
                        {job.results.tumorDetected ? 'Tumor Detected' : 'No Tumor Detected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-medium">{job.results.confidence.toFixed(1)}%</span>
                    </div>
                    {job.results.tumorDetected && (
                      <div>
                        <span className="text-muted-foreground">Volume: </span>
                        <span className="font-medium">{job.results.volume.toFixed(1)} cm³</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingDashboard;
