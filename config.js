// ============================================================
// KleenPark Dashboard — Configuration
// ============================================================
const CONFIG = {
  // Google Sheet ID (same for all sheets)
  SHEET_ID: '1TYx10q42rBmZoIic4LTOU1d-6gQxE6aN8CTSV-kzSrE',

  // How often to auto-refresh (seconds)
  REFRESH_INTERVAL: 30,

  // Individual sheet GIDs
  SHEETS: {
    TRANSACTION_LOG: '668851967',
    CUSTOMER_DB:     '709157964',
    SERVICE_CATALOG: '1545336500',
    DAILY_CAPACITY:  '1493409340',
    QUOTE_REQUESTS:  '405452409',
    CALL_LOG:        '811989924',
  },

  // Daily capacity limits
  CAPACITY: {
    QUICK:   30,
    PREMIUM: 10,
  },
};
