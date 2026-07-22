# Chased by ALAM release history

## Beta 1.1 - Control and movement stabilization

Released: 2026-07-22

### Mouse and camera

- Replaced the stock pointer-lock mouse handler with a guarded first-person control layer.
- Ignores mouse deltas briefly while pointer lock is entering or resuming, preventing browser cursor-warp events from snapping the camera.
- Rejects impossible single-event mouse spikes and caps the angular change accepted in one rendered frame.
- Clears queued look input whenever the game pauses, loses focus, resumes, restarts, or pointer lock fails.
- Validates saved mouse sensitivity before applying it, preventing damaged browser storage from creating extreme camera motion.

### Player movement and collision

- Clears stored velocity on pause, focus loss, death, victory, and resume so the player cannot slide or jump forward after returning to the game.
- Normalizes diagonal input and treats opposite keys as zero movement rather than accelerated movement.
- Retuned acceleration and deceleration for more responsive starts and cleaner stops with less ice-like sliding.
- Replaced square-footprint wall checks with circular player collision for smoother corner movement.
- Searches every collision bucket touched by the player instead of only the bucket containing the player's center.
- Splits low-frame-rate movement into small collision substeps, preventing the player from tunnelling through thin walls during a stutter.
- Tracks the last valid position and rejects non-finite or out-of-map movement results.
- Guards against invalid or negative frame deltas.

### Feel, consistency, and fault prevention

- Reduced default head-bob amplitude to make motion steadier without removing the breathing and footstep atmosphere.
- Footsteps, breathing exertion, and movement noise now use actual travelled distance rather than keys alone.
- Sanitizes all persisted settings: sensitivity, volume, field of view, difficulty, head bob, FPS display, and quality.
- Prevents browser arrow-key behavior only while actively playing, without breaking keyboard use in menus.
- Added automated syntax, protected-media, pointer-control, collision, and version regression checks to the GitHub Pages deployment.
- Fixed local-server directory routing and MP3 content types so local testing matches the deployed `/chased-by-alam/` URL.

### Preserved

- Original ALAM image.
- Original chase audio.
- Original death audio.
- Three-relay objective, extraction, map variants, lighting, settings, footsteps, and breathing.

## Beta 1.0 - First public GitHub build

Released: 2026-07-22

- Initial browser-playable GitHub Pages release.
- Compact Backrooms-inspired map with three signal relays and an extraction objective.
- ALAM chase AI, custom ALAM image, chase audio, death audio, stamina, minimap, settings, lighting events, footsteps, and breathing.
- This version is preserved by the `beta-1.0` Git tag.
