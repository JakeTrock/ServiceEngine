export interface form {
  input: Object,
  uiSchema: Object,
  currentFormData: Object
}

export interface ValidComponent {
  serviceUUID: String,
  form: form,
  permissions: String[],
  currentBin: any//Function
}

export interface subel {
  message: String,
  stack: any | null//TODO:alias
}

export interface util {
  _id: String,
  likes: number,
  dislikes: number,
  uses: number,
  description: String,
  title: String
}

export interface profDetails {
  utils: [util] | [],
  username: String
}

export interface usrCreds {
  confirmed: boolean,
  username: String,
  userSub: String,
}

export interface usrLogin {
  email: String,
  username: String,
  password: String
}