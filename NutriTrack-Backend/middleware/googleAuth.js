import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GoogleTokenStrategy } from "passport-google-token";
import dotenv from "dotenv";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "nutritrackapp";

// ✅ Google OAuth 2.0 for Web Authentication (Ensuring User Data)
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
  
          if (!user) {
            user = { googleId: profile.id, email: profile.emails?.[0]?.value };
          }
  
          return done(null, user);  // ✅ Return complete user object
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
  
          if (!user) {
            user = { googleId: profile.id, email: profile.emails?.[0]?.value };
          }
  
          return done(null, user);  // ✅ Return complete user object
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );


export default passport;
