import { BaseClass } from "astroboy";

class AuthService extends BaseClass {

  sleep(time = 500) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async checkIsLogin() {
    await this.sleep(10);
    return true;
  }

  async checkIsAdmin() {
    await this.sleep(10);
    if (this.ctx.header["auth"] === "admin") return true;
    return false;
  }

  async checkIsSuperAdmin() {
    await this.sleep(10);
    if (this.ctx.header["auth"] === "s_a") return true;
    return false;
  }

}

export = AuthService;
