import User from "../models/user";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from "../config/config";

/** Recibir token en Authorization `Bearer Token` */
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

/** Existencia de usuario partiendo del token recibido */
export default new Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.log(error);
  }
});
