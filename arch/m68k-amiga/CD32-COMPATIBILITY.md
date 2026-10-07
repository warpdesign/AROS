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

**Tested commit:** `a5f7f1739bf914fe6013616f70ac5ba351ee806a` (2026-10-07)

**Test dates:** 2026-09-29–2026-10-07

Results in this table apply to ROMs built from the upstream commit above.

| Game | Year | Status | Tested | Details |
|---|---|---|---|---|
| Alien Breed: Tower Assault | 1994 | 🟢 Working | Intro, Title screen, In-game | — |
| Bubba 'n' Stix | 1994 | 🟢 Working | Intro, Title screen, In-game, CD audio | Gameplay with CD audio works |
| Cannon Fodder | 1994 | 🟢 Working | Intro (Amiga MOD), Selection screen, In-game | MPEG intro not tested |
| Chaos Engine, The | 1994 | 🟢 Working | Intro, Title/options, Character selection, In-game | Gameplay with Amiga MOD music works |
| Diggers & Oscar | 1993 | 🟢 Working | In-game | Oscar tested up to gameplay; Diggers not tested |
| Frontier: Elite II | 1994 | 🟢 Working | Intro (Amiga MOD), Selection screen, In-game | Limited gameplay testing |
| Fury of the Furries | 1994 | 🟢 Working | Intro, Selection screen, Map, In-game | Gameplay with Amiga MOD music works on retest; an earlier run stopped at a black screen after the intro |
| Gloom | 1995 | 🟢 Working | Title screen, In-game | — |
| Guardian | 1994 | 🟢 Working | Intro, Title screen, In-game, CD audio | Gameplay with CD audio music works |
| Gunship 2000 | 1994 | 🟢 Working | Intro, Selection screen, In-game screen | Reached the gameplay screen; limited gameplay testing |
| Kid Chaos | 1994 | 🟢 Working | Intro, Title screen, In-game, CD audio | Gameplay with CD audio works |
| Liberation: Captive II | 1993 | 🟢 Working | Intro, Menu, In-game | — |
| Microcosm | 1994 | 🟢 Working | Intro, In-game | — |
| Pinball Illusions | 1995 | 🟢 Working | Intro, Title screen, In-game | Only the first table tested, for a few seconds |
| Superfrog | 1994 | 🟢 Working | Intro, Title screen, In-game | — |
| Ultimate Body Blows | 1994 | 🟢 Working | Title screen, Options, Player screen, In-game | — |

## Adding a result

Keep the table sorted alphabetically. When reporting a title, give the
year of its CD32 release, the status and the stages you checked. Use the details column for anything
unusual, such as limitations or problems observed during testing.

New titles must be tested on the setup above with a ROM built from the
tested commit, so the current results stay comparable. When starting a new
build or emulator test session, retain earlier results with their original
test context until each title is retested. Record the new tested commit as
a hash in backticks followed by the commit date, e.g.
``**Tested commit:** `11810e485f` (2026-09-30)``.

The page links to the ROMs for the tested commit. Publish them as a release
on warpdesign/AROS tagged `rom-<first 10 hash digits>`, with
`aros-amiga-m68k-rom.bin` and `aros-amiga-m68k-ext.bin` zipped as
`aros-amiga-rom-<first 10 hash digits>-<commit date>.zip`.
