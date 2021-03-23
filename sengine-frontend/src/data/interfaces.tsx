export interface ValidComponent {
  serviceUUID: string,
  serviceHash: string,
  form: any,
  files: File[],
  currentFormData: any,//TODO:alias
  formOperations: {
    change: (e:any) => any,//TODO:alias
    update: (e:any) => any//TODO:alias
  }
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
  username: string
}