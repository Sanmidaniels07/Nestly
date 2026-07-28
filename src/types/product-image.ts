export interface DraftImage {
  id: string;

  file?: File;

  preview: string;

  url?: string;

  isCover: boolean;

  uploading: boolean;
}
