# Super Chat Web App

A web application that integrates multiple language models (ChatGPT, Claude, Gemini, and Grok) under a single chat interface.

## Features

- Support for multiple LLMs including ChatGPT, Claude, Gemini, and Grok
- Dark/light mode toggle
- Collapsible sidebar with hover functionality
- API key management for paid models
- Free access to Gemini and Grok models
- Responsive design

## UI Improvements

- Replaced the "Send" button with an up-arrow icon inside the text input area
- Added collapsible sidebar with hover functionality
- Moved the Settings icon to the bottom-right of the sidebar
- Added specific error handling for Gemini API errors

## Deployment Instructions

### Local Testing

1. Clone this repository
2. Open `index.html` in your browser
3. Start chatting with the available models

### GitHub Pages Deployment

1. Create a new GitHub repository
2. Upload all files from this project to the repository
3. Go to repository Settings > Pages
4. Under "Source", select "main" branch
5. Click "Save"
6. Your site will be published at `https://[your-username].github.io/[repository-name]/`

### Backend Configuration

The app is configured to use a backend API at:
```
https://3000-i5et6moeaj341skksxe7o-852cae94.manus.computer/api
```

If you're deploying your own version, you may need to update the `API_BASE_URL` in the JavaScript code to point to your own backend service.

## API Keys

For ChatGPT and Claude, you'll need to provide your own API keys through the settings panel. Gemini and Grok are available for free use.

## Browser Compatibility

This application works best in modern browsers such as:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available for personal and commercial use. Developed by [Manus](https://manus.computer).
