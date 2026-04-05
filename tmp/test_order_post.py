import requests
import json

BASE_URL = "http://localhost:5000/api/orders"

payload = {
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "1234567890",
    "streetAddress": "123 Test St",
    "city": "Test City",
    "state": "TS",
    "postalCode": "12345",
    "country": "United States",
    "product": "Fiber Internet 300 Mbps",
    "quantity": 2,
    "unitPrice": 150,
    "status": "Pending",
    "createdBy": "Mr. Michael Harris"
}

print(f"POST {BASE_URL}")
try:
    response = requests.post(BASE_URL, json=payload, timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
