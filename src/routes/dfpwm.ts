/**
 * @openapi
 * /tools/dfpwm/encode:
 *   post:
 *     summary: Encode PCM to DFPWM
 *     description: Convert unsigned 8-bit PCM audio to 1-bit DFPWM
 *     requestBody:
 *       description: The PCM audio to convert
 *       required: true
 *       content:
 *         audio/wave:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: The converted DFPWM file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 * /tools/dfpwm/decode:
 *   post:
 *     summary: Decode DFPWM to PCM
 *     description: Convert 1-bit DFPWM to unsigned 8-bit PCM audio
 *     requestBody:
 *       description: The DFPWM audio to convert
 *       required: true
 *       content:
 *         audio/wave:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: The converted PCM file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 * /tools/dfpwm/download/youtube:
 *   get:
 *     summary: DFPWM YouTube download
 *     description: Download the audio from a YouTube video in DFPWM format
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The YouTube video ID to download.
 *         required: true
 *         schema:
 *           type: string
 *         examples:
 *           fiveHours:
 *             summary: "\"Five Hours\" video ID"
 *             description: "The ID of the YouTube video \"Five Hours\" on channel \"Deorrotv\""
 *             value: "ptdgQMSZKVg"
 *           oneLastTime:
 *             summary: "\"Alesso & DubVision - One Last Time\" video ID"
 *             description: "The ID of the YouTube video \"Alesso & DubVision - One Last Time (Official Audio)\" on channel \"Alesso\""
 *             value: "uWN-SLVR69Q"
 *       - name: quality
 *         in: query
 *         description: The quality of the YouTube audio
 *         required: false
 *         schema:
 *           type: string
 *           enum: [highest, lowest]
 *           default: highest
 *     responses:
 *       200:
 *         description: The downloaded YouTube audio file, in DFPWM format.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *             examples:
 *               fiveHours:
 *                 summary: "\"Deorro - Five Hours\" in DFPWM"
 *                 description: The song Five Hours by Deorro downloaded and converted to DFPWM
 *                 externalValue: "https://cdn.bardy.me/examples/dfpwm/deorro-five-hours.dfpwm"
 *               oneLastTime:
 *                 summary: "\"Alesso & DubVision - One Last Time\" in DFPWM"
 *                 description: "The song \"One Last Time\" by Alesso and DubVision downloaded and converted to DFPWM"
 *                 externalValue: "https://cdn.bardy.me/examples/dfpwm/alesso-dubvision-one-last-time.dfpwm"
 */

import { Router } from "express";
import { Decoder, Encoder } from "dfpwm";
import Ffmpeg from "fluent-ffmpeg";
import { download } from "./youtube";

export const router = Router();
router.post("/encode", (request, response) => {
    const encoder = new Encoder();
    const result = encoder.encode(request.body);
    response.send(result);
});

router.post("/decode", (request, response) => {
    const decoder = new Decoder();
    const result = decoder.decode(request.body);
    response.send(result);
});

router.get("/download/youtube", (request, response) => {
    const id = request.query.id;
    const quality = request.query.quality as string || "highest";
    if (typeof id !== "string" || (quality !== "lowest" && quality !== "highest")) {
        response.sendStatus(400);
        return;
    }
    const result = download(id, "audioonly", quality)
        .on("error", (error) => {
            if (error.message === "Video unavailable") {
                response.sendStatus(404);
                return;
            }
        });
    Ffmpeg(result)
        .format("u8")
        .audioCodec("dfpwm")
        .audioBitrate("48k")
        .noVideo()
        .writeToStream(response);
})
