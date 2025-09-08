import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export type ImageSourceOption = 'camera' | 'gallery';

export interface PickAndUploadOptions {
  source?: ImageSourceOption;
  pathPrefix?: string;
  fileName?: string;
  quality?: number; // 0-100
}

function base64ToBlob(base64Data: string, contentType: string): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays: Uint8Array[] = [];
  const sliceSize = 512;
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays as BlobPart[], { type: contentType });
}

export async function pickImage(source: ImageSourceOption = 'gallery', quality = 80) {
  const cameraSource = source === 'camera' ? CameraSource.Camera : CameraSource.Photos;
  const result = await Camera.getPhoto({
    quality,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: cameraSource,
    promptLabelHeader: 'Select Image',
    promptLabelPhoto: 'From Gallery',
    promptLabelPicture: 'Take Photo',
  });

  const mimeType = result.format === 'png' ? 'image/png' : 'image/jpeg';
  const blob = base64ToBlob(result.base64String || '', mimeType);
  return { blob, mimeType };
}

export async function uploadImage(blob: Blob, pathPrefix = 'general', fileName?: string): Promise<string> {
  const formData = new FormData();
  const name = fileName || `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  formData.append('image', blob, name);
  formData.append('pathPrefix', pathPrefix);

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload image');
  }

  const data = await response.json();
  const assetBase = import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_URL;
  // Normalize returned URL to use configured asset base
  try {
    const url = new URL(data.imageUrl);
    if (assetBase && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      const normalized = assetBase.replace(/\/$/, '') + url.pathname;
      return normalized;
    }
    return data.imageUrl;
  } catch {
    return data.imageUrl;
  }
}

export async function pickAndUpload(options: PickAndUploadOptions = {}): Promise<string> {
  const { source = 'gallery', pathPrefix = 'general', fileName, quality = 80 } = options;
  const { blob } = await pickImage(source, quality);
  const url = await uploadImage(blob, pathPrefix, fileName);
  return url;
}