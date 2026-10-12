/* Copyright (C) 2026, The AROS Development Team. All rights reserved. */

/* Match the generated C stub's include order. GCC 6 rejects its definition
   if the prototype precedes the may_alias definition of struct MinList. */
#ifndef NOLIBINLINE
#define NOLIBINLINE
#endif
#ifndef NOLIBDEFINES
#define NOLIBDEFINES
#endif
#include <proto/nonvolatile.h>
#include <proto/nvdisk.h>
#include <exec/lists.h>

static struct MinList items;

struct MinList *GetNVList(STRPTR appName, BOOL killRequesters)
{
    (void)appName;
    (void)killRequesters;
    return &items;
}

struct MinList *GetNVDItemList(STRPTR appName)
{
    (void)appName;
    return &items;
}

int main(void)
{
    struct MinList *(*callback)(STRPTR) = GetNVDItemList;
    struct MinList *(*listCallback)(STRPTR, BOOL) = GetNVList;

    return callback(NULL) == &items && listCallback(NULL, TRUE) == &items ? 0 : 20;
}
