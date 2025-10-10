import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  ScanLine,
  Camera,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  Download,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";

import {
  loadBatches,
  saveBatches,
  generateHash,
  generateLedgerRef,
  type BatchEvent,
  parseQrPayload,
  findBatchById,
  type Batch,
} from "@/lib/demoData";

import QRScanner from "@/components/QRScanner";
import QRCode from "qrcode";

const roles: ReadonlyArray<string> = [
  "Manufacturer",
  "3PL",
  "Warehouse",
  "Distributor",
  "Retailer",
  "Other",
];

export default function LogEvent(): JSX.Element {
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);

  const [batchId, setBatchId] = useState<string>("");
  const [actor, setActor] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const [scanOpen, setScanOpen] = useState<boolean>(false);
  const [lastScan, setLastScan] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");

  const [qrPngUrl, setQrPngUrl] = useState<string>("");
  const [justScanned, setJustScanned] = useState<boolean>(false);

  useEffect(() => {
    setBatches(loadBatches());
  }, []);

  const selectedBatch = useMemo<Batch | undefined>(
    () => batches.find((b) => b.id === batchId),
    [batches, batchId]
  );

  const handleSubmit = (): void => {
    if (!batchId || !actor || !role || !note) {
      toast({
        title: "Missing info",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const batchIndex = batches.findIndex((b) => b.id === batchId);
    if (batchIndex === -1) {
      toast({
        title: "Batch not found",
        description: "Select a valid batch or scan a QR",
        variant: "destructive",
      });
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
      ledgerRef: generateLedgerRef(),
    };

    const next = [...batches];
    next[batchIndex] = {
      ...next[batchIndex],
      events: [...next[batchIndex].events, newEvent],
    };

    setBatches(next);
    saveBatches(next);

    toast({
      title: "Event logged",
      description: "Cryptographic hash & ledger ref generated.",
    });

    setActor("");
    setRole("");
    setNote("");
    setImage("");
  };

  const applyPayload = (decodedText: string): void => {
    setLastScan(decodedText);
    setScanOpen(false);
    setCameraError("");

    // reject plain URLs (non-supply QR)
    if (/^https?:\/\//i.test(decodedText)) {
      toast({
        title: "QR isn’t a supply payload",
        description:
          "You scanned a regular URL. Use a QR with batchId — try the generated test QR.",
        variant: "destructive",
      });
      return;
    }

    const payload = parseQrPayload(decodedText);
    const changed: string[] = [];

    if (payload.batchId) {
      const found = findBatchById(batches, payload.batchId);
      if (found) {
        setBatchId(found.id);
        changed.push(`Batch → ${found.id}`);
      } else {
        toast({
          title: "Batch not found",
          description: `Scanned batch "${payload.batchId}" was not found in demo data.`,
          variant: "destructive",
        });
      }
    }

    if (payload.actor) {
      setActor(payload.actor);
      changed.push(`Actor → ${payload.actor}`);
    }
    if (payload.role && roles.includes(payload.role)) {
      setRole(payload.role);
      changed.push(`Role → ${payload.role}`);
    }
    if (payload.note) {
      setNote(payload.note);
      changed.push(
        `Note → ${payload.note.slice(0, 40)}${
          payload.note.length > 40 ? "…" : ""
        }`
      );
    }
    if (payload.image) {
      setImage(payload.image);
      changed.push("Image URL → set");
    }

    toast({
      title: "QR scanned",
      description:
        changed.length > 0
          ? `Auto-filled: ${changed.join(", ")}`
          : "No fillable fields found. You can submit manually.",
    });
  };

  const handleAutoScanHit = (): void => {
    setJustScanned(true);
    setTimeout(() => setJustScanned(false), 1200);
  };

  const handleGeneratePng = async (): Promise<void> => {
    const payload = JSON.stringify({
      batchId: "CHT-001-ABC",
      actor: "QuickShip Inc",
      role: "3PL",
      note: "Received at WH",
      image: "/demo/wh1.jpg",
    });

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      setQrPngUrl(dataUrl);
      toast({
        title: "Test QR generated",
        description:
          "Download it and try file scan, or show it to your camera.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        title: "QR generation failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Log Event
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Attach Event to Batch</CardTitle>
                  <CardDescription>
                    Record a new supply chain event
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setScanOpen(true)}
                    className="gap-2"
                  >
                    <ScanLine className="h-4 w-4" />
                    Scan QR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePng}
                    className="gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Generate Test QR
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrPngUrl && (
                <div className="rounded-xl border p-3">
                  <img
                    src={qrPngUrl}
                    alt=""
                    className="w-full max-w-[280px] mx-auto"
                  />
                  <div className="flex justify-center mt-2">
                    <a
                      href={qrPngUrl}
                      download="chaintrust-test-qr.png"
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border"
                    >
                      <Download className="h-4 w-4" />
                      Download PNG
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID *</Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger id="batchId" className="w-full">
                    <SelectValue placeholder="Select a batch or scan QR" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.id} — {batch.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBatch && (
                  <div className="text-[11px] text-muted-foreground">
                    <span className="font-medium">Origin:</span>{" "}
                    {selectedBatch.origin}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="actor">Actor Name *</Label>
                <div className="flex gap-2">
                  <Input
                    id="actor"
                    placeholder="e.g., FastLogistics"
                    value={actor}
                    onChange={(e) => setActor(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    aria-label="Fill demo actor"
                    variant="secondary"
                    onClick={() => setActor("QuickShip Inc")}
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r === "3PL" ? "3PL / Logistics" : r}
                      </SelectItem>
                    ))}
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
                {image ? (
                  <div className="rounded-xl border p-2">
                    <img
                      src={image}
                      alt=""
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  </div>
                ) : null}
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button onClick={handleSubmit} className="w-full">
                  Log Event
                </Button>
              </motion.div>

              {lastScan && (
                <div className="p-3 rounded-lg border bg-muted/40 text-xs break-words">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Last QR Payload</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{lastScan}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Demo Walkthrough (older version as requested) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Demo Walkthrough</CardTitle>
              <CardDescription>
                Try logging events to these demo batches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Step 1: Scan or Select Batch
                </h3>
                <p className="text-sm text-muted-foreground">
                  Scan a QR that includes at least a <code>batchId</code> —
                  e.g.:
                </p>
                <div className="text-xs bg-background border rounded-lg p-2 overflow-x-auto">
                  {
                    '{"batchId":"CHT-001-ABC","actor":"QuickShip Inc","role":"3PL","note":"Received at WH"}'
                  }
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Or use one of the demo batches: <b>CHT-001-ABC</b>,{" "}
                  <b>CHT-002-XYZ</b>, or <b>CHT-DEMO</b>.
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold">Step 2: Add Actor Details</h3>
                <p className="text-sm text-muted-foreground">
                  Example: Actor = <b>QuickShip Inc</b>, Role ={" "}
                  <b>3PL / Logistics</b>
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold">Step 3: Describe Event</h3>
                <p className="text-sm text-muted-foreground">
                  Example note:{" "}
                  <i>"Package received at distribution center."</i>
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h3 className="font-semibold">Step 4: Optional Image</h3>
                <p className="text-sm text-muted-foreground">
                  Add an image URL if you have a receipt/photo. We store the
                  hash in the ledger.
                </p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                <p className="text-sm font-medium">
                  💡 Each event generates a unique cryptographic hash and ledger
                  reference for verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Scanner Dialog — centered, clean, animated */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="sm:max-w-[820px]">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-2">
              <Camera className="h-5 w-5" />
              Scan QR Code
            </DialogTitle>
            <DialogDescription>
              Camera opens automatically. Auto-submits on detection.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full flex flex-col items-center">
            <QRScanner
              onDecoded={applyPayload}
              onError={(err) =>
                setCameraError(typeof err === "string" ? err : err.message)
              }
              onAutoScan={() => setJustScanned(true)}
              elementId="qr-reader-logevent"
              regionBox={320}
            />
            {cameraError && (
              <div className="mt-3 text-xs text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{cameraError}</span>
              </div>
            )}
            <AnimatePresence>
              {justScanned && (
                <motion.div
                  className="mt-3 px-3 py-1.5 rounded-full bg-green-600/90 text-white text-xs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  onAnimationComplete={() => setJustScanned(false)}
                >
                  Scan captured ✔ Auto-filled form
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
