/**
 * Configuration for OpenAPI spec processing.
 * Defines target subsections and URL pattern classification rules.
 */

export interface SubsectionDef {
  title: string;
  description: string;
  serverBase: string;
}

// Target subsections based on the API hierarchy.
export const SUBSECTIONS: Record<string, SubsectionDef> = {
  // ── Customer ──
  "customer-v1": {
    title: "Customer (V1) APIs",
    description: "Customer management endpoints - Version 1.1",
    serverBase: "/v1.1",
  },
  "customer-v2": {
    title: "Customer (V2) APIs",
    description: "Customer management endpoints - Version 2",
    serverBase: "/v2",
  },
  "customer-v2-lookup": {
    title: "Customer (V2 Lookup) APIs",
    description: "Customer lookup endpoints - Version 2",
    serverBase: "/v2",
  },
  "customer-labels": {
    title: "Customer Labels APIs",
    description: "Customer label management endpoints",
    serverBase: "/v2",
  },

  // ── Transaction ──
  "transaction-v1": {
    title: "Transaction (V1) APIs",
    description: "Transaction endpoints - Version 1",
    serverBase: "/v1.1",
  },
  "transaction-v2": {
    title: "Transaction (V2) APIs",
    description: "Transaction endpoints - Version 2",
    serverBase: "/v2",
  },
  "transaction-rejection": {
    title: "Transaction Rejection APIs",
    description: "Rejected transaction management endpoints",
    serverBase: "/v1",
  },

  // ── Coupon ──
  "coupon-v1": {
    title: "Coupon (V1.1) APIs",
    description: "Coupon management endpoints - Version 1.1",
    serverBase: "/v1.1",
  },
  "coupon-v2": {
    title: "Coupon (V2) APIs",
    description: "Coupon management endpoints - Version 2",
    serverBase: "/v2",
  },
  "coupon-upload": {
    title: "Coupon Upload (V1) APIs",
    description: "Coupon upload and batch processing endpoints",
    serverBase: "/v1",
  },

  // ── Cards ──
  "cards": {
    title: "Cards APIs",
    description: "Card series and card management endpoints",
    serverBase: "/v2",
  },

  // ── Points ──
  "points-v2": {
    title: "Points (V2) APIs",
    description: "Points management endpoints - Version 2",
    serverBase: "/v2",
  },
  "points-v1": {
    title: "Points (V1.1) APIs",
    description: "Points redemption and validation endpoints - Version 1.1",
    serverBase: "/v1.1",
  },
  "points-ledger": {
    title: "Points Ledger APIs",
    description: "Points ledger and balance inquiry endpoints",
    serverBase: "/v2",
  },
  "points-connected-orgs": {
    title: "Points Connected Org APIs",
    description: "Points ledger endpoints for connected organizations",
    serverBase: "/v2.1",
  },

  // ── Search ──
  "search-apis": {
    title: "Search APIs",
    description: "Search filter, data field, and Cortex search endpoints",
    serverBase: "/v1",
  },
  "event-transformation-cortex": {
    title: "Event Transformation for Cortex Search APIs",
    description: "Custom event transformation configuration for Cortex search",
    serverBase: "/v1",
  },

  // ── Badges ──
  "badges": {
    title: "Badges APIs",
    description: "Badge creation, issuance, and management endpoints",
    serverBase: "/v1",
  },

  // ── Rewards Catalog ──
  "rewards-catalog-management": {
    title: "Reward Catalog Management APIs",
    description: "Create, update, and retrieve reward details",
    serverBase: "/v1",
  },
  "rewards-catalog-categories": {
    title: "Reward Catalog Categories APIs",
    description: "Reward category management endpoints",
    serverBase: "/v1",
  },
  "rewards-rich-text-content": {
    title: "Rich Text Content for Rewards APIs",
    description: "Rich text content metadata management for rewards",
    serverBase: "/v1",
  },
  "rewards-catalog-issuance": {
    title: "Reward Catalog Issuance APIs",
    description: "Reward issuance and claiming endpoints",
    serverBase: "/v1",
  },
  "rewards-user-queries": {
    title: "User-Centric Reward Queries APIs",
    description: "Query rewards, vouchers, and transactions for a user",
    serverBase: "/v1",
  },
  "rewards-brand-queries": {
    title: "Brand-Level Reward Queries APIs",
    description: "Query rewards and availability by brand",
    serverBase: "/v1",
  },
  "rewards-catalog-promotions": {
    title: "Reward Catalog Promotions APIs",
    description: "Catalog promotion management endpoints",
    serverBase: "/v1",
  },
  "rewards-catalog-custom-fields": {
    title: "Reward Catalog Custom Fields APIs",
    description: "Custom field management for rewards",
    serverBase: "/v1",
  },
  "rewards-catalog-groups": {
    title: "Reward Catalog Groups APIs",
    description: "Reward group management endpoints",
    serverBase: "/v1",
  },
  "rewards-points-restrictions": {
    title: "Points Restrictions APIs",
    description: "Points restriction configuration for rewards",
    serverBase: "/v1",
  },
  "rewards-org-config": {
    title: "Organization-Level Configuration for Rewards APIs",
    description: "Organization-level reward catalog configuration",
    serverBase: "/v1",
  },
  "rewards-vendor-management": {
    title: "Vendor Management & Redemption APIs",
    description: "Vendor creation, management, and redemption endpoints",
    serverBase: "/v1",
  },
  "rewards-file-service": {
    title: "File Service APIs",
    description: "Image upload endpoints for rewards",
    serverBase: "/v1",
  },
  "rewards-fulfillment-status": {
    title: "Fulfillment Status APIs",
    description: "Reward fulfillment status management endpoints",
    serverBase: "/v1",
  },
  "rewards-expiry-reminders": {
    title: "Reward Expiry Reminders APIs",
    description: "Reward expiry reminder configuration endpoints",
    serverBase: "/v1",
  },
  "rewards-connected-orgs": {
    title: "Rewards Connected-Org APIs",
    description: "Reward endpoints for connected organizations",
    serverBase: "/v1",
  },
  "rewards-language": {
    title: "Rewards Language APIs",
    description: "Language metadata management for rewards",
    serverBase: "/v1",
  },

  // ── Target/Milestone ──
  "milestones-streaks": {
    title: "Milestone & Streaks APIs",
    description: "Target group, milestone, and streak management endpoints",
    serverBase: "/v3",
  },
  "target-connected-orgs": {
    title: "Target Connected Org APIs",
    description: "Target enrollment endpoints for connected organizations",
    serverBase: "/v3",
  },
  "leaderboards": {
    title: "Leaderboards APIs",
    description: "Leaderboard ranking and user rank endpoints",
    serverBase: "/v1",
  },

  // ── Promotions ──
  "loyalty-promotion": {
    title: "Loyalty Promotion APIs",
    description: "Loyalty promotion enrollment, issuance, and management",
    serverBase: "/v1",
  },
  "unified-loyalty-promotions": {
    title: "Unified Loyalty Promotions APIs",
    description: "Unified promotion creation, review, and enrollment",
    serverBase: "/v3",
  },
  "cart-promotions": {
    title: "Cart Promotions APIs",
    description: "Cart promotion management, activation, and evaluation",
    serverBase: "/v1",
  },

  // ── User Group ──
  "user-group": {
    title: "User Group APIs",
    description: "User group management, membership, and transactions",
    serverBase: "/v2",
  },

  // ── Organization ──
  "organization-v1": {
    title: "Organization (V1) APIs",
    description: "Organization details, entities, and configuration - Version 1",
    serverBase: "/v1.1",
  },
  "organization-v2": {
    title: "Organization (V2) APIs",
    description: "Organization till, store, and program management - Version 2",
    serverBase: "/v2",
  },

  // ── Communications ──
  "communications-v2": {
    title: "Communications (V2) APIs",
    description: "Communication message sending endpoints - Version 2",
    serverBase: "/v2",
  },
  "communications-v1": {
    title: "Communications (V1) APIs",
    description: "Communication message sending endpoints - Version 1",
    serverBase: "/v1.1",
  },

  // ── Custom Fields ──
  "custom-fields": {
    title: "Custom Fields APIs",
    description: "Custom field creation and tagging endpoints",
    serverBase: "/v2",
  },

  // ── Audit Logs ──
  "audit-logs": {
    title: "Audit Logs APIs",
    description: "Audit log retrieval endpoints",
    serverBase: "/v2",
  },

  // ── PII Deletion ──
  "pii-deletion": {
    title: "PII Deletion APIs",
    description: "PII data deletion request and status endpoints",
    serverBase: "/v2",
  },

  // ── Leads ──
  "leads": {
    title: "Leads APIs",
    description: "Lead management, assignment, and follow-up endpoints",
    serverBase: "/v2",
  },

  // ── Staff ──
  "staff": {
    title: "Staff APIs",
    description: "Staff account management endpoints",
    serverBase: "/v2",
  },

  // ── Events ──
  "behavioral-events": {
    title: "Behavioral Events APIs",
    description: "Custom event creation, webhook, and event log endpoints",
    serverBase: "/v2",
  },
  "event-notification-logs": {
    title: "Event Notification Logs APIs",
    description: "Webhook and event log management endpoints",
    serverBase: "/v3",
  },

  // ── Company ──
  "company": {
    title: "Company APIs",
    description: "Company creation and management endpoints",
    serverBase: "/v2",
  },

  // ── Requests ──
  "request-v1": {
    title: "Request (V1) APIs",
    description: "Request submission and approval endpoints - Version 1",
    serverBase: "/v1.1",
  },
  "requests-v2": {
    title: "Requests (V2) APIs",
    description: "Request management endpoints - Version 2",
    serverBase: "/v2",
  },
  "request-workflow": {
    title: "Request Workflow APIs",
    description: "Request workflow creation and approval endpoints",
    serverBase: "/v2",
  },

  // ── Partner Program ──
  "partner-program": {
    title: "Partner Program APIs",
    description: "Customer partner program linking and activity endpoints",
    serverBase: "/v2",
  },

  // ── Authentication ──
  "user-authentication": {
    title: "User Authentication APIs",
    description: "User registration and authorization endpoints",
    serverBase: "/v2",
  },
  "customer-auth-first-factor": {
    title: "Customer Authentication - First Factor APIs",
    description: "Token generation, OTP, and password authentication endpoints",
    serverBase: "/v1",
  },
  "customer-auth-mfa": {
    title: "Customer Authentication - Multi-Factor APIs",
    description: "MFA token, OTP, and password flow endpoints",
    serverBase: "/v1",
  },

  // ── OTP ──
  "otp": {
    title: "OTP APIs",
    description: "OTP generation and validation endpoints",
    serverBase: "/v2",
  },

  // ── Product ──
  "product-v2": {
    title: "Product (V2) APIs",
    description: "Product brand, category, attribute, and SKU management",
    serverBase: "/v2",
  },
  "product-v1": {
    title: "Product (V1) APIs",
    description: "Product management endpoints - Version 1",
    serverBase: "/v1.1",
  },

  // ── Store ──
  "store": {
    title: "Store APIs",
    description: "Store details, configuration, and task endpoints",
    serverBase: "/v1.1",
  },
  "store-locator": {
    title: "Store Locator APIs",
    description: "Store locator and sync data endpoints",
    serverBase: "/v1",
  },

  // ── Task ──
  "task": {
    title: "Task APIs",
    description: "Task management and reminder endpoints",
    serverBase: "/v1.1",
  },

  // ── Referral ──
  "referral": {
    title: "Referral APIs",
    description: "Customer referral and validation endpoints",
    serverBase: "/v2",
  },

  // ── DIY Template ──
  "diy-template": {
    title: "Connect+ DIY Template APIs",
    description: "DIY template creation and workspace retrieval endpoints",
    serverBase: "/v1",
  },

  // ── Private/Other ──
  "private-apis": {
    title: "Private APIs",
    description: "Internal data analytics and ledger detail endpoints",
    serverBase: "/v1",
  },
  "other-apis": {
    title: "Other APIs",
    description: "Miscellaneous utility and configuration endpoints",
    serverBase: "/v2",
  },
};

// Classification rules: ordered list of [pattern, subsectionId].
// The first matching pattern wins, so more specific patterns must come first.
interface ClassificationRule {
  pattern: RegExp;
  subsection: string;
}

export const CLASSIFICATION_RULES: ClassificationRule[] = [
  // ── Customer Authentication (before general auth) ──
  { pattern: /\/auth\/v1\/mfa\//, subsection: "customer-auth-mfa" },
  { pattern: /\/auth\/v1\/web\//, subsection: "customer-auth-first-factor" },
  { pattern: /\/auth\/v1\//, subsection: "customer-auth-first-factor" },

  // ── Customer V2 Lookup (before general /customers) ──
  { pattern: /\/customers\/lookup/, subsection: "customer-v2-lookup" },

  // ── Customer Labels (before general /customers) ──
  { pattern: /\/customers\/labels/, subsection: "customer-labels" },
  { pattern: /\/customers\/[^/]*\/labels/, subsection: "customer-labels" },
  { pattern: /\/customers\/[^/]*\/changeLabels/, subsection: "customer-labels" },

  // ── Customer V2 ──
  { pattern: /\/v2\/customers/, subsection: "customer-v2" },
  { pattern: /\/customers/, subsection: "customer-v2" },
  { pattern: /\/integrations\/customer/, subsection: "customer-v2" },

  // ── Customer V1 ──
  { pattern: /\/v1\.1\/customer\//, subsection: "customer-v1" },
  { pattern: /\/customer\/add/, subsection: "customer-v1" },
  { pattern: /\/customer\/get/, subsection: "customer-v1" },
  { pattern: /\/customer\/update/, subsection: "customer-v1" },
  { pattern: /\/customer\/search/, subsection: "customer-v1" },
  { pattern: /\/customer\/coupons/, subsection: "customer-v1" },
  { pattern: /\/customer\/preferences/, subsection: "customer-v1" },
  { pattern: /\/customer\/notes/, subsection: "customer-v1" },
  { pattern: /\/customer\/tickets/, subsection: "customer-v1" },
  { pattern: /\/customer\/subscriptions/, subsection: "customer-v1" },
  { pattern: /\/customer\/interactions/, subsection: "customer-v1" },
  { pattern: /\/customer\/redemptions/, subsection: "customer-v1" },
  { pattern: /\/customer\/referrals/, subsection: "customer-v1" },
  { pattern: /\/customer\/recommendations/, subsection: "customer-v1" },
  { pattern: /\/customer\/walkin/, subsection: "customer-v1" },

  // ── Transaction V2 (before V1) ──
  { pattern: /\/v2\/transactions/, subsection: "transaction-v2" },
  { pattern: /\/transactions/, subsection: "transaction-v2" },
  { pattern: /\/simulation\/transactions/, subsection: "transaction-v2" },

  // ── Transaction V1 ──
  { pattern: /\/v1\.1\/transaction\//, subsection: "transaction-v1" },
  { pattern: /\/transaction\/add/, subsection: "transaction-v1" },
  { pattern: /\/transaction\/get/, subsection: "transaction-v1" },
  { pattern: /\/transaction\/update/, subsection: "transaction-v1" },

  // ── Transaction Rejection ──
  { pattern: /\/rejectedTransactions/, subsection: "transaction-rejection" },

  // ── Coupon Upload (before general coupon) ──
  { pattern: /\/upload\//, subsection: "coupon-upload" },
  { pattern: /\/coupon\/api\/v1\/upload/, subsection: "coupon-upload" },

  // ── Coupon V2 ──
  { pattern: /\/v2\/coupon/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/series/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/bulk/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/issue\/multiple/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/reactivate/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/revoke/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/is_redeemable/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/redeem$/, subsection: "coupon-v2" },
  { pattern: /\/coupon\/issue$/, subsection: "coupon-v2" },
  { pattern: /\/coupon$/, subsection: "coupon-v2" },

  // ── Coupon V1.1 ──
  { pattern: /\/v1\.1\/coupon/, subsection: "coupon-v1" },
  { pattern: /\/coupon\//, subsection: "coupon-v1" },

  // ── Cards ──
  { pattern: /\/card/, subsection: "cards" },
  { pattern: /\/cardNumber/, subsection: "cards" },
  { pattern: /\/configs\/CONF_MAX_CARDS/, subsection: "cards" },

  // ── Points Connected Orgs (before general points/ledger) ──
  { pattern: /\/v2\.1\/pointsLedger/, subsection: "points-connected-orgs" },

  // ── Points Ledger (before general points) ──
  { pattern: /\/pointsLedger/, subsection: "points-ledger" },

  // ── Points V2 ──
  { pattern: /\/v2\/points/, subsection: "points-v2" },
  { pattern: /\/points\/isTransferable/, subsection: "points-v2" },
  { pattern: /\/points\/reverse/, subsection: "points-v2" },
  { pattern: /\/points\/transfer/, subsection: "points-v2" },
  { pattern: /\/points\/unlockPromisedPoints/, subsection: "points-v2" },
  { pattern: /\/points\/updateRedemption/, subsection: "points-v2" },
  { pattern: /\/points\/userGroup2/, subsection: "points-v2" },

  // ── Points V1.1 ──
  { pattern: /\/v1\.1\/points/, subsection: "points-v1" },
  { pattern: /\/points\/redeem/, subsection: "points-v1" },
  { pattern: /\/points\/isredeemable/, subsection: "points-v1" },
  { pattern: /\/points\/validationcode/, subsection: "points-v1" },
  { pattern: /\/points\//, subsection: "points-v2" },

  // ── Leaderboards (before targets) ──
  { pattern: /\/leaderboards\//, subsection: "leaderboards" },

  // ── Target/Milestones ──
  { pattern: /\/targetGroups/, subsection: "milestones-streaks" },
  { pattern: /\/v3\/targetGroups/, subsection: "milestones-streaks" },
  { pattern: /\/users\/.*target/i, subsection: "milestones-streaks" },
  { pattern: /\/users\/replayEvents/, subsection: "milestones-streaks" },
  { pattern: /\/users\/triggerTarget/, subsection: "milestones-streaks" },
  { pattern: /\/users\/updateTarget/, subsection: "milestones-streaks" },
  { pattern: /\/users\/.*\/enrolledTargets/, subsection: "milestones-streaks" },
  { pattern: /\/users\/.*\/targetGroups/, subsection: "milestones-streaks" },
  { pattern: /\/users\/.*\/trackedTarget/, subsection: "milestones-streaks" },

  // ── Unified Loyalty Promotions ──
  { pattern: /\/v3\/unifiedPromotions/, subsection: "unified-loyalty-promotions" },
  { pattern: /\/unifiedPromotions/, subsection: "unified-loyalty-promotions" },

  // ── Rewards subsections (specific before general) ──
  { pattern: /\/file-service\//, subsection: "rewards-file-service" },
  { pattern: /\/rewards\/core\/v1\/vendor/, subsection: "rewards-vendor-management" },
  { pattern: /\/rewards\/core\/v1\/fulfillmentStatus/, subsection: "rewards-fulfillment-status" },
  { pattern: /\/rewards\/core\/v1\/reward\/expiryReminder/, subsection: "rewards-expiry-reminders" },
  { pattern: /\/rewards\/core\/v1\/brand\/richContentMeta/, subsection: "rewards-rich-text-content" },
  { pattern: /\/rewards\/core\/v1\/metadata\/categor/, subsection: "rewards-catalog-categories" },
  { pattern: /\/rewards\/core\/v1\/brand\/customfield/, subsection: "rewards-catalog-custom-fields" },
  { pattern: /\/rewards\/core\/v1\/group/, subsection: "rewards-catalog-groups" },
  { pattern: /\/rewards\/core\/v1\/brand\/constraints/, subsection: "rewards-points-restrictions" },
  { pattern: /\/rewards\/core\/v1\/brand\/config/, subsection: "rewards-org-config" },
  { pattern: /\/rewards\/core\/v1\/[^/]*\/getConfig/, subsection: "rewards-org-config" },
  { pattern: /\/rewards\/core\/v1\/promotion/, subsection: "rewards-catalog-promotions" },
  { pattern: /\/rewards\/core\/v1\/reward\/claim/, subsection: "rewards-catalog-issuance" },
  { pattern: /\/rewards\/core\/v1\/user\/reward\/.*\/issue/, subsection: "rewards-catalog-issuance" },
  { pattern: /\/rewards\/core\/v1\/user\/rewards\/issue/, subsection: "rewards-catalog-issuance" },
  { pattern: /\/rewards\/core\/v1\/management\/transactions/, subsection: "rewards-catalog-issuance" },
  { pattern: /\/rewards\/core\/v1\/user\//, subsection: "rewards-user-queries" },
  { pattern: /\/rewards\/core\/v1\/management\/customer/, subsection: "rewards-user-queries" },
  { pattern: /\/rewards\/core\/v1\.1\/reward-transactions/, subsection: "rewards-user-queries" },
  { pattern: /\/rewards\/core\/v1\/reward-transactions/, subsection: "rewards-user-queries" },
  { pattern: /\/rewards\/core\/v1\/reward\/brand/, subsection: "rewards-brand-queries" },
  { pattern: /\/rewards\/core\/v1\/reward\/list\/brand/, subsection: "rewards-brand-queries" },
  { pattern: /\/rewards\/core\/v1\/brand\/getAll/, subsection: "rewards-brand-queries" },
  { pattern: /\/rewards\/core\/v1\/reward/, subsection: "rewards-catalog-management" },
  { pattern: /\/rewards\/core\/v1\/user-merge/, subsection: "rewards-user-queries" },
  { pattern: /\/rewards\//, subsection: "rewards-catalog-management" },
  { pattern: /\/mobile\/.*marvel.*reward/i, subsection: "rewards-user-queries" },
  { pattern: /\/mobile\/.*marvel.*voucher/i, subsection: "rewards-user-queries" },
  { pattern: /\/v1\.1\/user\/rewards/, subsection: "rewards-catalog-issuance" },
  { pattern: /\/v1\.1\/user\/user_rewards/, subsection: "rewards-user-queries" },

  // ── Loyalty Promotions ──
  { pattern: /\/loyalty\/v1\/programs/, subsection: "loyalty-promotion" },
  { pattern: /\/loyalty\/api\/v1\//, subsection: "loyalty-promotion" },
  { pattern: /\/promotion\/bulk\//, subsection: "loyalty-promotion" },
  { pattern: /\/promotion\/issue/, subsection: "loyalty-promotion" },

  // ── Cart Promotions ──
  { pattern: /\/api_gateway\/v1\/promotions/, subsection: "cart-promotions" },
  { pattern: /\/v1\/promotions\//, subsection: "cart-promotions" },
  { pattern: /\/v1\/promotion-management\//, subsection: "cart-promotions" },
  { pattern: /\/v1\/management\/promotions/, subsection: "cart-promotions" },
  { pattern: /\/promotion-management\/promotions/, subsection: "cart-promotions" },

  // ── Badges ──
  { pattern: /\/badges\//, subsection: "badges" },
  { pattern: /\/v1\/badges\//, subsection: "badges" },

  // ── Event Transformation (before general cortex) ──
  { pattern: /\/cortex\/v1\/neo-config/, subsection: "event-transformation-cortex" },

  // ── Search / Cortex ──
  { pattern: /\/cortex\//, subsection: "search-apis" },
  { pattern: /\/search\//, subsection: "search-apis" },

  // ── Event Notification Logs ──
  { pattern: /\/webHooks/i, subsection: "event-notification-logs" },

  // ── Behavioral Events ──
  { pattern: /\/events\//, subsection: "behavioral-events" },
  { pattern: /\/events\?/, subsection: "behavioral-events" },

  // ── User Group ──
  { pattern: /\/userGroup/, subsection: "user-group" },

  // ── Organization V2 ──
  { pattern: /\/v2\/org/, subsection: "organization-v2" },
  { pattern: /\/orgEntity\//, subsection: "organization-v2" },
  { pattern: /\/organization\/activeTill/, subsection: "organization-v2" },
  { pattern: /\/organization\/customFields/, subsection: "organization-v2" },
  { pattern: /\/organization\/labels/, subsection: "organization-v2" },
  { pattern: /\/organization\/programs/, subsection: "organization-v2" },
  { pattern: /\/organization\/till/, subsection: "organization-v2" },

  // ── Organization V1 ──
  { pattern: /\/v1\.1\/organization/, subsection: "organization-v1" },
  { pattern: /\/organization\//, subsection: "organization-v1" },
  { pattern: /\/org\/[^/]*\/sources/, subsection: "organization-v1" },
  { pattern: /\/entity\/extended_field/, subsection: "organization-v1" },

  // ── Company ──
  { pattern: /\/companies/, subsection: "company" },

  // ── Communications ──
  { pattern: /\/v2\/communications/, subsection: "communications-v2" },
  { pattern: /\/communications\//, subsection: "communications-v2" },

  // ── Staff ──
  { pattern: /\/staff/, subsection: "staff" },

  // ── Leads ──
  { pattern: /\/leads/, subsection: "leads" },

  // ── User Auth ──
  { pattern: /\/user_auth\//, subsection: "user-authentication" },

  // ── Requests ──
  { pattern: /\/request-workflow/, subsection: "request-workflow" },
  { pattern: /\/v2\/requests/, subsection: "requests-v2" },
  { pattern: /\/requests/, subsection: "requests-v2" },

  // ── Request V1 ──
  { pattern: /\/v1\.1\/request/, subsection: "request-v1" },
  { pattern: /\/request\//, subsection: "request-v1" },

  // ── Partner Program ──
  { pattern: /\/partnerProgram/, subsection: "partner-program" },

  // ── Custom Fields ──
  { pattern: /\/customField/, subsection: "custom-fields" },
  { pattern: /\/customFields/, subsection: "custom-fields" },
  { pattern: /\/entity\/extendedField/, subsection: "custom-fields" },

  // ── Audit Logs ──
  { pattern: /\/audits/, subsection: "audit-logs" },

  // ── Audit Logs (unified) ──
  { pattern: /\/unified-audits/, subsection: "audit-logs" },

  // ── Referral ──
  { pattern: /\/referral/, subsection: "referral" },

  // ── Product V1 ──
  { pattern: /\/v1\.1\/product/, subsection: "product-v1" },
  { pattern: /\/product\//, subsection: "product-v1" },

  // ── Store ──
  { pattern: /\/v1\.1\/store/, subsection: "store" },
  { pattern: /\/store\//, subsection: "store" },

  // ── Task ──
  { pattern: /\/v1\.1\/task/, subsection: "task" },
  { pattern: /\/task\//, subsection: "task" },

  // ── OTP ──
  { pattern: /\/otp\//, subsection: "otp" },

  // ── Historical Points ──
  { pattern: /\/historicalPoints/, subsection: "points-v2" },

  // ── Milestones (v3 path) ──
  { pattern: /\/v3\/milestones/, subsection: "milestones-streaks" },

  // ── OTP (v2 path) ──
  { pattern: /\/v2\/otp/, subsection: "otp" },

  // ── Extended Fields ──
  { pattern: /\/v2\/extendedFields/, subsection: "custom-fields" },

  // ── Bulk customer operations ──
  { pattern: /\/v2\/bulk\/getCustomers/, subsection: "customer-v2" },
  { pattern: /\/v2\/bulk$/, subsection: "customer-v2" },

  // ── Events (v2 direct path) ──
  { pattern: /\/v2\/events/, subsection: "behavioral-events" },

  // ── Private / DAS ──
  { pattern: /\/das\//, subsection: "private-apis" },
  { pattern: /\/x\/neo\//, subsection: "private-apis" },

  // ── DIY Template ──
  { pattern: /\/diy/, subsection: "diy-template" },
  { pattern: /\/workspaces/, subsection: "diy-template" },
  { pattern: /\/diyprocessors/, subsection: "diy-template" },

  // ── Store Locator ──
  { pattern: /\/store-locator/, subsection: "store-locator" },
  { pattern: /\/integration\/v1\//, subsection: "store-locator" },
  { pattern: /\/integration\/v1\/sync/, subsection: "store-locator" },

  // ── Dataflow / Connect+ (catch DIY-related) ──
  { pattern: /\/dataflows\//, subsection: "diy-template" },
  { pattern: /\/debug-mode\//, subsection: "diy-template" },
  { pattern: /\/blocks/, subsection: "diy-template" },

  // ── Other ──
  { pattern: /\/earning$/, subsection: "other-apis" },
  { pattern: /\/feed$/, subsection: "other-apis" },
  { pattern: /\/currencyratio/, subsection: "other-apis" },
  { pattern: /\/meta\/sources/, subsection: "other-apis" },
  { pattern: /\/survey/, subsection: "other-apis" },
  { pattern: /\/fleet/, subsection: "other-apis" },
  { pattern: /\/genericStatus/, subsection: "other-apis" },
  { pattern: /\/verticals/, subsection: "other-apis" },
  { pattern: /\/recommendations\//, subsection: "other-apis" },
  { pattern: /\/slab\//, subsection: "other-apis" },
  { pattern: /\/activitySessions/, subsection: "other-apis" },
];

// Source file priority for deduplication (higher = preferred)
export const SOURCE_PRIORITY: Record<string, number> = {
  "v2.json": 10,
  "v1.json": 10,
  "v3.json": 10,
  "customer-v11.json": 8,
  "organization-1.json": 8,
  "organization-2.json": 8,
  "organization-3.json": 8,
};

export const DEFAULT_SOURCE_PRIORITY = 5;
