
import React from 'react';
import { Upload, Brain, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with medical grid */}
      <div className="absolute inset-0 medical-grid opacity-30"></div>
      <div className="absolute inset-0 bg-medical-gradient"></div>
      
      {/* Floating medical elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-medical-primary/10 rounded-full animate-pulse-medical"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-medical-accent/10 rounded-full animate-pulse-medical" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-medical-primary/20 rounded-full animate-pulse-medical" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-6 p-4 medical-glass rounded-full">
            <Brain className="h-8 w-8 text-medical-primary animate-medical-glow" />
            <span className="text-medical-primary font-semibold">AI-Powered Medical Imaging</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-medical-primary to-medical-accent bg-clip-text text-transparent">
            Advanced Brain Tumor
            <br />
            Segmentation Platform
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of YOLO-Seg AI models for precise, real-time brain tumor detection and analysis. 
            Professional-grade medical imaging for healthcare professionals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button className="medical-button-primary group">
            <Upload className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Upload MRI Scan
          </Button>
          <Button variant="outline" className="medical-button-secondary">
            View Demo Analysis
          </Button>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="medical-card hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-medical-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Processing</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI models process MRI scans in under 30 seconds with clinical-grade accuracy.
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-medical-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-medical-accent" />
              </div>
              <h3 className="font-semibold mb-2">Precise Segmentation</h3>
              <p className="text-sm text-muted-foreground">
                YOLO-Seg technology provides pixel-perfect tumor boundary detection and classification.
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-medical-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-medical-warning" />
              </div>
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with end-to-end encryption and compliance standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
