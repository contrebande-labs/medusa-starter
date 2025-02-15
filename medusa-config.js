const dotenv = require('dotenv')

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: "medusa-file-cloudflare-r2",
    options: {
      public_url: process.env.R2_PUBLIC_URL,
      s3_endpoint: process.env.R2_S3_ENDPOINT,
      bucket: process.env.R2_BUCKET_NAME,
      prefix: process.env.R2_PREFIX,
      access_key_id: process.env.R2_ACCESS_KEY,
      secret_access_key: process.env.R2_SECRET_KEY,
    },
  },
  {
    resolve: "medusa-plugin-ses",
    options: {
      access_key_id: process.env.SES_ACCESS_KEY_ID,
      secret_access_key: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
      from: process.env.EMAIL_FROM,
      order_placed_template: "order_placed"
      //order_return_requested_template: ""
      //swap_shipment_created_template: ""
      //claim_shipment_created_template: ""
      //order_items_returned_template: ""
      //swap_received_template: ""
      //swap_created_template: ""
      //gift_card_created_template: ""
      //gift_card_created_template: ""
      //order_shipped_template: ""
      //order_canceled_template: ""
      //user_password_reset_template: ""
      //medusa_restock_template: ""
      //order_refund_created_template: ""
    }
  }
];

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    database_url: DATABASE_URL,
    database_type: "postgres",
    database_database: "./medusa-db.sql",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    cookie_secret: process.env.COOKIE_SECRET,
    jwt_secret: process.env.JWT_SECRET,
  },
  plugins,
};
