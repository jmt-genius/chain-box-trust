import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loadBatches, type Batch } from '@/lib/demoData';
import { Search, Package, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Verify = () => {
  const [searchId, setSearchId] = useState('');
  const [batch, setBatch] = useState<Batch | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const batches = loadBatches();
    const found = batches.find(b => b.id === searchId.trim());
    
    if (found) {
      setBatch(found);
      setNotFound(false);
    } else {
      setBatch(null);
      setNotFound(true);
    }
  };

  const demoSuggestions = ['CHT-001-ABC', 'CHT-002-XYZ', 'CHT-DEMO'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Verify Batch</h1>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enter Batch ID</CardTitle>
          <CardDescription>Verify the provenance and history of a batch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="searchId">Batch ID</Label>
              <Input
                id="searchId"
                placeholder="e.g., CHT-001-ABC"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Get Log
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
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setSearchId(id);
                    const batches = loadBatches();
                    const found = batches.find(b => b.id === id);
                    if (found) {
                      setBatch(found);
                      setNotFound(false);
                    }
                  }}
                >
                  {id}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
          className="space-y-6"
        >
          {/* Batch Info */}
          <Card>
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
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Timeline</CardTitle>
              <CardDescription>{batch.events.length} events recorded</CardDescription>
            </CardHeader>
            <CardContent>
              {batch.events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events logged yet</p>
              ) : (
                <div className="space-y-6">
                  {batch.events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 pb-6 border-l-2 border-primary last:border-l-0 last:pb-0"
                    >
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                      
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{event.actor}</h4>
                            <Badge variant="secondary" className="mt-1">{event.role}</Badge>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground">{event.note}</p>

                        {event.image && (
                          <img 
                            src={event.image} 
                            alt="Event documentation" 
                            className="w-48 h-48 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        )}

                        <div className="space-y-2 p-3 bg-muted rounded-lg text-sm font-mono">
                          <div>
                            <span className="text-muted-foreground">Hash: </span>
                            <span className="text-xs break-all">{event.hash}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Ledger: </span>
                            <span className="text-xs break-all flex-1">{event.ledgerRef}</span>
                            <ExternalLink className="h-3 w-3 text-primary cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Verify;
