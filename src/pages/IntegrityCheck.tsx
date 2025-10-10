import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle, CheckCircle } from "lucide-react";
import { Box3D } from "@/components/Box3D";
import { useToast } from "@/hooks/use-toast";

interface DifferenceResult {
  location: string;
  severity: "low" | "medium" | "high";
  description: string;
}

export default function IntegrityCheck() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [differences, setDifferences] = useState<DifferenceResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "before") {
          setBeforeImage(reader.result as string);
        } else {
          setAfterImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const checkIntegrity = () => {
    if (!beforeImage || !afterImage) {
      toast({
        title: "Missing images",
        description: "Please upload both before and after images",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      const hardcodedDifferences: DifferenceResult[] = [
        {
          location: "Top-right corner",
          severity: "medium",
          description: "Visible dent detected (3.2mm depth)",
        },
        {
          location: "Left side panel",
          severity: "low",
          description: "Minor surface scratches",
        },
        {
          location: "Seal integrity",
          severity: "high",
          description: "Seal appears tampered - security breach detected",
        },
      ];

      setDifferences(hardcodedDifferences);
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: `Found ${hardcodedDifferences.length} differences`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Box Integrity Checker
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload before and after images to detect tampering and damage
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Before Section */}
          <GlassCard className="p-6" id="before-upload">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Before (Baseline)
            </h3>
            <div className="aspect-square bg-secondary/20 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center mb-4 overflow-hidden">
              {beforeImage ? (
                <img
                  src={beforeImage}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Upload baseline image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "before")}
              className="hidden"
              id="before-input"
            />
            <Button
              onClick={() => document.getElementById("before-input")?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Before Image
            </Button>
            <div className="h-64 mt-6">
              <Box3D state="sealed" />
            </div>
          </GlassCard>

          {/* After Section */}
          <GlassCard className="p-6" id="after-upload">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              After (Current)
            </h3>
            <div className="aspect-square bg-secondary/20 rounded-lg border-2 border-dashed border-orange-500/30 flex flex-col items-center justify-center mb-4 overflow-hidden">
              {afterImage ? (
                <img
                  src={afterImage}
                  alt="After"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Upload current image</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "after")}
              className="hidden"
              id="after-input"
            />
            <Button
              onClick={() => document.getElementById("after-input")?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload After Image
            </Button>
            <div className="h-64 mt-6">
              <Box3D state={differences ? "damaged" : "in-transit"} />
            </div>
          </GlassCard>
        </div>

        {/* Check Integrity Button */}
        <div className="text-center mb-8" id="check-integrity-btn">
          <Button
            onClick={checkIntegrity}
            disabled={isAnalyzing}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white px-12 py-6 text-lg"
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 mr-2" />
                Check Integrity
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {differences && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Detected Differences
              </h3>
              <div className="space-y-4">
                {differences.map((diff, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      diff.severity === "high"
                        ? "bg-red-500/10 border-red-500"
                        : diff.severity === "medium"
                        ? "bg-orange-500/10 border-orange-500"
                        : "bg-yellow-500/10 border-yellow-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{diff.location}</h4>
                        <p className="text-sm text-muted-foreground">
                          {diff.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          diff.severity === "high"
                            ? "bg-red-500/20 text-red-300"
                            : diff.severity === "medium"
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {diff.severity.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
