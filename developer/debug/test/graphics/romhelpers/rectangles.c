/* Copyright (C) 2026, The AROS Development Team. All rights reserved. */
#include <aros/debug.h>
#include <graphics/gfx.h>

BOOL _GfxAndRectRect(const struct Rectangle *, const struct Rectangle *, struct Rectangle *);

static BOOL same(const struct Rectangle *a, const struct Rectangle *b)
{
    return a->MinX == b->MinX && a->MinY == b->MinY &&
           a->MaxX == b->MaxX && a->MaxY == b->MaxY;
}

int main(void)
{
    static const struct {
        struct Rectangle a, b, expected;
        BOOL intersects;
    } cases[] = {
        {{0,0,10,10}, {5,3,12,7}, {5,3,10,7}, TRUE},
        {{-4,-4,4,4}, {-2,-2,2,2}, {-2,-2,2,2}, TRUE},
        {{0,0,10,10}, {10,10,12,12}, {10,10,10,10}, TRUE},
        {{0,0,1,1}, {2,0,3,1}, {0,0,0,0}, FALSE},
        {{0,0,1,1}, {0,2,1,3}, {0,0,0,0}, FALSE},
        {{-12,-8,-4,-2}, {-6,-6,0,0}, {-6,-6,-4,-2}, TRUE},
        {{-32768,-32768,32767,32767}, {-32768,32766,-32760,32767},
         {-32768,32766,-32760,32767}, TRUE},
        {{0,0,0,0}, {0,0,0,0}, {0,0,0,0}, TRUE}
    };
    const struct Rectangle untouched = {-123,-124,-125,-126};
    ULONG i, mode, failures = 0;

    for (i = 0; i < sizeof(cases)/sizeof(cases[0]); i++)
        for (mode = 0; mode < 3; mode++) {
            struct Rectangle a = cases[i].a, b = cases[i].b, out = untouched;
            struct Rectangle *dst = mode == 1 ? &a : mode == 2 ? &b : &out;
            const struct Rectangle *expected = cases[i].intersects ? &cases[i].expected :
                mode == 1 ? &cases[i].a : mode == 2 ? &cases[i].b : &untouched;
            BOOL result = _GfxAndRectRect(&a, &b, dst);
            if (!!result != !!cases[i].intersects || !same(dst, expected))
                failures++;
        }
    bug("RECTANGLE INTERSECTION TEST: %lu failures\n", (unsigned long)failures);
    return failures ? 20 : 0;
}
