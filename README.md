# 阿平 A-Ping

**A Cantonese-speaking home companion device for Hong Kong families who cannot afford a domestic helper.**

**🔗 [hongjin-he.github.io/aping](https://hongjin-he.github.io/aping/)**

A concept site built for a group project in ISOM 2010 (Introduction to Information Systems) at HKUST, Fall 2026.

---

## What the page contains

- **An interactive 3D model** — drag to rotate, scroll to zoom, and pull the slider to take the device apart. Tapping any of the nine parts explains what it is, why it was chosen, and what it costs. One of those nine is *the camera that is deliberately not there*.
- **Three ~30-second scene demos** — a medication reminder, the device starting a conversation on its own, and a reminder set remotely by an adult child. All dialogue is in written Cantonese; the child's phone panel updates alongside.
- **The price argument** — anchored against the statutory monthly cost of employing a foreign domestic helper in Hong Kong (HK$6,336 as of September 2026, per the Labour Department).
- **Bilingual** — 繁體中文 / English, toggled in the top-right corner.

## The idea in one paragraph

Hiring a live-in domestic helper is the established answer to caring for an ageing parent in Hong Kong. Our customer is the household just below that line: the family whose income does not stretch to a helper's monthly cost, or whose flat has no room for one, and who therefore has no solution at all. Meanwhile every AI companion device on the market speaks Mandarin, English or Japanese — none is built for the Cantonese-speaking older adults who need it most.

## Design decisions worth reading

| Decision | Reason |
|---|---|
| **No camera** | Hong Kong flats are small, and the child buys the device while the parent uses it. A camera reads as surveillance. The cost is that we cannot do fall detection — we do not pretend otherwise, and we do not claim to replace a personal emergency alarm. |
| **It does not move** | Mobile home robots have failed even for large firms. Removing motion removes most of the cost and nearly all of the safety risk. |
| **One button** | Press to talk, hold to mute. Everything else is configured from the child's phone. |
| **Reminders run locally** | Wake-word detection and scheduled reminders execute on the device, so a medication reminder still fires with the internet down. |

## Built with

Plain HTML, CSS and JavaScript — no build step, no framework. The 3D model uses [three.js](https://threejs.org/) (r128, loaded from a CDN). Deployed on GitHub Pages.

```
index.html   the page, styles and scene demos
model.js     the 3D model and exploded parts view
```

## Status

**Concept stage.** The product does not exist. Every price on the page is a hypothesis we are still testing through interviews and a survey; the final figures will come from that data, not from our assumptions.

## Team

Hongjin HE · Yuechen DANG · Zepeng HUANG · Zhiyan ZOU — ISOM 2010, HKUST, Fall 2026
