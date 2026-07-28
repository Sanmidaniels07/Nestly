export type MediaType = "IMAGE" | "VIDEO";

export interface UploadedFile {
  url: string;
  type: MediaType;
}
