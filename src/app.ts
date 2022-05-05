import express from "express";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";
import { router as dfpwmRouter } from "./routes/dfpwm";
import { router as youtubeRouter } from "./routes/youtube";
import Ffmpeg from "fluent-ffmpeg";

export const app = express();
// Middleware
app.use(logger("dev"));
app.use(express.raw({ type: "audio/wave", limit: "50mb" }));

// Tool sub-routers
app.use("/tools/dfpwm", dfpwmRouter);
app.use("/tools/youtube", youtubeRouter);

// Swagger
const options: OAS3Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bardy's Tools - APIs",
            version: "1.0.0",
            description: "A collection of REST APIs for various tools created by BomBardyGamer",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html"
            },
            contact: {
                name: "Callum Seabrook",
                url: "https://bardy.me",
                email: "callum.seabrook@prevarinite.com",
            }
        },
        servers: [
            {
                url: "https://api.bardy.me/",
            }
        ]
    },
    apis: ["./src/routes/dfpwm.ts", "./src/routes/youtube.ts"]
};
const specs = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.get("/", (_, response) => response.redirect("/docs"));

// Bootstrap fluent-ffmpeg
const ffmpegPath = process.env.FFMPEG_PATH;
if (ffmpegPath !== undefined) Ffmpeg.setFfmpegPath(ffmpegPath);
