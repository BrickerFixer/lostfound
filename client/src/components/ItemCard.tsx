import { Link } from "wouter";
import { Item } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative pb-[65%] bg-gray-200">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Найдено: {item.location}</p>
        <p className="text-sm text-gray-500">Дата: {item.dateFound}</p>
        <Link href={`/items/${item.id}`}>
          <Button className="mt-3 w-full">
            Посмотреть детали
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
