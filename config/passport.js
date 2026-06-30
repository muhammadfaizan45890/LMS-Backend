// import passport from "passport";
// import  {Strategy as GoogleStrategy} from "passport-google-oauth20"
// import { User } from "../models/userModel.js";

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
//   },
//   async(_accessToken, refreshToken, profile, cb)=> {
//     console.log(profile);
    
//     try {
//       let user = await User.findOneAndUpdate({ googleId: profile.id }, {isLoggedIn:true});
          
//       if(!user){
//         user = await User.create({
//             googleId: profile.id,
//             username:profile.displayName,
//             email:profile.emails[0].value,
//             avatar:profile.photos[0].value,  
//             isLoggedIn:true,
//             isVerified:true        
//         })
//       }

//       return cb(null, user);

//     } catch (error) {
//         return cb(error, null)
//     }
    
//   }
// ));



import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.js";

// Use environment variable for callback URL (fallback for local development)
const callbackURL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,   // 👈 now dynamic
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const username = profile.displayName;
        const avatar = profile.photos[0]?.value;

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = googleId;
            user.avatar = avatar || user.avatar;
            user.isVerified = true;
            if (!user.username) user.username = username;
            await user.save();
          }
          user.isLoggedIn = true;
          await user.save();
          return cb(null, user);
        } else {
          user = await User.create({
            googleId,
            email,
            username,
            avatar,
            isLoggedIn: true,
            isVerified: true,
          });
          return cb(null, user);
        }
      } catch (error) {
        console.error("Google Auth Error:", error);
        return cb(error, null);
      }
    }
  )
);
