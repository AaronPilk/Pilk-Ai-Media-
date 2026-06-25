# Adding Previous Website Builds

Aaron will add files from previous website builds into this project. Nothing breaks while
slots are empty — a premium faux-browser mockup renders until real assets exist.

## Showcase build assets

Place build preview assets here:

```
public/showcase-sites/<slug>/
```

Recommended files:

- `desktop.webp`
- `mobile.webp`
- `preview.mp4`
- `poster.webp`

Example:

```
public/showcase-sites/luxury-agent-build/desktop.webp
public/showcase-sites/luxury-agent-build/mobile.webp
public/showcase-sites/luxury-agent-build/preview.mp4
public/showcase-sites/luxury-agent-build/poster.webp
```

Then update `src/content/built-sites.ts` and set the asset paths:

```ts
assets: {
  desktop: "/showcase-sites/luxury-agent-build/desktop.webp",
  mobile:  "/showcase-sites/luxury-agent-build/mobile.webp",
  video:   "/showcase-sites/luxury-agent-build/preview.mp4",
  poster:  "/showcase-sites/luxury-agent-build/poster.webp",
}
```

If a `video` is present it plays (muted) when the card is active; otherwise `desktop` shows;
otherwise the faux-browser fallback renders.

## Template preview assets

Place template preview assets here:

```
public/templates/<template-slug>/
```

Recommended files: `desktop.webp`, `mobile.webp`, `preview.mp4`, `poster.webp`.

Then update `src/content/templates.ts` `preview` paths for that template.

## Important — honest labels

Do not label a concept as client work unless it is a completed, approved client project.

Use:

- `Coming Soon`
- `Concept Build`
- `Internal Build`

Only use `Client Build` when the project is real and approved to display publicly.
