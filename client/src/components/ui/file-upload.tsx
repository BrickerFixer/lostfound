import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="relative border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !preview && fileInputRef.current?.click()}
    >
      <Input
        ref={fileInputRef}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {preview ? (
        <div className="relative p-1">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-48 mx-auto object-contain rounded"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            {selectedFile?.name} ({selectedFile && typeof selectedFile.size === 'number' ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0'} МБ)
          </p>
        </div>
      ) : (
        <div className="space-y-2 p-6">
          <ImageIcon className="mx-auto w-12 h-12 text-gray-400" />
          <p className="text-sm text-gray-500">Нажмите для загрузки или перетащите файл</p>
        </div>
      )}
    </div>
  );
}
