import { environment } from './../../environments/environment';

export namespace Constants {
  export const version = `Version: ${environment.version}`;
  export const productName = 'Admin';
  export const copyright = `Copyright © ${new Date().getFullYear()}`;
  export const rightReserved = 'All rights reserved.';
  export const Pages = {
    LOGIN: 'login/',
    DASHBOARD:'/dashboard',
    FAQ_LIST: '/faq/list',
    FAQ_ADD: '/faq/add',
    FAQ_EDIT: '/faq/edit',
    REMINDERS_LIST: '/reminders/list',
    REMINDERS_ADD: '/reminders/add',
    REMINDERS_EDIT: '/reminders/edit',
  };
  export const ErrorMessages = {
    serverError: 'Server Error.',
    sessionExpired: 'Session Expired.',
  };
  export const ConfirmMessages = {};
  export const SuccessMessages = {};
  export const Roles = {
    '1': 'Admin',
    '2': 'Viewer',
  };
}
