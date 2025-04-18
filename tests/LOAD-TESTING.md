# Load Testing Guide

This guide explains how to use the load testing tools to verify your application can handle thousands of concurrent users.

## Prerequisites

1. Install K6:
   ```bash
   # macOS
   brew install k6

   # Windows
   choco install k6

   # Linux
   docker pull grafana/k6
   ```

## Test Types

The test suite includes several test scenarios:

- **Smoke Test**: Light load with 5 concurrent users for 30 seconds
- **Load Test**: Moderate load with up to 50 concurrent users for 5 minutes
- **Stress Test**: Heavy load with up to 200 concurrent users for 16 minutes
- **Spike Test**: Sudden burst of 500 users for 1 minute 20 seconds
- **Soak Test**: Extended duration test with 50 users for 14 minutes

## Running the Tests

### Basic Test (Default Configuration)

```bash
npm run test:load
```

### Specific Test Scenarios

```bash
# Run smoke test
npm run test:load:smoke

# Run stress test
npm run test:load:stress

# Run spike test
npm run test:load:spike

# Run soak test
npm run test:load:soak

# Run against production
npm run test:load:prod
```

### Custom Configuration

You can customize the tests by passing environment variables:

```bash
k6 run tests/load-test.js --env TARGET_URL=https://your-staging-url.com --env AUTH_EMAIL=test@yourdomain.com --env AUTH_PASSWORD=securepassword
```

## Interpreting Results

K6 will output various metrics including:

- **http_req_duration**: Response time distribution
- **http_reqs**: Request rate
- **vus**: Number of virtual users
- **iterations**: Total completed iterations
- **Custom metrics**:
  - failed_requests: Count of all failed requests
  - successful_logins: Count of successful login attempts
  - page_load_time: Trend metric for page load times
  - api_response_time: Trend metric for API response times
  - error_rate: Rate of errors across all requests

### Success Criteria

The test defines the following thresholds:

- 95% of requests complete in under 500ms
- Less than 1% of requests fail
- 95% of page loads complete in under 3 seconds
- 95% of API calls respond within 200ms
- Overall error rate less than 5%

## Visualizing Results

For better visualization, you can use K6 Cloud or export results to a monitoring system:

```bash
# Export results to JSON for further processing
k6 run --out json=results.json tests/load-test.js

# Use with Grafana Cloud (requires an account)
k6 login cloud
k6 run --out cloud tests/load-test.js
```

## Continuous Integration

Add these tests to your CI pipeline to ensure performance doesn't degrade:

```yaml
# Example GitHub Action
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install k6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      - name: Run load test
        run: k6 run tests/load-test.js --env TARGET_URL=${{ secrets.STAGING_URL }}
```

## Best Practices

1. **Start Small**: Begin with smoke tests before running more intensive tests
2. **Test in Staging**: Run full tests in an environment that matches production
3. **Monitor Resources**: Watch server metrics during tests
4. **Gradual Increases**: If tests fail, gradually increase load to find breaking points
5. **Fix Bottlenecks**: Address performance issues before retesting 