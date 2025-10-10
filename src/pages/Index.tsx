import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Scan, ShieldCheck, Sparkles } from 'lucide-react';
import { Box3D } from '@/components/Box3D';
import { GlassCard } from '@/components/GlassCard';
import { QRScanAnimator } from '@/components/QRScanAnimator';
import { Walkthrough } from '@/components/Walkthrough';
import { useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [showTimeline, setShowTimeline] = useState(false);

  const handleScanComplete = () => {
    setShowTimeline(true);
    setTimeout(() => setShowTimeline(false), 5000);
  };

  const walkthroughSteps = [
    {
      target: "try-it-out-btn",
      title: "Try It Out",
      description: "Click here to start creating your first batch and generate QR codes",
      position: "bottom" as const,
    },
    {
      target: "simulate-scan-btn",
      title: "Simulate QR Scan",
      description: "Experience the scanning animation and see how batch verification works",
      position: "top" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Walkthrough steps={walkthroughSteps} storageKey="home-walkthrough" />
      {/* Hero Section with 3D Box */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Next-Gen Supply Chain Verification</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                  Boxity
                </span>
                <br />
                <span className="text-foreground">Trust What You Track.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Scan. Verify. Believe. <br />
                <span className="text-base">Provenance for people. No hardware needed.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                id="try-it-out-btn"
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg shadow-primary/25"
                onClick={() => navigate('/admin')}
              >
                Try it out
              </Button>
              <Button 
                id="simulate-scan-btn"
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate('/verify')}
              >
                Verify Batch
              </Button>
            </div>
          </motion.div>

          {/* Right: 3D Box & QR Scanner */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* 3D Box Visualization */}
            <GlassCard className="h-80 overflow-hidden" hover={false}>
              <Box3D state="sealed" autoRotate />
            </GlassCard>

            {/* QR Scan Simulator */}
            <QRScanAnimator onScanComplete={handleScanComplete} />

            {/* Timeline Preview */}
            {showTimeline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg"
              >
                <p className="text-sm text-muted-foreground mb-2">Preview Timeline:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>SwiftCargo - Dispatched</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>MegaMart - Verified intact</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Process Section with 3D States */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Three simple steps to complete supply chain transparency
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Package,
                title: '1. Create',
                desc: 'Register your product batch',
                detail: 'Add product details, batch information, and generate a unique QR code with verifiable digital identity.',
                state: 'sealed' as const,
              },
              {
                icon: Scan,
                title: '2. Scan & Log',
                desc: 'Track every touchpoint',
                detail: 'Each actor logs events with timestamps, photos, and cryptographic proof at every supply chain step.',
                state: 'in-transit' as const,
              },
              {
                icon: ShieldCheck,
                title: '3. Verify',
                desc: 'Complete journey visibility',
                detail: 'Anyone can scan the QR code to view the full provenance timeline with immutable blockchain records.',
                state: 'sealed' as const,
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <GlassCard className="h-full">
                  <div className="p-6 text-center space-y-4">
                    {/* 3D Box Preview */}
                    <div className="h-40 mb-4">
                      <Box3D state={step.state} autoRotate />
                    </div>

                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center border border-primary/30">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-primary font-medium mb-3">{step.desc}</p>
                      <p className="text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="relative p-12 text-center space-y-6">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10">
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Ready to build trust in your supply chain?
                </motion.h2>
                <motion.p 
                  className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Start tracking your products today with our demo platform. Experience the future of provenance verification.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg shadow-primary/25"
                    onClick={() => navigate('/admin')}
                  >
                    Get Started Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-6"
                    onClick={() => navigate('/verify')}
                  >
                    View Demo
                  </Button>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
