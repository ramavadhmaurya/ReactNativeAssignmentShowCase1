
export const USER_INFO = "USER_INFO";

export function saveUserInfo(UserInfo) {

  return {
    type: USER_INFO,
    UserInfo: UserInfo
  };
}

