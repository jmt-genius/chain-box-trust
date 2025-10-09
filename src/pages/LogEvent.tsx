import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { loadBatches, saveBatches, generateHash, generateLedgerRef, type BatchEvent } from '@/lib/demoData';

const LogEvent = () => {
  const { toast } = useToast();
  const batches = loadBatches();
  const [batchId, setBatchId] = useState('');
  const [actor, setActor] = useState('');
  const [role, setRole] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    if (!batchId || !actor || !role || !note) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const batchIndex = batches.findIndex(b => b.id === batchId);
    if (batchIndex === -1) {
      toast({ title: 'Error', description: 'Batch not found', variant: 'destructive' });
      return;
    }

    const newEvent: BatchEvent = {
      id: `evt-${Date.now()}`,
      actor,
      role,
      timestamp: new Date().toISOString(),
      note,
      image: image || undefined,
      hash: generateHash(`${batchId}${actor}${Date.now()}`),
      ledgerRef: generateLedgerRef()
    };

    batches[batchIndex].events.push(newEvent);
    saveBatches(batches);

    toast({ title: 'Success', description: 'Event logged successfully' });

    // Reset form
    setBatchId('');
    setActor('');
    setRole('');
    setNote('');
    setImage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Log Event</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Log Event Form */}
        <Card>
          <CardHeader>
            <CardTitle>Attach Event to Batch</CardTitle>
            <CardDescription>Record a new supply chain event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID *</Label>
              <Select value={batchId} onValueChange={setBatchId}>
                <SelectTrigger id="batchId">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.id} - {batch.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor">Actor Name *</Label>
              <Input
                id="actor"
                placeholder="e.g., FastLogistics"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="3PL">3PL / Logistics</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                  <SelectItem value="Retailer">Retailer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Notes *</Label>
              <Textarea
                id="note"
                placeholder="Describe the event..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                placeholder="/demo/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Log Event
            </Button>
          </CardContent>
        </Card>

        {/* Demo Walkthrough */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Walkthrough</CardTitle>
            <CardDescription>Try logging events to these demo batches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Step 1: Select Batch</h3>
              <p className="text-sm text-muted-foreground">
                Choose one of the demo batches: CHT-001-ABC, CHT-002-XYZ, or CHT-DEMO
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Step 2: Add Actor Details</h3>
              <p className="text-sm text-muted-foreground">
                Example: Actor = "QuickShip Inc", Role = "3PL / Logistics"
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Step 3: Describe Event</h3>
              <p className="text-sm text-muted-foreground">
                Example note: "Package received at distribution center. Temperature maintained at 2-8°C."
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold">Step 4: Optional Image</h3>
              <p className="text-sm text-muted-foreground">
                Add an image URL if you have documentation of the event.
              </p>
            </div>

            <div className="p-4 bg-primary/10 border border-primary rounded-lg">
              <p className="text-sm font-medium">
                💡 Each event generates a unique cryptographic hash and ledger reference for verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogEvent;
