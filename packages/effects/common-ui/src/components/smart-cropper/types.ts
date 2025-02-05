import type Cropper from 'cropperjs';

import type { CSSProperties } from 'vue';

type CropperCrossOrigin = '' | 'anonymous' | 'use-credentials';

interface BaseCropperProps {
  alt?: string;
  circled?: boolean;
  crossOrigin?: CropperCrossOrigin;
  height?: string;
  imageStyle?: CSSProperties;
  options?: Cropper.Options;
  realTimePreview?: boolean;
  imgSrc: string;
}

interface CropperProps extends BaseCropperProps {
  showPreview?: boolean;
  showToolbar?: boolean;
}

interface CropendResult {
  imgBase64: string;
  imgInfo: Cropper.Data;
}

interface CropperEvents {
  afterCrop: [CropendResult];
  cropEndError: [];
  ready: [Cropper];
}

interface CropperChooseProps {
  width?: number | string;
  value?: string;
  showButton?: boolean;
  buttonProps?: any;
  buttonText?: string;
  size?: number;
}

export type {
  BaseCropperProps,
  CropendResult,
  Cropper,
  CropperChooseProps,
  CropperEvents,
  CropperProps,
};
