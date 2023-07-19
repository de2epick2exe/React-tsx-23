import subprocess
import os
import signal
import time

server_process = None

def start_js_server():
    global server_process
    if server_process is None:
        try:
            # Change the working directory to your server directory where the package.json is located.
            # Use a raw string (prefix 'r') to avoid special characters causing issues.
            os.chdir(r'X:\programming\JS\allin\client\react-redux-tsx\server')

            # Start the JavaScript server using 'npm start'.
            server_process = subprocess.Popen(['npm', 'start'], shell=True)

            print("JavaScript server started.")
        except Exception as e:
            print("Error starting the JavaScript server:", e)

def stop_js_server():
    global server_process
    if server_process is not None:
        try:
            # Send a SIGINT signal to gracefully stop the server.
            server_process.send_signal(signal.CTRL_C_EVENT)

            # Wait for the server process to finish.
            server_process.wait(timeout=10)

            print("JavaScript server stopped.")
        except subprocess.TimeoutExpired:
            # If the server process doesn't stop gracefully, force termination.
            server_process.terminate()
            print("JavaScript server forcefully terminated.")
        except Exception as e:
            print("Error stopping the JavaScript server:", e)
        finally:
            server_process = None

# Test the functions
#start_js_server()
#time.sleep(100)  # Simulating server running for 10 seconds
#stop_js_server()
