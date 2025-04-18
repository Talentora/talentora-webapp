import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const failedRequests = new Counter('failed_requests');
const successfulLogins = new Counter('successful_logins');
const pageLoadTrend = new Trend('page_load_time');
const apiResponseTime = new Trend('api_response_time');
const errorRate = new Rate('error_rate');

// Configuration
const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';
const AUTH_EMAIL = __ENV.AUTH_EMAIL || 'test@example.com';
const AUTH_PASSWORD = __ENV.AUTH_PASSWORD || 'testPassword123';

// Test scenarios
export const options = {
  scenarios: {
    // Smoke test - low load
    smoke: {
      executor: 'constant-vus',
      vus: 5,
      duration: '30s',
      tags: { test_type: 'smoke' },
    },
    // Load test - moderate load
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },  // Ramp up to 50 users
        { duration: '3m', target: 50 },  // Stay at 50 users
        { duration: '1m', target: 0 },   // Ramp down to 0 users
      ],
      tags: { test_type: 'load' },
    },
    // Stress test - high load
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 }, // Ramp up to 100 users
        { duration: '5m', target: 100 }, // Stay at 100 users
        { duration: '2m', target: 200 }, // Ramp up to 200 users
        { duration: '5m', target: 200 }, // Stay at 200 users
        { duration: '2m', target: 0 },   // Ramp down to 0 users
      ],
      tags: { test_type: 'stress' },
    },
    // Spike test - sudden burst
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 500 },  // Quick ramp up to 500 users
        { duration: '1m', target: 500 },   // Stay at 500 users
        { duration: '10s', target: 0 },    // Quick ramp down
      ],
      tags: { test_type: 'spike' },
    },
    // Soak test - long duration
    soak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },    // Ramp up to 50 users
        { duration: '10m', target: 50 },   // Stay at 50 users for 10 minutes
        { duration: '2m', target: 0 },     // Ramp down to 0 users
      ],
      tags: { test_type: 'soak' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests should complete below 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
    'page_load_time': ['p(95)<3000'],  // 95% of page loads should be under 3s
    'api_response_time': ['p(95)<200'], // 95% of API calls should respond within 200ms
    'error_rate': ['rate<0.05'],       // Error rate should be less than 5%
  },
};

// Helper functions
function recordMetrics(res, checkName, isApi = false) {
  const success = check(res, {
    [`${checkName} status is 200`]: (r) => r.status === 200,
  });
  
  if (!success) {
    failedRequests.add(1);
    errorRate.add(1);
    console.log(`Failed ${checkName}: ${res.status} ${res.body}`);
  } else {
    errorRate.add(0);
  }
  
  if (isApi) {
    apiResponseTime.add(res.timings.duration);
  } else {
    pageLoadTrend.add(res.timings.duration);
  }
  
  return success;
}

// Main test function
export default function() {
  // Random user ID for concurrent testing
  const userId = randomIntBetween(1, 10000);
  let authToken = null;
  
  group('Visitor experience', function() {
    const homeRes = http.get(`${BASE_URL}/`);
    recordMetrics(homeRes, 'Homepage load');
    
    sleep(randomIntBetween(1, 3));
    
    const aboutRes = http.get(`${BASE_URL}/about`);
    recordMetrics(aboutRes, 'About page load');
    
    sleep(randomIntBetween(1, 3));
  });
  
  group('Authentication flow', function() {
    // Login request
    const loginData = JSON.stringify({
      email: `${userId}_${AUTH_EMAIL}`,
      password: AUTH_PASSWORD,
    });
    
    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (recordMetrics(loginRes, 'Login attempt', true)) {
      successfulLogins.add(1);
      try {
        const jsonRes = JSON.parse(loginRes.body);
        authToken = jsonRes.token || 'sample-token';
      } catch (e) {
        console.log('Could not parse auth token', e);
        authToken = 'fallback-token';
      }
    }
    
    sleep(randomIntBetween(1, 2));
  });
  
  if (authToken) {
    group('Authenticated user experience', function() {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      };
      
      // Dashboard access
      const dashboardRes = http.get(`${BASE_URL}/dashboard`, { headers });
      recordMetrics(dashboardRes, 'Dashboard load');
      
      sleep(randomIntBetween(2, 5));
      
      // API calls
      const apiRes = http.get(`${BASE_URL}/api/user/profile`, { headers });
      recordMetrics(apiRes, 'Profile API call', true);
      
      sleep(randomIntBetween(1, 3));
      
      // Logout
      const logoutRes = http.post(`${BASE_URL}/api/auth/logout`, {}, { headers });
      recordMetrics(logoutRes, 'Logout attempt', true);
      
      sleep(1);
    });
  }
  
  // Add some randomness to user behavior
  sleep(randomIntBetween(1, 5));
} 