export type Role = {
  Role_Id: number;
  RoleName: string;
};

export type User = {
  User_Id?: number;
  FirstName?: string;
  LastName?: string;
  Roles?: Role[];
};