// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  const roleId = +localStorage.getItem('roleId')!;
  const allowedRoles = route.data['allowedRoles'] as number[];

  if (allowedRoles && allowedRoles.includes(roleId)) {
    return true;
  }

  // Not allowed
  router.navigate(['/login']);
  return false;
};
