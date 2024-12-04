"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cloudinaryConfig } from "@/lib/cloudinary-config";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ImageUpload({
  value,
  onChange,
  onRemove
}: ImageUploadProps) {
  const onUpload = (result: any) => {
    if (result?.info?.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-full">
        {value ? (
          <div className="relative w-full h-[200px]">
            <Image
              fill
              src={value}
              alt="Upload"
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Button
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <CldUploadWidget
            onUpload={onUpload}
            uploadPreset={cloudinaryConfig.uploadPreset}
            options={{
              maxFiles: 1,
              resourceType: "image",
              folder: cloudinaryConfig.folder,
              clientAllowedFormats: ["images"],
              maxImageFileSize: 2000000,
              sources: ["local", "camera", "url"],
              multiple: false,
              styles: cloudinaryConfig.styles
            }}
          >
            {({ open }) => (
              <div 
                onClick={() => open?.()}
                className="w-full cursor-pointer hover:opacity-75 transition border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-white rounded-full">
                    <ImagePlus className="h-10 w-10 text-gray-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">Click to upload</p>
                    <p className="text-sm text-gray-500">
                      SVG, PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
} 