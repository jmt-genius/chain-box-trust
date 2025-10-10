import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Walkthrough } from '@/components/Walkthrough';
import { loadBatches, type Batch } from '@/lib/demoData';
import { Search, Package } from 'lucide-react';
import { QRScanAnimator } from '@/components/QRScanAnimator';
import { AnimatedTimeline } from '@/components/AnimatedTimeline';
import { GlassCard } from '@/components/GlassCard';

const Verify = () => {
  const [searchId, setSearchId] = useState('');
  const [batch, setBatch] = useState<Batch | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = () => {
    setIsScanning(true);
    setTimeout(() => {
      const batches = loadBatches();
      const found = batches.find(b => b.id === searchId.trim());
      
      if (found) {
        setBatch(found);
        setNotFound(false);
      } else {
        setBatch(null);
        setNotFound(true);
      }
      setIsScanning(false);
    }, 2500);
  };

  const handleScanComplete = (batchId: string) => {
    setSearchId(batchId);
    const batches = loadBatches();
    const found = batches.find(b => b.id === batchId);
    if (found) {
      setBatch(found);
      setNotFound(false);
    }
  };

  const demoSuggestions = ['CHT-001-ABC', 'CHT-002-XYZ', 'CHT-DEMO'];

  const walkthroughSteps = [
    {
      target: "batch-id-input",
      title: "Enter Batch ID",
      description: "Type or paste a batch ID here to verify its journey through the supply chain",
      position: "bottom" as const,
    },
    {
      target: "verify-btn",
      title: "Verify Batch",
      description: "Click to retrieve and display the complete timeline for this batch",
      position: "top" as const,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Walkthrough steps={walkthroughSteps} storageKey="verify-walkthrough" />
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Verify Batch
      </motion.h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Search Form */}
        <div className="space-y-6">
          <GlassCard>
            <CardHeader>
              <CardTitle>Enter Batch ID</CardTitle>
              <CardDescription>Verify the provenance and history of a batch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="searchId">Batch ID</Label>
                  <Input
                    id="batch-id-input"
                    placeholder="e.g., CHT-001-ABC"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button id="verify-btn" onClick={handleSearch} disabled={isScanning}>
                    <Search className="mr-2 h-4 w-4" />
                    {isScanning ? 'Scanning...' : 'Get Log'}
                  </Button>
                </div>
              </div>

              {/* Demo Suggestions */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Try these demo batches:</p>
                <div className="flex flex-wrap gap-2">
                  {demoSuggestions.map(id => (
                    <Badge
                      key={id}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => {
                        setSearchId(id);
                        handleSearch();
                      }}
                    >
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* QR Scanner */}
          <QRScanAnimator onScanComplete={handleScanComplete} batchId="CHT-001-ABC" />
        </div>

        {/* Info/Instructions */}
        <GlassCard>
          <CardHeader>
            <CardTitle>How to Verify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h3 className="font-semibold">Option 1: Manual Entry</h3>
              <p className="text-sm text-muted-foreground">
                Enter a batch ID in the search box and click "Get Log" to view its complete provenance timeline.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h3 className="font-semibold">Option 2: Simulate QR Scan</h3>
              <p className="text-sm text-muted-foreground">
                Click "Simulate Scan" to experience the QR code scanning animation and automatically load batch data.
              </p>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium">
                💡 Each event is cryptographically signed and includes immutable blockchain references for complete transparency.
              </p>
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Not Found Message */}
      {notFound && (
        <Alert variant="destructive">
          <AlertDescription>
            Batch ID "{searchId}" not found. Try one of the demo batches above.
          </AlertDescription>
        </Alert>
      )}

      {/* Batch Details & Timeline */}
      {batch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mt-8"
        >
          {/* Batch Info */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {batch.productName}
              </CardTitle>
              <CardDescription>Batch ID: {batch.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-semibold">{batch.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-semibold">{batch.sku || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">{new Date(batch.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {batch.baselineImage && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Baseline Image</p>
                  <img 
                    src={batch.baselineImage} 
                    alt="Baseline product" 
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </GlassCard>

          {/* Timeline */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Supply Chain Timeline</CardTitle>
              <CardDescription>{batch.events.length} events recorded</CardDescription>
            </CardHeader>
            <CardContent>
              {batch.events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events logged yet</p>
              ) : (
                <AnimatedTimeline events={batch.events} />
              )}
            </CardContent>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default Verify;
