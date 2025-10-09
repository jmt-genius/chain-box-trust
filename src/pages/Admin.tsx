import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { loadBatches, saveBatches, type Batch } from '@/lib/demoData';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

const Admin = () => {
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>(loadBatches());
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [batchId, setBatchId] = useState('');
  const [baselineImage, setBaselineImage] = useState('');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [currentQR, setCurrentQR] = useState({ id: '', dataUrl: '' });

  const generateBatchId = () => {
    const prefix = 'CHT';
    const random1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const random2 = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${random1}-${random2}`;
  };

  const handleCreateBatch = async () => {
    if (!productName) {
      toast({ title: 'Error', description: 'Product name is required', variant: 'destructive' });
      return;
    }

    const finalBatchId = batchId || generateBatchId();
    const newBatch: Batch = {
      id: finalBatchId,
      productName,
      sku: sku || undefined,
      origin: 'Your Company',
      createdAt: new Date().toISOString(),
      baselineImage: baselineImage || '/demo/placeholder.jpg',
      events: []
    };

    const updatedBatches = [newBatch, ...batches];
    setBatches(updatedBatches);
    saveBatches(updatedBatches);

    // Generate QR code
    try {
      const qrDataUrl = await QRCode.toDataURL(finalBatchId, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      setCurrentQR({ id: finalBatchId, dataUrl: qrDataUrl });
      setQrDialogOpen(true);
    } catch (error) {
      console.error('QR generation error:', error);
    }

    // Reset form
    setProductName('');
    setSku('');
    setBatchId('');
    setBaselineImage('');

    toast({ title: 'Success', description: `Batch ${finalBatchId} created successfully` });
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `qr-${currentQR.id}.png`;
    link.href = currentQR.dataUrl;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Create Batch Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Batch</CardTitle>
            <CardDescription>Register a new product batch in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                placeholder="e.g., VitaTabs 10mg"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                placeholder="e.g., VT-10MG-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <div className="flex gap-2">
                <Input
                  id="batchId"
                  placeholder="Auto-generated if empty"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBatchId(generateBatchId())}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baselineImage">Baseline Image URL (Optional)</Label>
              <Input
                id="baselineImage"
                placeholder="/demo/product.jpg"
                value={baselineImage}
                onChange={(e) => setBaselineImage(e.target.value)}
              />
            </div>

            <Button onClick={handleCreateBatch} className="w-full">
              Create Batch
            </Button>
          </CardContent>
        </Card>

        {/* Demo Batches Info */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Batches Available</CardTitle>
            <CardDescription>Pre-loaded batches for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold">CHT-001-ABC</p>
                <p className="text-sm text-muted-foreground">VitaTabs 10mg (2 events)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold">CHT-002-XYZ</p>
                <p className="text-sm text-muted-foreground">ColdVax (1 event)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold">CHT-DEMO</p>
                <p className="text-sm text-muted-foreground">Generic Demo Product (2 events)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batches Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Batches</CardTitle>
          <CardDescription>List of all registered batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-semibold">{batch.id}</TableCell>
                    <TableCell>{batch.productName}</TableCell>
                    <TableCell>{batch.sku || '-'}</TableCell>
                    <TableCell>{batch.origin}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{batch.events.length} events</Badge>
                    </TableCell>
                    <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batch Created Successfully</DialogTitle>
            <DialogDescription>
              Batch ID: <span className="font-mono font-semibold">{currentQR.id}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {currentQR.dataUrl && (
              <img src={currentQR.dataUrl} alt="QR Code" className="w-64 h-64" />
            )}
            <Button onClick={downloadQR} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
