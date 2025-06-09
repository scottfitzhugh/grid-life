#!/usr/bin/env python3
"""
Simple HTTP server for Grid Life application
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Change to the src directory to serve files
os.chdir('src')

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
	def end_headers(self):
		self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
		self.send_header('Pragma', 'no-cache')
		self.send_header('Expires', '0')
		super().end_headers()

	def guess_type(self, path):
		mimetype = super().guess_type(path)
		if path.endswith('.js'):
			return 'application/javascript'
		return mimetype

if __name__ == "__main__":
	with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
		print(f"Grid Life server running at http://localhost:{PORT}")
		print("Press Ctrl+C to stop the server")
		try:
			httpd.serve_forever()
		except KeyboardInterrupt:
			print("\nServer stopped")
			sys.exit(0) 