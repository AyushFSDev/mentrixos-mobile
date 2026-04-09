/**
 * @file strings.js
 * @module constants/strings
 * @description Central repository for every user-facing string in the app.
 *
 * Rules:
 *   - No string should ever be hardcoded inside a component.
 *   - All copy lives here so it can be audited, updated, or localized
 *     from a single location without touching component files.
 *   - To add a new string: pick the correct section, follow the naming
 *     convention (SCREAMING_SNAKE_CASE), and add it to the STRINGS object.
 */

export const STRINGS = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  BRAND_MENTRIX: 'Mentrix',
  BRAND_OS: 'OS',
  BRAND_FULL: 'MentrixOS',

  // Tagline segments — rendered as a multi-colored inline row in BrandHeader.
  TAGLINE_1: 'MentrixOS = ',
  TAGLINE_MENTOR: 'Mentor',
  TAGLINE_PLUS_MATRIX: ' + Matrix + ',
  TAGLINE_METRICS: 'Metrics',
  TAGLINE_2A: 'combined into one ',
  TAGLINE_2B: 'Operating System ',
  TAGLINE_2C: 'for your institute',

  // ── Input placeholders ─────────────────────────────────────────────────────
  PLACEHOLDER_PHONE_EMAIL: 'Enter phone or email',
  PLACEHOLDER_PHONE_NUMBER: 'Phone number',
  PLACEHOLDER_EMAIL: 'Email address',
  PLACEHOLDER_PASSWORD: 'Password',
  PLACEHOLDER_SEARCH_INSTITUTES: 'Search institutes...',

  // ── Buttons ────────────────────────────────────────────────────────────────
  BTN_SEND_CODE: 'Send Code',
  BTN_USE_PASSWORD: 'Use Password',
  BTN_CONTINUE: 'Continue',
  BTN_JOIN_INSTITUTE: 'Join Institute',
  BTN_BACK: 'Back',
  BTN_SHOW_PASSWORD: 'Show password',
  BTN_HIDE_PASSWORD: 'Hide password',

  // ── OTP screen ────────────────────────────────────────────────────────────
  OTP_LABEL: 'Enter 6-digit code',
  OTP_RESEND_PREFIX: "Didn't get Code? ",
  OTP_RESEND_LINK: 'Resend Code',

  // ── Password screen ───────────────────────────────────────────────────────
  FORGOT_PASSWORD: 'Forgot Password',

  // ── Divider ───────────────────────────────────────────────────────────────
  DIVIDER_OR: 'OR',

  // ── Country selector — default region: India ──────────────────────────────
  COUNTRY_FLAG: '🇮🇳',
  COUNTRY_CODE: '+91',

  // ── Auth screen bottom strip ──────────────────────────────────────────────
  BOTTOM_TITLE: 'Easy-to-Use, End-to-End',
  BOTTOM_SUBTITLE: 'Smart AI SaaS for Your Institute',

  // ── Setup card (login screen) ─────────────────────────────────────────────
  SETUP_QUESTION: "Don't have an institute yet?",
  SETUP_LINK: 'Setup Institute',

  // ── Legal footer ──────────────────────────────────────────────────────────
  FOOTER_TEXT: 'By continuing, you agree to our',
  FOOTER_LINK: 'Terms & Privacy Policy',

  // ── Accessibility labels for header icon buttons ──────────────────────────
  BTN_REPORT: 'Report a problem',
  BTN_DARK_MODE: 'Dark Mode',
  BTN_LIGHT_MODE: 'Light Mode',

  // ── Institute Select screen ───────────────────────────────────────────────
  GREETING_HEY: 'Hey',
  INSTITUTE_SELECT_SUBTITLE: 'Select your institute to continue',
  INSTITUTE_EMPTY: 'No institutes found.',

  // ── Role Select screen ────────────────────────────────────────────────────
  ROLE_SELECT_TITLE: 'Select Your Role',
  ROLE_SELECT_SUBTITLE: 'Choose the role you want to continue with',
  ROLE_CHANGE_INSTITUTE: 'Change Institute',

  // ── Support footer ────────────────────────────────────────────────────────
  SUPPORT_TROUBLE_TEXT: 'Trouble logging in?',
  SUPPORT_EMAIL: 'support@mentrixos.com',

  // ── Error messages ────────────────────────────────────────────────────────
  ERR_GENERIC: 'Something went wrong. Please try again.',
  ERR_EMPTY_INPUT: 'Please enter your phone number or email.',
  ERR_INVALID_OTP: 'Please enter the complete 6-digit code.',
  ERR_EMPTY_PASSWORD: 'Please enter your password.',
  ERR_SEND_CODE: 'Failed to send code. Please try again.',
  ERR_VERIFY_OTP: 'Invalid code. Please try again.',
  ERR_LOGIN: 'Invalid credentials. Please try again.',

  // ── Dashboard ─────────────────────────────────────────────────────────────
  DASHBOARD_WELCOME: 'Welcome Back! 👋',
  DASHBOARD_SUBTITLE: 'MentrixOS Dashboard',
  DASHBOARD_LOGOUT_TITLE: 'Logout',
  DASHBOARD_LOGOUT_MSG: 'Are you sure you want to logout?',
  DASHBOARD_LOGOUT_CANCEL: 'Cancel',
  DASHBOARD_LOGOUT_CONFIRM: 'Logout',
  DASHBOARD_NAV_MENU: '☰',

  // ── Dashboard stat cards ──────────────────────────────────────────────────
  STAT_ACTIVE_STUDENTS_LABEL: 'Active Students',
  STAT_ACTIVE_STUDENTS_DESC: 'Currently enrolled and active this semester',
  STAT_INACTIVE_STUDENTS_LABEL: 'Inactive Students',
  STAT_INACTIVE_STUDENTS_DESC: 'Students with no activity in the last 30 days',
  STAT_ACTIVE_MODULES_LABEL: 'Active Modules',
  STAT_ACTIVE_MODULES_DESC: 'Courses and learning modules currently running',
  STAT_STAFF_LABEL: 'Staff Members',
  STAT_STAFF_DESC: 'Teachers, admins, and support staff',
};
