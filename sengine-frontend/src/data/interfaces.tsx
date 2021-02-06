export interface SearchConditions {
  numFiles: number;
  serviceUUID: string;
}
export interface ValidComponent {
  serviceUUID: string;
  numFilesAllowed: number;
  satisfied: boolean;
  params: any;
}
