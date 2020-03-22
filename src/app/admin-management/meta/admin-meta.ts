export const gridConfig = {
  margins: [5],
  draggable: true,
  resizable: false,
  max_cols: 0,
  max_rows: 0,
  visible_cols: 0,
  visible_rows: 0,
  min_cols: 1,
  min_rows: 1,
  col_width: 2,
  row_height: 2,
  cascade: 'off',
  min_width: 50,
  min_height: 50,
  fix_to_grid: false,
  auto_style: true,
  auto_resize: false,
  maintain_ratio: false,
  prefer_new: false,
  zoom_on_drag: false,
  limit_to_screen: true
};

export enum WindowMenuType {
  SuperAdmin = 'intelico',
  Admin = 'admin',
  Featured = 'featured',
  Setting = 'settings'
}

export enum WindowName {
  Alert = 'alerts',
  Locate = 'locate',
  Logo = 'logo',
  Activity = 'activity',
  View = 'viewer',
  Insight = 'insights',
  Security = 'security',
  Assets = 'assets',
  People = 'people',
  Team = 'team',
  Control = 'actions',
  Settings = 'settings',
  Help = 'help',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
  // admin windows
  AdminSite = 'adminSite',
  AdminArea = 'adminArea',
  AdminGroups = 'adminGroups',
  AdminUser = 'adminUser',
  AdminProduct = 'adminProduct',
  AdminPeople = 'adminPeople',
  AdminSource = 'adminSource',
  AdminResolvedReason = 'adminResolvedReason',
  AdminOutput = 'adminOutputs',
  AdminZone = 'adminZone',
  // super admin windows
  SuperAdminOrganisation = 'intelicoOrganisations',
  SuperAdminUser = 'intelicoUsers',
  // SuperAdminTeam = 'intelicoUsers',
  SuperAdminIdentifierType = 'intelicoIdentifierTypes',
  SuperAdminAreaType = 'intelicoAreaTypes',
  SuperAdminAssetType = 'intelicoAssetTypes',
  SuperAdminConditionType = 'intelicoConditionTypes',
  SuperAdminActionReason = 'intelicoActionReasons',
  SuperAdminSiteType = 'intelicoSiteTypes',
  SuperAdminChangelog = 'intelicoChangelog',
  SuperAdminResolvedReason = 'intelicoResolvedReasons',
  SuperAdminZoneType = 'intelicoZoneTypes',
  SuperAdminOutput = 'intelicoOutputs',
  SuperAdminGlobalStats = 'intelicoGlobalStats',
  SuperAdminModules = 'intelicoModules',
  SuperAdminSystemSettings = 'intelicoSystemSettings'
}

export const adminMeta = [
  // logo click
  {
    tooltipLabel: 'Logo',
    classString: 'nav-logo',
    menuLabel: 'Logo Windows',
    windowType: WindowName.Logo,
    menuType: WindowMenuType.Setting,
    config: {sizeX: 79, sizeY: 51}
  },
  // featured menu
  {
    tooltipLabel: 'Alerts',
    classString: 'nav-alerts',
    menuLabel: 'Alerts',
    windowType: WindowName.Alert,
    menuType: WindowMenuType.Featured,
    config: {sizeX: 79, sizeY: 51}
  },
  {
    tooltipLabel: 'Activity',
    classString: 'nav-activity',
    menuLabel: 'Activity',
    windowType: WindowName.Activity,
    menuType: WindowMenuType.Featured,
    config: {sizeX: 79, sizeY: 51}
  },
  {
    tooltipLabel: 'Locate',
    classString: 'nav-locate',
    menuLabel: 'Locate',
    windowType: WindowName.Locate,
    menuType: WindowMenuType.Featured,
    config: {sizeX: 79, sizeY: 51}
  },
  {
    tooltipLabel: 'View',
    classString: 'nav-view',
    menuLabel: 'View',
    windowType: WindowName.View,
    menuType: WindowMenuType.Featured,
    config: { sizeX: 79, sizeY: 51 }
  },
  /* {
     tooltipLabel: 'Insights',
     classString: 'nav-insights',
     menuLabel: 'Insights',
     windowType: WindowName.Insight,
     menuType: WindowMenuType.Featured,
     config: { sizeX: 79, sizeY: 51 }
   },*/
  {
    tooltipLabel: 'People',
    classString: 'nav-people',
    menuLabel: 'People',
    windowType: WindowName.People,
    menuType: WindowMenuType.Featured,
    config: {sizeX: 79, sizeY: 51}
  },
  /*  {
      tooltipLabel: 'Security',
      classString: 'nav-security',
      menuLabel: 'Security',
      windowType: WindowName.Security,
      menuType: WindowMenuType.Featured,
      config: { sizeX: 79, sizeY: 51 }
    },*/
  {
    tooltipLabel: 'Assets',
    classString: 'nav-assets',
    menuLabel: 'Assets',
    windowType: WindowName.Assets,
    menuType: WindowMenuType.Featured,
    config: {sizeX: 79, sizeY: 51}
  },
  {
    tooltipLabel: 'Actions',
    classString: 'nav-actions',
    menuLabel: 'Actions',
    windowType: WindowName.Control,
    menuType: WindowMenuType.Featured,
    config: {sizeX: 79, sizeY: 51}
  },
  // {
  //  tooltipLabel: 'Events',
  //  classString: 'nav-events',
  //  menuLabel: 'Events',
  //  windowType: 'events',
  //  menuType: 'featured',
  //  config: {sizeX: 83, sizeY: 47}
  // },
  // {
  //   tooltipLabel: 'Timeline',
  //   classString: 'nav-timeline',
  //   menuLabel: 'Timeline',
  //   windowType: 'timeline',
  //   menuType: 'featured',
  //   config: {sizeX: 83, sizeY: 47}
  // },
  // {
  //  tooltipLabel: 'Messages',
  //  classString: 'nav-messages',
  //  menuLabel: 'Messages',
  //  windowType: 'message',
  //  menuType: 'featured',
  //  config: {sizeX: 90, sizeY: 50}
  // },
  // {
  //   tooltipLabel: 'Notes',
  //   classString: 'nav-notes',
  //   menuLabel: 'Notes',
  //   windowType: 'notes',
  //   menuType: 'featured',
  //   config: {sizeX: 75, sizeY: 35}
  // },
  {
    tooltipLabel: 'Settings',
    classString: 'subnav-settings',
    menuLabel: 'Settings',
    windowType: WindowName.Settings,
    menuType: WindowMenuType.Setting,
    config: {sizeX: 70, sizeY: 40},
    noMaxBtn: true
  },
  {
    tooltipLabel: 'Admin',
    classString: 'subnav-admin',
    menuLabel: 'Admin',
    windowType: WindowName.Admin,
    menuType: WindowMenuType.Setting,
    config: {sizeX: 83, sizeY: 47}
  },
  {
    tooltipLabel: 'Super Admin',
    classString: 'subnav-sadmin',
    menuLabel: 'Super Admin',
    windowType: WindowName.SuperAdmin,
    menuType: WindowMenuType.Setting,
    config: {sizeX: 83, sizeY: 47}
  },
  {
    tooltipLabel: 'Help',
    classString: 'subnav-help',
    menuLabel: 'Help?',
    windowType: WindowName.Help,
    menuType: WindowMenuType.Setting,
    config: {sizeX: 80, sizeY: 47}
  },
  // Admin Sub windows
  {
    tooltipLabel: 'Admin Sites',
    classString: 'sites-link',
    menuLabel: 'Sites',
    windowType: WindowName.AdminSite,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Admin Areas',
    classString: 'areas-link',
    menuLabel: 'Areas',
    windowType: WindowName.AdminArea,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Admin Zones',
    classString: 'zone-link',
    menuLabel: 'Zones',
    windowType: WindowName.AdminZone,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Admin Source',
    classString: 'nodes-link',
    menuLabel: 'Source',
    windowType: WindowName.AdminSource,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  // {
  //   tooltipLabel: 'People',
  //   classString: 'people-link',
  //   menuLabel: 'People',
  //   windowType: WindowName.People,
  //   menuType: WindowMenuType.Admin,
  //   config: {sizeX: 80, sizeY: 51}
  // },
  {
    tooltipLabel: 'Admin Groups',
    classString: 'companies-link',
    menuLabel: 'Groups',
    windowType: 'adminGroups',
    menuType: 'admin',
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Admin Products',
    classString: 'products-link',
    menuLabel: 'Products',
    windowType: WindowName.AdminProduct,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Admin Users',
    classString: 'groups-link',
    menuLabel: 'Users',
    windowType: WindowName.AdminUser,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Teams',
    classString: 'groups-link',
    menuLabel: 'Teams',
    windowType: WindowName.Team,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Resolved Reason',
    classString: 'resolved-reason-link',
    menuLabel: 'Resolved Reason',
    windowType: WindowName.AdminResolvedReason,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Outputs',
    classString: 'output-link',
    menuLabel: 'Outputs',
    windowType: WindowName.AdminOutput,
    menuType: WindowMenuType.Admin,
    config: {sizeX: 80, sizeY: 51}
  },
  // {
  //  tooltipLabel: 'Admin Identifiers',
  //  classString: 'identifier-link',
  //  menuLabel: 'Identifiers',
  //  windowType: 'adminIdentifier',
  //  menuType: 'admin',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Admin Assets',
  //  classString: 'assets-link',
  //  menuLabel: 'Assets',
  //  windowType: 'adminAsset',
  //  menuType: 'admin',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //   tooltipLabel: 'Admin Log',
  //   classString: 'log-link',
  //   menuLabel: 'Log',
  //   windowType: 'adminLog',
  //   menuType: 'admin',
  //   config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //   tooltipLabel: 'Admin Actions',
  //   classString: 'actions-link',
  //   menuLabel: 'Actions',
  //   windowType: 'adminAction',
  //   menuType: 'admin',
  //   config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Admin Teams',
  //  classString: 'teams-link',
  //  menuLabel: 'Teams',
  //  windowType: 'adminTeam',
  //  menuType: 'admin',
  //  config: {sizeX: 80, sizeY: 51}
  // },

  // SuperAdmin Sub windows
  {
    tooltipLabel: 'Action Reasons',
    classString: 'action-link',
    menuLabel: 'Action Reasons',
    windowType: WindowName.SuperAdminActionReason,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Area Types',
    classString: 'area-link',
    menuLabel: 'Area Types',
    windowType: WindowName.SuperAdminAreaType,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Asset Types',
    classString: 'asset-link',
    menuLabel: 'Asset Types',
    windowType: WindowName.SuperAdminAssetType,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Condition Types',
    classString: 'condition-link',
    menuLabel: 'Condition Types',
    windowType: WindowName.SuperAdminConditionType,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Changelog',
    classString: 'changelog',
    menuLabel: 'Changelog',
    windowType: WindowName.SuperAdminChangelog,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Global Stats',
    classString: 'stats-link',
    menuLabel: 'Global Stats',
    windowType: WindowName.SuperAdminGlobalStats,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Identifier Types',
    classString: 'identifier2-link',
    menuLabel: 'Identifier Types',
    windowType: WindowName.SuperAdminIdentifierType,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Modules',
    classString: 'modules-link',
    menuLabel: 'Modules',
    windowType: WindowName.SuperAdminModules,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Organisations',
    classString: 'companies-link',
    menuLabel: 'Organisations',
    windowType: WindowName.SuperAdminOrganisation,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Outputs',
    classString: 'output-link',
    menuLabel: 'Outputs',
    windowType: WindowName.SuperAdminOutput,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Site Types',
    classString: 'site-link',
    menuLabel: 'Site Types',
    windowType: WindowName.SuperAdminSiteType,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'Super Users',
    classString: 'super-user-link',
    menuLabel: 'Super Users',
    windowType: WindowName.SuperAdminUser,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  },
  {
    tooltipLabel: 'System Settings',
    classString: 'system-settings-link',
    menuLabel: 'System Settings',
    windowType: WindowName.SuperAdminSystemSettings,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 70, sizeY: 40},
  },
  {
    tooltipLabel: 'Zone Types',
    classString: 'zone-link',
    menuLabel: 'Zone Types',
    windowType: WindowName.SuperAdminZoneType,
    menuType: WindowMenuType.SuperAdmin,
    config: {sizeX: 80, sizeY: 51}
  }
  /*{
    tooltipLabel: 'Resolved Reasons',
    classString: 'resolved-link',
    menuLabel: 'Resolved Reasons',
    windowType: WindowName.SuperAdminResolvedReason,
    menuType: WindowMenuType.SuperAdmin,
    config: { sizeX: 80, sizeY: 51 }
  },*/

  // {
  //  tooltipLabel: 'User Roles',
  //  classString: 'roles-link',
  //  menuLabel: 'User Roles',
  //  windowType: 'intelicoUserRoles',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Tags',
  //  classString: 'tags-link',
  //  menuLabel: 'Tags',
  //  windowType: 'intelicoTags',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  /*{
    tooltipLabel: 'Teams',
    classString: 'groups-link',
    menuLabel: 'Teams',
    windowType: WindowName.SuperAdminTeam,
    menuType: WindowMenuType.SuperAdmin,
    config: { sizeX: 80, sizeY: 51 }
  },*/
  // {
  //  tooltipLabel: 'People Types',
  //  classString: 'people2-link',
  //  menuLabel: 'People Types',
  //  windowType: 'intelicoPeopleTypes',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Company Types',
  //  classString: 'companies2-link',
  //  menuLabel: 'Company Types',
  //  windowType: 'intelicoCompanyTypes',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },

  // {
  //  tooltipLabel: 'Input Types',
  //  classString: 'input-link',
  //  menuLabel: 'Input Types',
  //  windowType: 'intelicoInputTypes',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //   tooltipLabel: 'Input Agents',
  //   classString: 'input-agent-link',
  //   menuLabel: 'Input Agents',
  //   windowType: 'intelicoInputAgents',
  //   menuType: 'intelico',
  //   config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Alert Level',
  //  classString: 'alert-level-link',
  //  menuLabel: 'Alert Level',
  //  windowType: 'intelicoAlertLevel',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Alert Templates',
  //  classString: 'alert-templates-link',
  //  menuLabel: 'Alert Templates',
  //  windowType: 'intelicoAlertTemplates',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Asset Type',
  //  classString: 'assets-link2',
  //  menuLabel: 'Asset Type',
  //  windowType: 'intelicoAssetTypes',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Config',
  //  classString: 'config-link',
  //  menuLabel: 'Config',
  //  windowType: '',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'People Source',
  //  classString: 'people-source-link',
  //  menuLabel: 'People Source',
  //  windowType: 'intelicoPeopleSource',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Action Trigger',
  //  classString: 'action-trigger-link',
  //  menuLabel: 'Action Trigger',
  //  windowType: 'intelicoActionTrigger',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Output Agents',
  //  classString: 'output-agent-link',
  //  menuLabel: 'Output Agents',
  //  windowType: 'intelicoOutputAgents',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },
  // {
  //  tooltipLabel: 'Source Types',
  //  classString: 'identifier-source-link',
  //  menuLabel: 'Source Types',
  //  windowType: 'intelicoIdentifierSource',
  //  menuType: 'intelico',
  //  config: {sizeX: 80, sizeY: 51}
  // },

];
