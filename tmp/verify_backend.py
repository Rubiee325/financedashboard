import requests
import sys

BASE_URL = "http://localhost:5000/api"

endpoints = [
    "/orders",
    "/dashboard",
    "/analytics/stats",
    "/health"
]

print(f"Testing backend at {BASE_URL}...")

all_passed = True

for endpoint in endpoints:
    url = f"{BASE_URL}{endpoint if endpoint != '/health' else '/../health'}"
    try:
        response = requests.get(url, timeout=5)
        print(f"[{response.status_code}] GET {url}")
        if response.status_code != 200:
            all_passed = False
            print(f"  ERROR: Unexpected status code {response.status_code}")
            print(f"  RESPONSE: {response.text[:200]}")
    except Exception as e:
        all_passed = False
        print(f"  ERROR: Could not connect to {url}")
        print(f"  DETAILS: {e}")

if all_passed:
    print("\n✅ All backend health checks passed!")
else:
    print("\n❌ Some backend health checks failed. Is the server running?")
    sys.exit(1)
