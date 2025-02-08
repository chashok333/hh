// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Admin',
    items: [
      {
        title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.menuItem, // roles: ['admin'], 
      },
      // { title: 'grading', path: PATH_DASHBOARD.general.grading, icon: ICONS.ecommerce },
      { title: 'Users', path: PATH_DASHBOARD.general.users, icon: ICONS.dashboard },
    ]
  },
  // {
  //   subheader: 'General',
  //   items: [
  //     {
  //       title: 'Configuration',
  //       icon: ICONS.kanban,
  //       // roles: ['admin', 'superadmin'],
  //       children: [
  //         { title: 'Users', path: PATH_DASHBOARD.general.users, icon: ICONS.dashboard },
  //         // { title: 'Latest Entries', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
  //         // { title: 'weeks', path: PATH_DASHBOARD.general.weeks, icon: ICONS.menuItem },
  //         // { title: 'levels', path: PATH_DASHBOARD.general.levels, icon: ICONS.menuItem },
  //         // { title: 'branches', path: PATH_DASHBOARD.general.branches, icon: ICONS.menuItem },
  //         // { title: 'subjects', path: PATH_DASHBOARD.general.subjects, icon: ICONS.menuItem },
  //         // { title: 'topics', path: PATH_DASHBOARD.general.topics, icon: ICONS.booking },
  //       ]
  //     }
  //   ],
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     // USER
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'list', path: PATH_DASHBOARD.user.list, roles: ['admin', 'superadmin'] },
  //         { title: 'Teacher Slots', path: PATH_DASHBOARD.user.sessions },
  //         { title: 'Calender Sessions', path: PATH_DASHBOARD.user.calendar },
  //       ],
  //     },

  //   ],
  // },

];

export default navConfig;

