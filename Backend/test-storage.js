#!/usr/bin/env node

/**
 * Simple script to test storage server connectivity
 * Run with: node test-storage.js
 */

const STORAGE_URL = process.env.IMAGE_STORAGE_URL || 'http://localhost:5001';

console.log('🔍 Testing storage server connectivity...');
console.log('Storage URL:', STORAGE_URL);

async function testStorageServer() {
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${STORAGE_URL}/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
    
    // Test if upload endpoint exists
    console.log('\n2. Testing upload endpoint availability...');
    const uploadResponse = await fetch(`${STORAGE_URL}/api/images/upload`, {
      method: 'OPTIONS'
    });
    
    console.log('✅ Upload endpoint is accessible (status:', uploadResponse.status, ')');
    
    console.log('\n🎉 Storage server is running and accessible!');
    console.log('\nNext steps:');
    console.log('1. Try updating a student image in the frontend');
    console.log('2. Check browser console for frontend logs');
    console.log('3. Check backend terminal for detailed logs');
    
  } catch (error) {
    console.error('\n❌ Storage server test failed:');
    console.error('Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure storage server is running:');
    console.log('   cd storage && npm start');
    console.log('2. Check if port 5001 is available');
    console.log('3. Verify storage server is listening on http://localhost:5001');
  }
}

testStorageServer();