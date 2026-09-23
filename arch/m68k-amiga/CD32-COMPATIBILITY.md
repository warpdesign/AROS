# AROS CD32 Game Compatibility List

This page tracks the compatibility of AROS with Amiga CD32 games, booted
from CD under the AROS m68k-amiga ROM.

The reference test setup is **Copperline 0.21** with the **CD32**
configuration and **2 MiB Chip RAM only** (no Fast RAM). Results from any
other emulator, version or configuration must say so in the Tested on
column.

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

**Tested on** gives the emulator name and version, the configuration and
the memory, e.g. `Copperline 0.21, CD32, 2 MiB Chip`. `Unknown` means the
result predates this column and should be retested on the reference setup.

## Games

| Game | Status | Tested | Tested on | Details |
|---|---|---|---|---|
| Kid Chaos | 🟠 Untested | — | — | CD_TOCMSF / CD_PLAYMSF / CD_PLAYLSN fixes in de4966229c; needs a retest |
| Microcosm | 🟢 Working | Intro, In-game | Unknown, 2 MiB Chip | CDXL intro needs the chip RAM savings from e9c4ecde99 |
| Pinball Fantasies | 🟢 Working | Menu, In-game, CD audio | Unknown | Table load after starting music fixed in d1abde020c |
| Pinball Illusions | 🟢 Working | Boot, Intro, In-game | Unknown | Needs the lowlevel requester gate (217e89b355) and suppressed boot requesters (70aef8a878) |

## Adding a result

Keep the table sorted alphabetically. When reporting a title, give the
status, the stages you checked and the exact setup it ran on. Use the details
column for anything unusual, such as the commit that fixed or broke it.
