import { Button } from "@/components/ui/button";
import { FileText, Github } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-xl font-semibold">AI Resume Processor</h1>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            About
          </Button>
          <Button variant="ghost" size="sm">
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </nav>
      </div>
    </header>
  );
}
