export interface ValidComponent {
  serviceUUID: string,
  form: any,
  currentFormData: any,//TODO:alias
  currentBin: any//Function
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

export interface usrCreds {
  username: string | null,
  email: string,
  password: string,
  phone: string | null
}