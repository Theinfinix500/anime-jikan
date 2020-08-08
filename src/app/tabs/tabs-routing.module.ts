import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'browse',
        loadChildren: () =>
          import('../pages/browse/browse.module').then(
            (m) => m.BrowsePageModule
          ),
      },
      {
        path: 'saved',
        loadChildren: () =>
          import('../pages/saved/saved.module').then((m) => m.SavedPageModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../pages/settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: 'season',
        loadChildren: () =>
          import('../pages/season/season.module').then(
            (m) => m.SeasonPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/season',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/season',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
