import z from "zod";
import { PublicPlayerProfileTbSchema } from "../tinybase/public-player-profile-tb";
import { PublicPlayerProfileSchema } from "../internal/public-player-profile";


const PublicPlayerProfileInternalToTbCodec = z.codec(
  PublicPlayerProfileSchema,
  PublicPlayerProfileTbSchema,
  {
    decode: (publicPlayerProfileInternal) => publicPlayerProfileInternal,
    encode: (publicPlayerProfileTb) => publicPlayerProfileTb,
  }
);


// const stringToDateCodec = z.codec(
//   z.iso.datetime(),  // input schema: ISO date string
//   z.date(),          // output schema: Date object
//   {
//     decode: (isoString) => new Date(isoString), // ISO string → Date
//     encode: (date) => date.toISOString(),       // Date → ISO string
//   }
// );
