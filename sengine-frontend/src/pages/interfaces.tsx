export interface SearchConditions {
  numFiles: number;
  serviceUUID: string;
}
export interface ValidComponent {
  serviceUUID: string;
  numFiles: number;
  satisfied: boolean;
  params: string[];
}
