import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/auth/guards/auth.guard';
import { AdminComponent } from './admin.component';
import { AdminIdleModalComponent } from 'app/admin-management/components/admin-idle-modal/admin-idle-modal.component';
import { SettingResolve } from '../core/resolvers/setting.resolve';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: AdminComponent, canActivate: [AuthGuard], resolve: {setting: SettingResolve}},
  {path: 'idle', component: AdminIdleModalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
