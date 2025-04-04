import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import AddItemModal from "@/components/AddItemModal";
import { Item } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { data: items, isLoading, isError } = useQuery<Item[]>({
    queryKey: searchQuery 
      ? [`/api/items/search?query=${encodeURIComponent(searchQuery)}`]
      : ['/api/items'],
    staleTime: 60000, // 1 minute
  });

  return (
    <>
      <Header 
        isSearchVisible={isSearchVisible} 
        setIsSearchVisible={setIsSearchVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">Произошла ошибка при загрузке предметов</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </Button>
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Предметы не найдены</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(true)}
            >
              Сообщить о находке
            </Button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-0 left-0 flex justify-center z-20">
        <Button 
          className="w-14 h-14 rounded-full shadow-lg" 
          onClick={() => setIsAddModalOpen(true)}
          size="icon"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
