export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED"
  | "PRODUCT_RESTORED"
  | "PRODUCT_ACTIVATED"
  | "PRODUCT_DEACTIVATED"
  | "STOCK_RECEIVED"
  | "STOCK_ADJUSTED"
  | "STOCK_REMOVED"
  | "SALE_CREATED"
  | "SALE_CANCELLED"
  | "BUSINESS_DAY_OPENED"
  | "BUSINESS_DAY_CLOSED"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DISABLED";

export type ActivityEntity =
  | "PRODUCT"
  | "SALE"
  | "USER"
  | "BUSINESS_DAY";

export interface ActivityLog {
  id: string;
  userId: string;

  user: {
    id: string;
    fullName: string;
  };

  businessDayId: string | null;

  action: ActivityAction;

  entityType: ActivityEntity | null;
  entityId: string | null;

  description: string | null;

  createdAt: string;
}

export interface ActivityLogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActivityLogsResponse {
  activities: ActivityLog[];
  pagination: ActivityLogPagination;
}