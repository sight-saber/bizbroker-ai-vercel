/**
 * Airtable Setup Script
 *
 * This script creates the Valuations table structure in Airtable.
 *
 * Prerequisites:
 * 1. Create a new base in Airtable (or use existing)
 * 2. Get your API key from https://airtable.com/account
 * 3. Get your Base ID from the base URL
 * 4. Set environment variables in .env.local
 *
 * Run: npx ts-node scripts/setup-airtable.ts
 */

import Airtable from 'airtable';

// Load environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Error: Missing environment variables');
  console.log('\nPlease set the following in your .env.local file:');
  console.log('AIRTABLE_API_KEY=your_api_key_here');
  console.log('AIRTABLE_BASE_ID=your_base_id_here');
  console.log('\nGet your API key from: https://airtable.com/account');
  console.log('Get your Base ID from the base URL after creating a base');
  process.exit(1);
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function setupValuationsTable() {
  console.log('🚀 Setting up Valuations table...\n');

  try {
    // Test if table exists by trying to read from it
    await base('Valuations').select({ maxRecords: 1 }).firstPage();
    console.log('✅ Valuations table already exists!\n');
  } catch (error) {
    console.log('⚠️  Valuations table does not exist yet.\n');
    console.log('📋 Please create it manually in Airtable with the configuration below.\n');
    console.log('After creating the table, this script will verify the setup.\n');
  }

  console.log('=' .repeat(80));
  console.log('📋 VALUATIONS TABLE CONFIGURATION');
  console.log('=' .repeat(80));
  console.log('\nTable Name: Valuations\n');
  console.log('Fields to create:\n');

  const fields = [
    {
      name: 'Business Name',
      type: 'Single line text',
      description: 'Name of the business being valued',
    },
    {
      name: 'Contact Email',
      type: 'Email',
      description: 'Contact email for follow-up',
    },
    {
      name: 'Annual Revenue',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Annual revenue in Singapore Dollars',
    },
    {
      name: 'Net Profit',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Net profit in Singapore Dollars',
    },
    {
      name: 'EBITDA',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'EBITDA in Singapore Dollars',
    },
    {
      name: 'Industry',
      type: 'Single select',
      options: 'Options: fnb_retail, services, tech_saas, education, manufacturing, ecommerce, healthcare',
      description: 'Industry category',
    },
    {
      name: 'Years in Operation',
      type: 'Number',
      options: 'Precision: 0',
      description: 'Number of years the business has been operating',
    },
    {
      name: 'Asset Value',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Total asset value in Singapore Dollars',
    },
    {
      name: 'Growth Trend',
      type: 'Single select',
      options: 'Options: growing, stable, declining',
      description: 'Business growth trend',
    },
    {
      name: 'Customer Concentration',
      type: 'Long text',
      description: 'Customer concentration risk details',
    },
    {
      name: 'Risk Factors',
      type: 'Long text',
      description: 'Identified risk factors (semicolon separated)',
    },
    {
      name: 'Positive Factors',
      type: 'Long text',
      description: 'Positive value drivers (semicolon separated)',
    },
    {
      name: 'Conservative Valuation',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Conservative valuation estimate (0.85x weighted average)',
    },
    {
      name: 'Fair Market Valuation',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Fair market valuation (weighted average)',
    },
    {
      name: 'Optimistic Valuation',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Optimistic valuation estimate (1.15x weighted average)',
    },
    {
      name: 'Weighted Average',
      type: 'Currency',
      options: 'Precision: 0, Currency: SGD',
      description: 'Weighted average valuation',
    },
    {
      name: 'Recommendations',
      type: 'Long text',
      description: 'Valuation recommendations and insights',
    },
    {
      name: 'Methods Used',
      type: 'Long text',
      description: 'JSON string of methods and their values',
    },
    {
      name: 'Calculated At',
      type: 'Date',
      options: 'Format: ISO 8601',
      description: 'When the valuation was calculated',
    },
    {
      name: 'Created',
      type: 'Created time',
      options: 'Format: ISO 8601',
      description: 'When the record was created (auto)',
    },
  ];

  fields.forEach((field, index) => {
    console.log(`${index + 1}. ${field.name}`);
    console.log(`   Type: ${field.type}`);
    if (field.options) {
      console.log(`   Options: ${field.options}`);
    }
    console.log(`   Description: ${field.description}`);
    console.log('');
  });

  console.log('=' .repeat(80));
  console.log('\n📝 SETUP INSTRUCTIONS:\n');
  console.log('1. Go to your Airtable base: https://airtable.com/' + AIRTABLE_BASE_ID);
  console.log('2. Click "Add or import" → "Create empty table"');
  console.log('3. Name the table: "Valuations"');
  console.log('4. Delete the default fields');
  console.log('5. Add each field listed above with the specified type and options');
  console.log('6. For "Created" field, use the "Created time" field type');
  console.log('\n💡 TIP: You can also use Airtable\'s API or interface to bulk create fields\n');

  // Try to create a test record
  console.log('🧪 Testing table access...\n');
  try {
    const testRecord = {
      'Business Name': 'Test Business (Setup Verification)',
      'Contact Email': 'test@example.com',
      'Annual Revenue': 100000,
      'Net Profit': 15000,
      'EBITDA': 15000,
      'Industry': 'services',
      'Years in Operation': 3,
      'Asset Value': 10000,
      'Growth Trend': 'stable',
      'Risk Factors': 'Test risk factor',
      'Positive Factors': 'Test positive factor',
      'Conservative Valuation': 85000,
      'Fair Market Valuation': 100000,
      'Optimistic Valuation': 115000,
      'Weighted Average': 100000,
      'Recommendations': 'This is a test record created during setup',
      'Methods Used': JSON.stringify([]),
      'Calculated At': new Date().toISOString(),
    };

    const record = await base('Valuations').create(testRecord);
    console.log('✅ Successfully created test record!');
    console.log('   Record ID:', record.id);

    // Clean up test record
    await base('Valuations').destroy(record.id);
    console.log('✅ Test record cleaned up\n');

    console.log('🎉 Valuations table is properly configured and working!\n');
    return true;
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log('❌ Table not found. Please create the "Valuations" table first.\n');
    } else if (error.statusCode === 422) {
      console.log('❌ Field validation error. Please check all fields are created correctly.\n');
      console.log('   Error details:', error.message);
    } else {
      console.log('❌ Error:', error.message);
    }
    console.log('\n💡 After creating the table, run this script again to verify.\n');
    return false;
  }
}

// Run the setup
setupValuationsTable()
  .then((success) => {
    if (success) {
      console.log('✅ Setup complete! Your Valuations table is ready to use.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Setup incomplete. Please follow the instructions above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
