# Performance Testing Report

## 1. Executive Summary

Performance testing was conducted using **k6** to evaluate the application's API responsiveness, reliability, and behavior under concurrent user load.

The test ran for **5 minutes**, reaching a maximum of **50 virtual users (VUs)**. The application successfully handled all HTTP requests without failures, and all functional checks passed. However, the measured response times exceeded the defined performance threshold of **1,000 ms at the 95th percentile (P95)** across all tested endpoints.

**Overall Result:** Functional checks passed, but performance optimization is required to meet the response-time targets.

## 2. Test Configuration

| Parameter | Details |
|---|---|
| Performance Testing Tool | k6 |
| Test Duration | 5 minutes |
| Maximum Virtual Users | 50 |
| Total Iterations | 1,454 |
| Total HTTP Requests | 4,362 |
| Throughput | 14.51 requests/second |
| HTTP Failure Rate | 0% |
| Functional Check Pass Rate | 100% |
| Target P95 Response Time | Less than 1,000 ms |

## 3. Endpoint Performance Results

| Endpoint | Average Response Time | P95 Response Time | Target P95 | Result |
|---|---:|---:|---:|---|
| POST `/users` | 1,166 ms | 3,543 ms | < 1,000 ms | FAIL |
| GET `/users` | 993 ms | 2,927 ms | < 1,000 ms | FAIL |
| GET `/users/:id` | 758 ms | 3,043 ms | < 1,000 ms | FAIL |

**Key observation:** POST `/users` recorded the highest P95 response time at approximately 3.54 seconds. GET `/users/:id` also showed significant response-time variation despite having the lowest average response time.

## 4. Functional and Reliability Results

The application successfully completed all tested API operations.

| Validation | Result |
|---|---|
| User creation (POST `/users`) | PASS |
| User ID returned after creation | PASS |
| Retrieve user by ID (GET `/users/:id`) | PASS |
| Retrieve users (GET `/users`) | PASS |
| HTTP request failures | 0% |
| Overall functional checks | 100% PASS |

These results indicate that the application maintained functional correctness throughout the test execution.

## 5. Performance Findings

The following observations were identified:

1. **High response times:** All three endpoints exceeded the target P95 response time of 1,000 ms.
2. **User creation bottleneck:** POST `/users` recorded the highest P95 response time, suggesting potential delays during validation, database operations, or record insertion.
3. **Collection retrieval:** GET `/users` may experience performance degradation as the number of database records increases, particularly if pagination is not implemented.
4. **Response-time variation:** The difference between average and P95 response times indicates that some requests take significantly longer than typical requests.
5. **Request reliability:** No HTTP request failures were observed, demonstrating stable request handling during this test.

## 6. Final Assessment

The application demonstrated good functional reliability under the tested load of up to 50 concurrent virtual users. All functional checks passed, and the HTTP failure rate remained at 0%.

However, the application did not meet the defined performance requirement of a P95 response time below 1,000 ms. All tested endpoints recorded P95 response times between approximately 2.93 and 3.54 seconds.

**Final Status: PERFORMANCE OPTIMIZATION REQUIRED**

---

**Test Tool:** k6  
**Test Type:** API Load Testing  
**Maximum Concurrent Users:** 50  
**Test Duration:** 5 Minutes  
**Overall Functional Result:** PASS  
**Overall Performance Result:** FAIL