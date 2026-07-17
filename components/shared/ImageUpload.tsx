'use client';

import { Crop, ImagePlus, X } from 'lucide-react';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ImageCropper } from '@/components/shared/ImageCropper';

import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | File | null;
  onChange: (value: File | string | null) => void;
  disabled?: boolean;
  aspectRatio?: number;
  cropVariant?: 'cover' | 'square';
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  aspectRatio = 1,
  cropVariant,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(null);
      return;
    }

    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileSelect = useCallback((file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً فقط فایل تصویری انتخاب کنید.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setTempImageForCrop(objectUrl);
    setIsCropperOpen(true);
  }, []);

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      handleFileSelect(file);
    },
    [disabled, handleFileSelect],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);

    e.target.value = '';
  };

  const onRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  const onEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (preview) {
      setTempImageForCrop(preview);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    onChange(croppedFile);
    setIsCropperOpen(false);
    setTempImageForCrop(null);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() =>
          !disabled && document.getElementById('image-upload-input')?.click()
        }
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors overflow-hidden group',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-muted/30'
            : 'cursor-pointer hover:bg-muted/30',
          isDragging ? 'border-primary bg-primary/5' : 'border-border/50',
          preview ? 'border-none' : '',
        )}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={disabled}
        />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              unoptimized={preview.startsWith('blob:')}
            />

            {!disabled && (
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1.5 bg-destructive text-destructive-foreground rounded-md shadow-sm hover:bg-destructive/90 transition-colors"
                  title="حذف تصویر"
                >
                  <X className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={onEditClick}
                  className="p-1.5 bg-secondary text-secondary-foreground rounded-md shadow-sm hover:bg-secondary/80 transition-colors"
                  title="ویرایش تصویر"
                >
                  <Crop className="size-4" />
                </button>
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-white font-medium text-sm">
                برای تغییر تصویر کلیک کنید
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <div className="p-4 bg-muted/50 rounded-full mb-3">
              <ImagePlus className="size-8" />
            </div>
            <p className="text-sm font-bold mb-1">برای آپلود کلیک کنید</p>
            <p className="text-xs">یا تصویر را اینجا بکشید و رها کنید</p>
            <p className="text-[10px] mt-2 opacity-70">
              JPG, PNG, WEBP (حداکثر ۵ مگابایت)
            </p>
          </div>
        )}
      </div>

      {tempImageForCrop && (
        <ImageCropper
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={tempImageForCrop}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
          cropVariant={cropVariant}
        />
      )}
    </div>
  );
}
