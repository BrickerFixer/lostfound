import { Dispatch, SetStateAction } from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface HeaderProps {
  isSearchVisible: boolean;
  setIsSearchVisible: Dispatch<SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export default function Header({ 
  isSearchVisible, 
  setIsSearchVisible,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h1 className="text-xl font-bold">Findee</h1>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>
      </div>
      
      {isSearchVisible && (
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      )}
    </header>
  );
}
