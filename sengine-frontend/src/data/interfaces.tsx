export interface SearchConditions {
  numFiles: number;
  serviceUUID: string;
}
export interface ValidComponent {
  serviceUUID: string;
  numFilesIn: number;
  numFilesOut: number;
  satisfied: boolean;
  params: any;
}
