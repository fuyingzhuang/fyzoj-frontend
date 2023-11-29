import { AccessEnum } from "@/access/accessEnum";

const checkAccess = (loginUser: any, needAccess = AccessEnum.NOT_LOGIN) => {
  // 获取当前登陆用的权限 如果没有登陆则默认为未登录
  const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;
  if (needAccess === AccessEnum.NOT_LOGIN) {
    return true;
    //  如果用户登陆才能访问的页面
  } else if (needAccess === AccessEnum.USER) {
    //但是用户没有登陆，那么就跳转到登陆页面
    if (loginUserAccess === AccessEnum.NOT_LOGIN) {
      return false;
    }
  } else if (needAccess === AccessEnum.ADMIN) {
    // 管理员页面
    if (loginUserAccess !== AccessEnum.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
