const DEFAULT_FEATURES = [
  "accelerometer",
  "autoplay",
  "clipboard-write",
  "encrypted-media",
  "geolocation",
  "gyroscope",
  "picture-in-picture",
];

export interface IframeAllowOptions {
  /**
   * Lets the sub-app set `navigator.audioSession.type`. WebKit ignores that setter in a
   * frame without the `microphone` permissions policy. Without the "playback" session,
   * the iPhone silent switch mutes Web Audio. This does not grant microphone access:
   * the sub-app still needs the user permission to record.
   */
  audioSession?: boolean;
}

/** Value of the `allow` attribute of an embedded sub-app iframe. */
export function iframeAllow(options: IframeAllowOptions = {}): string {
  const features = options.audioSession
    ? [...DEFAULT_FEATURES, "microphone"]
    : DEFAULT_FEATURES;
  return features.join("; ");
}
