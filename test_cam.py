import socket
import time

ESP32_IP = "192.168.178.53" # Replace with your IP
PORT = 80
FILENAME = "captured_image.jpg"

def capture_image():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.settimeout(15) # Long timeout for the initial capture
    
    try:
        print(f"Connecting to {ESP32_IP}...")
        client_socket.connect((ESP32_IP, PORT))
        
        # Give the ESP32 a moment to snap the photo and start sending
        time.sleep(0.5) 
        
        image_data = bytearray()
        print("Receiving data...")
        
        while True:
            # We use a 4KB buffer for each chunk
            chunk = client_socket.recv(4096)
            if not chunk:
                break
            image_data.extend(chunk)
            
        if len(image_data) > 0:
            with open(FILENAME, "wb") as f:
                f.write(image_data)
            print(f"Success! Saved {len(image_data)} bytes to {FILENAME}")
            
            # Basic JPEG check: JPEGs start with 0xFF 0xD8 and end with 0xFF 0xD9
            if image_data.startswith(b'\xff\xd8'):
                print("Confirmed: Data starts with JPEG header.")
            else:
                print("Warning: Data received does not look like a JPEG.")
        else:
            print("Received 0 bytes. The ESP32 closed the connection too early.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client_socket.close()

if __name__ == "__main__":
    t = time.time()
    for _ in range(10):
        capture_image()
    dt = time.time() - t
    print(f"took {dt/10}s to proces")