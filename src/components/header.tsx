import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { ThemeToggleDropdown } from "@/components/theme-toggle-dropdown";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image 
            src="/AI-Resume.svg" 
            alt="AI Resume Analyzer Logo" 
            width={24} 
            height={24}
            className="h-6 w-6 dark:invert"
          />
          <h1 className="text-xl font-semibold">AI Resume Analyzer</h1>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            About
          </Button>
          <Button variant="ghost" size="sm">
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
          <ThemeToggleDropdown />
        </nav>
      </div>
    </header>
  );
}
