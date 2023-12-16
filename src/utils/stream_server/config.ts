import ffmpeg from '@ffmpeg-installer/ffmpeg';
import CONSTS from '../consts';
import type { Config } from '@/types/StreamTypes';

export const config: Config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: CONSTS.NMS_PORT_HTTP,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: ffmpeg.path,
    tasks: [
      {
        app: CONSTS.NMS_APP_NAME,
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsKeep: true, // to prevent hls file delete after end the stream
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
        dashKeep: true // to prevent dash file delete after end the stream
      }
    ]
  },
  auth: {
    api: true,
    api_user: CONSTS.NMS_API_USER,
    api_pass: CONSTS.NMS_API_PASS
  }
};
