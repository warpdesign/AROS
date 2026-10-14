/* Copyright (C) 2026, The AROS Development Team. All rights reserved. */
#ifndef GRAPHICS_RECTINTERSECT_H
#define GRAPHICS_RECTINTERSECT_H

#include <graphics/gfx.h>
#include <clib/macros.h>

#define _DoRectsOverlap(Rect, x1, y1, x2, y2) \
(                                             \
    y1 <= (Rect)->MaxY &&                     \
    y2 >= (Rect)->MinY &&                     \
    x1 <= (Rect)->MaxX &&                     \
    x2 >= (Rect)->MinX                        \
)

#define overlap(a,b) _DoRectsOverlap(&(a), (b).MinX, (b).MinY, (b).MaxX, (b).MaxY)

#define _AndRectRectInline(rect1, rect2, intersect)            \
({                                                             \
    BOOL res;                                                  \
                                                               \
    if (overlap(*(rect1), *(rect2)))                           \
    {                                                          \
	(intersect)->MinX = MAX((rect1)->MinX, (rect2)->MinX); \
	(intersect)->MinY = MAX((rect1)->MinY, (rect2)->MinY); \
	(intersect)->MaxX = MIN((rect1)->MaxX, (rect2)->MaxX); \
	(intersect)->MaxY = MIN((rect1)->MaxY, (rect2)->MaxY); \
                                                               \
	res = TRUE;                                            \
    }                                                          \
    else                                                       \
        res = FALSE;                                           \
                                                               \
    res;                                                       \
})

#ifndef GFX_SHARED_RECT_INTERSECTION
#define GFX_SHARED_RECT_INTERSECTION 0
#endif

#if GFX_SHARED_RECT_INTERSECTION
BOOL _GfxAndRectRect(const struct Rectangle *rect1,
                    const struct Rectangle *rect2,
                    struct Rectangle *intersect);
#define _AndRectRect _GfxAndRectRect
#else
#define _AndRectRect _AndRectRectInline
#endif

#endif
