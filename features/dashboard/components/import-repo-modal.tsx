"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type ImportRepoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    url: string;
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "CPP" | "C" | "JAVA" | "PYTHON" | "JAVASCRIPT";
  }) => void;
  isImporting: boolean;
};

const ImportRepoModal = ({
  isOpen,
  onClose,
  onSubmit,
  isImporting,
}: ImportRepoModalProps) => {
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [template, setTemplate] = useState<string>("REACT");

  const handleSubmit = () => {
    if (!url) return;
    
    // Quick validation of GitHub URL
    if (!url.includes("github.com")) {
      alert("Please enter a valid GitHub repository URL");
      return;
    }

    onSubmit({
      url,
      title: projectName,
      template: template as any,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isImporting) {
          onClose();
          setUrl("");
          setProjectName("");
          setTemplate("REACT");
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#e93f3f]">
            Open Github Repository
          </DialogTitle>
          <DialogDescription>
            Import an existing GitHub repository into a new playground.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="github-url">GitHub Repository URL</Label>
            <Input
              id="github-url"
              placeholder="https://github.com/facebook/react"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isImporting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Project Name (Optional)</Label>
            <Input
              id="project-name"
              placeholder="Leave empty to use repository name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isImporting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="template">Environment Template</Label>
            <Select 
              value={template} 
              onValueChange={setTemplate}
              disabled={isImporting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REACT">React</SelectItem>
                <SelectItem value="NEXTJS">Next.js</SelectItem>
                <SelectItem value="EXPRESS">Express (Node.js)</SelectItem>
                <SelectItem value="VUE">Vue</SelectItem>
                <SelectItem value="ANGULAR">Angular</SelectItem>
                <SelectItem value="JAVASCRIPT">Vanilla JavaScript</SelectItem>
                <SelectItem value="PYTHON">Python</SelectItem>
                <SelectItem value="JAVA">Java</SelectItem>
                <SelectItem value="CPP">C++</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Select the runtime environment that best matches this repository.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            className="bg-[#E93F3F] hover:bg-[#d03636] min-w-[100px]"
            onClick={handleSubmit}
            disabled={!url || isImporting}
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Import"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportRepoModal;
