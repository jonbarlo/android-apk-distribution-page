# APK Distribution Site - Makefile
# Run 'make help' to see available commands

.PHONY: help deploy-mochahost install clean

# Default target - show help
help:
	@echo "Available commands:"
	@echo "  make deploy-mochahost  - Deploy site to MochaHost via FTP"
	@echo "  make install          - Install Node.js dependencies"
	@echo "  make clean            - Clean node_modules"
	@echo "  make help             - Show this help message"

# Deploy to MochaHost using FTP script
deploy-mochahost:
	@echo "🚀 Deploying to MochaHost..."
	node ftp-upload.js

# Install Node.js dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Clean node_modules
clean:
	@echo "🧹 Cleaning node_modules..."
	rmdir /s /q node_modules 2>nul || rm -rf node_modules 2>/dev/null || true 