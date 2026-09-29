# AROS CD32 Game Compatibility List

This page tracks the compatibility of AROS with Amiga CD32 games, booted
from CD under the AROS m68k-amiga ROM.

## Legend

**Status**

| Status | Meaning |
|---|---|
| ⚪ Untested | Nobody has reported a result for this title yet |
| 🔴 Not working | Fails to load or crashes |
| 🟠 Partially working | Loads partly or reaches the intro, title screen, menus, or gameplay, but has functional problems |
| 🟢 Working | Every tested stage behaves as on the CD32 Kickstart |

**Tested** lists the stages that were actually checked, for example:
`Boot`, `Intro`, `Menu`, `In-game`, `CD audio`, `FMV`, `Save (NVRAM)`.
A title only counts as working for the stages listed.

## Games

**Tested on:** Copperline 1.0.0-rc.1, stock CD32 configuration, 2 MiB Chip RAM only

**Tested commit:** `0fa13c0639d281605f239f631156598439dde8b2`

**Test dates:** 2026-09-29–2026-09-30

Results in this table were reported during manual testing with freshly built
ROMs whose sources match the upstream commit above.

| Game | Status | Tested | Details |
|---|---|---|---|
| Alien Breed: Tower Assault | 🟢 Working | Intro, Title screen, In-game | — |
| Bubba 'n' Stix | 🟢 Working | Intro, Title screen, In-game, CD audio | Gameplay with CD audio works |
| Cannon Fodder | 🟢 Working | Intro (Amiga MOD), Selection screen, In-game | MPEG intro not tested |
| Chaos Engine, The | 🟢 Working | Intro, Title/options, Character selection, In-game | Gameplay with Amiga MOD music works |
| Diggers & Oscar | 🟠 Partially working | Display, Music playback | Graphics corruption; music plays |
| Frontier: Elite II | 🟢 Working | Intro (Amiga MOD), Selection screen, In-game | Limited gameplay testing |
| Fury of the Furries | 🟢 Working | Intro, Selection screen, Map, In-game | Gameplay with Amiga MOD music works on retest; an earlier run stopped at a black screen after the intro |
| Gloom | 🔴 Not working | Loading | Loading stops at a gray screen |
| Guardian | 🟢 Working | Intro, Title screen, In-game, CD audio | Gameplay with CD audio music works |
| Gunship 2000 | 🟠 Partially working | Cold boot, Reset, Pilot selection | Cold boot stops at a black screen after the MicroProse logo, before the intro; starts after a reset in Copperline, but pilot selection does not work |
| Kid Chaos | 🟢 Working | Intro, Title screen, In-game, CD audio | Gameplay with CD audio works |
| Liberation: Captive II | 🔴 Not working | Loading | Loading stops at a gray screen |
| Microcosm | 🟢 Working | Intro, In-game | — |
| Pinball Illusions | 🟠 Partially working | Intro, Table load, Game start | Intro plays and the table loads, but pressing Play does not start a game; remapping Play did not help |
| Superfrog | 🟢 Working | Intro, Title screen, In-game | — |
| Ultimate Body Blows | 🟢 Working | Title screen, Options, Player screen, In-game | — |

## Adding a result

Keep the table sorted alphabetically. When reporting a title, give the
status and the stages you checked. Use the details column for anything
unusual, such as limitations or problems observed during testing.

New titles must be tested on the setup above with a ROM built from the
tested commit, so the current results stay comparable. When starting a new
build or emulator test session, retain earlier results with their original
test context until each title is retested. Record the new tested commit as
a hash in backticks, e.g. ``**Tested commit:** `11810e485f` ``.
