import requests
import json

BASE_URL = "http://localhost:5050/api"

def test_order_validation():
    print("Testing Order Validation (Missing Fields)...")
    payload = {"firstName": "John"}
    response = requests.post(f"{BASE_URL}/orders", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 400
    assert "Please fill the field" in str(response.json())

def test_order_creation():
    print("\nTesting Order Creation...")
    payload = {
        "firstName": "Michael",
        "lastName": "Harris",
        "email": "michael@halleyx.com",
        "phone": "555-0101",
        "streetAddress": "123 Tech Blvd",
        "city": "Palo Alto",
        "state": "CA",
        "postalCode": "94301",
        "country": "United States",
        "product": "Fiber Internet 1 Gbps",
        "quantity": 2,
        "unitPrice": 80,
        "status": "Completed",
        "createdBy": "Mr. Michael Harris"
    }
    response = requests.post(f"{BASE_URL}/orders", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    assert response.status_code == 201
    assert data["totalAmount"] == 160 # 2 * 80

def test_analytics():
    print("\nTesting Analytics...")
    # Seed another order
    requests.post(f"{BASE_URL}/orders", json={
        "firstName": "Olivia",
        "lastName": "Carter",
        "email": "olivia@client.com",
        "phone": "555-0102",
        "streetAddress": "456 Innovation St",
        "city": "Austin",
        "state": "TX",
        "postalCode": "78701",
        "country": "Canada",
        "product": "5G Unlimited Mobile Plan",
        "quantity": 1,
        "unitPrice": 50,
        "status": "In Progress",
        "createdBy": "Ms. Olivia Carter"
    })

    endpoints = [
        "total-orders",
        "total-revenue",
        "total-customers",
        "revenue-by-product",
        "orders-by-status",
        "monthly-revenue"
    ]
    
    for endpoint in endpoints:
        resp = requests.get(f"{BASE_URL}/analytics/{endpoint}")
        print(f"Analytics {endpoint}: {resp.json()}")
        assert resp.status_code == 200

if __name__ == "__main__":
    try:
        test_order_validation()
        test_order_creation()
        test_analytics()
        print("\n✅ All backend tests passed!")
    except Exception as e:
        print(f"\n❌ Tests failed: {str(e)}")
