// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  ad: '/application-development',
  qa: '/quality-assurance',
  sa: '/staff-augmentation',
  eb: '/e-bussiness'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    weeks: path(ROOTS_DASHBOARD, '/weeks'),
    levels: path(ROOTS_DASHBOARD, '/levels'),
    grading: path(ROOTS_DASHBOARD, '/grading'),
    branches: path(ROOTS_DASHBOARD, '/branches'),
    subjects: path(ROOTS_DASHBOARD, '/subjects'),
    topics: path(ROOTS_DASHBOARD, '/topics'),
    users: path(ROOTS_DASHBOARD, '/users'),
    studentReview: path(ROOTS_DASHBOARD, '/student-review'),
    enquiries: path(ROOTS_DASHBOARD, '/enquiries'),
    timeSheet: path(ROOTS_DASHBOARD, '/time-sheet')
  },
  
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
