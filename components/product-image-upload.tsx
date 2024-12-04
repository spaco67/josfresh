"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ProductImageUpload({
  value,
  onChange,
  onRemove
}: ProductImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const file = acceptedFiles[0];

      if (!file) return;

      if (file.size > 4 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please upload an image smaller than 4MB'
        });
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'josfresh_products');

      // Upload to Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Upload failed', {
        description: 'Please try again or choose a different image'
      });
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    disabled: loading
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col items-center justify-center">
        {value ? (
          <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-lg">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                size="icon"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={value}
              alt="Product image"
              fill
              className="object-cover"
              sizes="(max-width: 400px) 100vw, 400px"
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`
              w-full max-w-[400px] aspect-square rounded-lg border-2 border-dashed
              flex flex-col items-center justify-center gap-4 cursor-pointer
              transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
              hover:border-primary hover:bg-primary/5
            `}
          >
            <input {...getInputProps()} />
            <div className="p-4 rounded-full bg-primary/10">
              {loading ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              ) : (
                <ImagePlus className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                {loading ? 'Uploading...' : 'Click or drag image to upload'}
              </p>
              <p className="text-sm text-muted-foreground">
                SVG, PNG, JPG or WebP (max. 4MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 