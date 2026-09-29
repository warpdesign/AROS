# AROS CD32 Game Compatibility List

This page tracks the compatibility of AROS with Amiga CD32 games, booted
from CD under the AROS m68k-amiga ROM.

## Legend

**Status**

| Status | Meaning |
|---|---|
| 🟠 Untested | Nobody has reported a result for this title yet |
| 🔴 Not working | Fails at one of the tested stages |
| 🟢 Working | Every tested stage behaves as on the CD32 Kickstart |

**Tested** lists the stages that were actually checked, for example:
`Boot`, `Intro`, `Menu`, `In-game`, `CD audio`, `FMV`, `Save (NVRAM)`.
A title only counts as working for the stages listed.

## Games

**Tested on:** Copperline 0.21, CD32 configuration, 2 MiB Chip RAM only (no Fast RAM)

**Tested commit:** not recorded yet

Every result in the table was obtained on the setup above, with a ROM built
from the tested commit. The commit is not bumped after each change: it only
moves when the whole list is retested on a newer build. Results entered
before a tested commit was recorded came from unknown setups and still need
a retest on Copperline.

| Game | Status | Tested | Details |
|---|---|---|---|
| Kid Chaos | 🟠 Untested | — | CD_TOCMSF / CD_PLAYMSF / CD_PLAYLSN fixes in de4966229c; needs a retest |
| Microcosm | 🟢 Working | Intro, In-game | CDXL intro needs the chip RAM savings from e9c4ecde99 |
| Pinball Fantasies | 🟢 Working | Menu, In-game, CD audio | Table load after starting music fixed in d1abde020c |
| Pinball Illusions | 🟢 Working | Boot, Intro, In-game | Needs the lowlevel requester gate (217e89b355) and suppressed boot requesters (70aef8a878) |

## Adding a result

Keep the table sorted alphabetically. When reporting a title, give the
status and the stages you checked. Use the details column for anything
unusual, such as the commit that fixed or broke it.

New titles must be tested on the setup above with a ROM built from the
tested commit, so the whole table stays comparable. To move to a newer
build, retest every title, then update the tested commit, written as a hash
in backticks, e.g. ``**Tested commit:** `11810e485f` ``.
