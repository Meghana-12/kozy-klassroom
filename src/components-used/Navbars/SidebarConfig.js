import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const sidebarConfigStudent = [
  {
    title: 'assignments',
    path: '/dashboard/assignments',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'announcements',
    path: '/dashboard/announcements',
    icon: getIcon(peopleFill)
  }
];
export const sidebarConfig = [
  {
    title: 'assignments',
    path: '/dashboard/assignments',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'announcements',
    path: '/dashboard/announcements',
    icon: getIcon(peopleFill)
  },
  {
    title: 'submissions',
    path: '/dashboard/submissions',
    icon: getIcon(shoppingBagFill)
  }
];

export default sidebarConfig;
