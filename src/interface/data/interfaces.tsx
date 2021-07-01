export interface form {
  input: Object,
  uiSchema: Object,
  currentFormData: Object,
  output: string
}

export interface ValidComponent {
  serviceUUID: string,
  form: form,
  permissions: string[],
  currentBin: any//Function
}

export interface subel {
  message: string,
  stack: any | null//TODO:alias
}

export interface util {
  _id: string,
  likes: number,
  dislikes: number,
  uses: number,
  description: string,
  title: string
}

export interface profDetails {
  utils: [util] | [],
  username: string
}

export interface usrCreds {
  confirmed: boolean,
  username: string,
  userSub: string,
}