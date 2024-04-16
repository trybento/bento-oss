import dotenv from 'dotenv';

// Load any necessary environment variables from a file.
// This is only really useful for development.
dotenv.config({
  path: `./env/${process.env.NODE_ENV || 'development'}.env`,
});

// Set up DB
import 'src/data';

// load feature flags into db
import 'src/utils/features';

// load up yup extensions
import 'src/utils/yup';
