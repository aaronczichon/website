---
title: "TIL: merge != merge in RxJS (v7 and previous)"
pubDate: 2022-08-30
description: "`TIL:` sections on my blog are small things I learned or notice during my day.
This one shows the different between merge operator and merge observer."
author: "Aaron Czichon"
tags:
  [
    "Web Development",
    "Javascript",
    "RxJS"
  ]
---

**Hint**   
`TIL:` sections on my blog are small things I learned or notice during my day. I'll write it down for myself for the future and maybe it can also be helpful for others reading my blog :)


Something I noticed today: RxJS (until v7 (current stable)) has 2 implementations for the `merge` function which can be an operator and also a combination observer. 

My use case was this (simplified for better understanding):
```typescript
public observer = merge([this.form.valueChanges, this.picker.valuesUpdated$]);
```

My expectations where: The merge observer should emit every value after each other from the `this.form.valueChanges` and `this.picker.valuesUpdates$` observer.
{images:1}

The thing is, it never emits any value.

After a few researches through the documentation of RxJS I notice that there are two implementations for the `merge` function. It can be an observer (which I wanted) or it can be an operator (inside an observer chain/pipe). 

In my case I falsely used the [operator syntax](https://rxjs.dev/api/operators/merge) instead of the observer syntax. To use the [observer syntax](https://rxjs.dev/api/index/function/merge) I need to implement it like this:
```typescript
public observer = merge(this.form.valueChanges, this.picker.valuesUpdated$);
```
(Notice the missing brackets `[` and `]`).

But I think the team already was aware of this and the `merge` operator is deprecated since v7 (and will be removed in v8), replaced by the `mergeWith` operator.   

Also: The observer syntax is only available through the import of directly `import { merge } from 'rxjs'` as the operator syntax is also available through the operators namespace: `import { merge } from 'rxjs/operators'`.

Maybe this helps some of you in the future :)