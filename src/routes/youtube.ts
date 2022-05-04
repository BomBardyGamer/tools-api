/**
 * @openapi
 * /tools/youtube/download:
 *   get:
 *     summary: YouTube downloading
 *     description: Download a YouTube video
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The YouTube video ID to download
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
 *         description: The quality to download the video at
 *         schema:
 *           type: string
 *           enum: [lowest, highest]
 *           default: highest
 *     responses:
 *       200:
 *         description: The downloaded YouTube file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: "The \"quality\" parameter was not \"lowest\" or \"highest\""
 *       404:
 *         description: "No YouTube video with the given \"id\" could be found"
 * /tools/youtube/download/video:
 *   get:
 *     summary: YouTube video download
 *     description: Download a YouTube video without audio.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The YouTube video ID to download
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
 *         description: The quality to download the video at
 *         schema:
 *           type: string
 *           enum: [lowest, highest]
 *           default: highest
 *     responses:
 *       200:
 *         description: The downloaded YouTube video
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: "The \"quality\" parameter was not \"lowest\" or \"highest\""
 *       404:
 *         description: "No YouTube video with the given \"id\" could be found"
 * /tools/youtube/download/audio:
 *   get:
 *     summary: YouTube audio download
 *     description: Download a YouTube video's audio only.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The YouTube video ID to download
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
 *         description: The quality to download the video at
 *         schema:
 *           type: string
 *           enum: [lowest, highest]
 *           default: highest
 *     responses:
 *       200:
 *         description: The downloaded YouTube audio
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: "The \"quality\" parameter was not \"lowest\" or \"highest\""
 *       404:
 *         description: "No YouTube video with the given \"id\" could be found"
 * /tools/youtube/extract-id:
 *   get:
 *     summary: YouTube URL to ID
 *     description: Extract the video ID from a YouTube URL, if it is valid.
 *     parameters:
 *       - name: url
 *         in: query
 *         description: The URL to extract the video ID from
 *         required: true
 *         schema:
 *           type: string
 *         examples:
 *           fiveHours:
 *             summary: "\"Five Hours\" URL"
 *             description: "The YouTube URL for the video \"Five Hours\" by channel \"Deorrotv\""
 *             value: "https://www.youtube.com/watch?v=ptdgQMSZKVg"
 *     responses:
 *       200:
 *         description: The original URL and the extracted YouTube video ID
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The original URL provided
 *                 id:
 *                   type: string
 *                   description: The extracted YouTube video ID
 *             examples:
 *               fiveHours:
 *                 summary: "\"Five Hours\" ID information"
 *                 description: "The original URL and extracted YouTube video ID for the video \"Five Hours\" by channel \"Deorrotv\""
 *                 value: {"url": "https://www.youtube.com/watch?v=ptdgQMSZKVg", "id": "ptdgQMSZKVg"}
 *       500:
 *         description: The URL could not be converted to a YouTube video ID
 */

import { Router } from "express";
import { Readable } from "stream";
import ytdl, { Filter } from "ytdl-core";

export const router = Router();
router.get("/download", (request, response) => {
    const id = request.query.id as string;
    const quality = request.query.quality as string || "highest";
    if (quality !== "lowest" && quality !== "highest") {
        response.sendStatus(400);
        return;
    }
    download(id, "videoandaudio", quality).pipe(response);
});

router.get("/download/video", (request, response) => {
    const id = request.query.id as string;
    const quality = request.query.quality as string || "highest";
    if (quality !== "lowest" && quality !== "highest") {
        response.sendStatus(400);
        return;
    }
    download(id, "videoonly", quality).pipe(response);
});

router.get("/download/audio", (request, response) => {
    const id = request.query.id as string;
    const quality = request.query.quality as string || "highest";
    if (quality !== "lowest" && quality !== "highest") {
        response.sendStatus(400);
        return;
    }
    download(id, "audioonly", quality).pipe(response);
})

router.get("/extract-id", (request, response) => {
    const url = request.query.url as string;
    const id = ytdl.getURLVideoID(url);
    response.send({
        url: url,
        id: id
    });
});

export function download(id: string, filter: Filter, quality: "highest" | "lowest"): Readable {
    const url = `https://www.youtube.com/watch?v=${id}`;
    const actualQuality = selectQuality(filter, quality);
    return ytdl(url, { quality: actualQuality, filter: filter, dlChunkSize: 0 });
}

function selectQuality(filter: Filter, quality: string): string {
    if (filter === "videoandaudio") return quality;
    if (filter === "videoonly") {
        if (quality === "highest") return "highestvideo";
        if (quality === "lowest") return "lowestvideo";
    }
    if (filter === "audioonly") {
        if (quality === "highest") return "highestaudio";
        if (quality === "lowest") return "lowestaudio";
    }
    throw Error(`Could not select quality with filter ${filter} and quality ${quality}!`);
}
