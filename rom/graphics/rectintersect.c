/* Copyright (C) 2026, The AROS Development Team. All rights reserved. */

#include <clib/macros.h>
#include "rectintersect.h"

BOOL _GfxAndRectRect(const struct Rectangle *rect1,
                    const struct Rectangle *rect2,
                    struct Rectangle *intersect)
{
    return _AndRectRectInline(rect1, rect2, intersect);
}
