# Chat App

## Project Overview

The **Chat App** project is a mobile chat application built with React Native. This app allows users to engage in conversations, share images, and share their location data. The application leverages the Expo framework and Google Firestore Database to store chat messages, ensuring functionality both online and offline.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [User Stories](#user-stories)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Firebase Configuration](#firebase-configuration)
- [App Integration](#app-integration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Users can anonymously authenticate and start chatting.
- **Chat Interface**: A simple interface where users can send text messages.
- **Image Sharing**: Users can send images from their gallery or take new photos using the device's camera.
- **Location Sharing**: Share current location data with friends in a map view.
- **Customizable Chat Screen**: Users can set their name and choose a background color for their chat screen.
- **Offline Functionality**: Access and read previous messages even when offline.
- **Accessibility**: The app is designed to be screen reader compatible.

## User Stories

- **As a user**, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
- **As a user**, I want to be able to send messages to my friends and family members to exchange the latest news.
- **As a user**, I want to send images to my friends to show them what I’m currently doing.
- **As a user**, I want to share my location with my friends to show them where I am.
- **As a user**, I want to be able to read my messages offline so I can reread conversations at any time.
- **As a user with a visual impairment**, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.x.x)
- Expo CLI: `npm install -g expo-cli`
- Watchman (recommended for macOS users)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

### Node.js Version

Downgrade Node.js to version "16.19.0":

```bash
nvm install 16.19.0
nvm use 16.19.0
```

1. **Clone the repository:**

    ```sh
    git clone https://github.com/jdeebs/chat-app.git
    ```

2. **Navigate to the project directory:**

    ```sh
    cd chat-app
    ```

3. **Install dependencies:**

    ```sh
    npm install
    ```

4. **Start the application locally:**

    ```sh
    npm start
    ```

## Firebase Configuration

Firebase Configuration: Sign in to Google Firebase.

1. Create a new Firebase project.
2. Set up Firestore Database in production mode.
3. Adjust Firestore Rules to allow read and write access.
4. Configure Firebase Storage (optional).

## App Integration

1. Register your app in the Firebase Console.
2. **Install Firebase SDK:**

    ```bash
    npm install firebase
    ```

3. Initialize Firebase in your `App.js` file.

### Prerequisites

1. Download the Expo Go app on your mobile device.
2. Open the app.
    - Connect your device to the same network as your development machine.
    - Run `npx expo start` on your development machine.
    - Alternatively, you can scan the QR code with the Expo Go app.

## Usage

1. Enter your name and select a background color to start chatting.
2. Send text messages, share images, or share your current location.
3. Access and view messages offline, ensuring your chat history is always available.

## Deployment

The Chat App is still under development.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the code style and include tests for new features.

## License

This project is licensed under the MIT License.
