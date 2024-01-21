import { Prisma } from "@prisma/client";

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  twoFA?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isPhoneVerified?: boolean;
  Otp?: Prisma.OtpUncheckedCreateNestedManyWithoutOwnerInput;
  
}