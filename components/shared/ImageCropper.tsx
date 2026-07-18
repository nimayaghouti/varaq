'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Area, MediaSize } from 'react-easy-crop';
import Cropper from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import getCroppedImg from '@/lib/cropImage';
import { cn } from '@/lib/utils';

type CropVariant = 'cover' | 'square';

interface CropPreset {
  label: string;
  ratio: number | 'original';
}

const SQUARE_PRESETS: CropPreset[] = [{ label: '1:1', ratio: 1 }];

function getCoverPresets(naturalRatio: number): CropPreset[] {
  const inRange = naturalRatio >= 2 / 4 && naturalRatio <= 4 / 5;

  if (!inRange) {
    return [{ label: 'کامل (اصلی)', ratio: 'original' }];
  }

  return [
    { label: 'کامل (اصلی)', ratio: 'original' },
    { label: '۴:۵', ratio: 4 / 5 },
    { label: '۳:۴', ratio: 3 / 4 },
    { label: '۲:۳', ratio: 2 / 3 },
    { label: '۹:۱۶', ratio: 9 / 16 },
  ];
}

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio: number;
  cropVariant?: CropVariant;
}

export function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
  cropVariant,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeAspect, setActiveAspect] = useState(aspectRatio);
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const presets = useMemo<CropPreset[] | null>(() => {
    if (!cropVariant) return null;
    if (cropVariant === 'square') return SQUARE_PRESETS;
    if (naturalRatio === null) return null;
    return getCoverPresets(naturalRatio);
  }, [cropVariant, naturalRatio]);

  const handleContentAnimationEnd = useCallback(
    (event: React.AnimationEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;

      if (event.currentTarget.dataset.state === 'open') {
        setIsReady(true);
      } else {
        setIsReady(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setActiveAspect(aspectRatio);
        setNaturalRatio(null);
      }
    },
    [aspectRatio],
  );

  const handleMediaLoaded = useCallback((mediaSize: MediaSize) => {
    setNaturalRatio(mediaSize.naturalWidth / mediaSize.naturalHeight);
  }, []);

  const resolveRatio = useCallback(
    (preset: CropPreset) =>
      preset.ratio === 'original'
        ? (naturalRatio ?? aspectRatio)
        : preset.ratio,
    [naturalRatio, aspectRatio],
  );

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-125"
        onAnimationEnd={handleContentAnimationEnd}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>برش تصویر</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-87.5 sm:h-100 bg-muted/50 rounded-md overflow-hidden flex items-center justify-center">
          {isReady ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={activeAspect}
              onCropChange={onCropChange}
              onCropComplete={handleCropComplete}
              onZoomChange={onZoomChange}
              onMediaLoaded={handleMediaLoaded}
            />
          ) : (
            <span className="text-sm font-medium text-muted-foreground animate-pulse">
              در حال آماده‌سازی ابزار...
            </span>
          )}
        </div>

        {presets && presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => {
              const ratio = resolveRatio(preset);
              const isActive = Math.abs(ratio - activeAspect) < 0.001;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setActiveAspect(ratio)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full border transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border/60 text-muted-foreground hover:bg-muted',
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter className="mt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            انصراف
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isProcessing || !isReady}
          >
            {isProcessing ? 'در حال پردازش...' : 'تایید برش'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
