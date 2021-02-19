export interface SearchConditions {
  numFiles: number;
  serviceName: string;
}
export interface ValidComponent {
  serviceName: string;
  satisfied: boolean;
  initParams: any;
  params: any;
}
