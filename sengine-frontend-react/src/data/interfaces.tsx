export interface ValidComponent {
  serviceUUID: string,
  form: any,
  files: File[],
  currentFormData: any
}
export interface subel {
  message: string,
  stack: any | null//TODO:alias
}
export interface util {
  name: string,
  uuid: string,
  uses: number,
  likes: number,
  dislikes: number
}

export interface profDetails {
  utils: [util] | [],
  username:string
}