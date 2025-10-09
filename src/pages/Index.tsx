import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Scan, ShieldCheck } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Boxity — See every step.
            <br />
            <span className="text-primary">Trust every package.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Provenance for people. Scan a QR, verify the journey. No hardware needed.
          </p>

          <div className="pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/admin')}
            >
              Try it out
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>1. Create</CardTitle>
                <CardDescription>Register your product batch and generate a unique QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add product details, batch information, and create a verifiable digital identity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Scan className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>2. Scan & Log</CardTitle>
                <CardDescription>Track every touchpoint in the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Each actor logs events with timestamps, photos, and cryptographic proof.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>3. Verify</CardTitle>
                <CardDescription>Anyone can verify the complete journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Scan the QR code to view the full provenance timeline with immutable records.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to build trust in your supply chain?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Start tracking your products today with our demo platform.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/admin')}
              >
                Get Started Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
