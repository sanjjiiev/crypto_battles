# Cryptographic Services and Benchmarking Platform

## Overview

This platform provides a suite of cryptographic services with RSA and ECC algorithms, allowing users to generate keys, encrypt messages, and sign data while recording benchmarking information for performance analysis. The platform includes API endpoints, a dynamic front-end with visualizations, and a leaderboard for comparing operation times across algorithms.

## Features

- **RSA Key Generation**: Generate a 2048-bit RSA key pair and view a truncated preview of the public/private keys with the time taken.
- **ECC Key Generation**: Generate an ECC key pair using the secp256k1 curve and view performance metrics.
- **Hybrid RSA Encryption**: Encrypt large messages using RSA and AES-256-GCM (hybrid encryption), providing the encrypted message, AES key, and IV.
- **ECC Signing**: Sign messages using ECC and view the generated signature and signing time.
- **Performance Benchmarking**: Log operation times (key generation, encryption, signing) and analyze performance over time.
- **Visualizations**: Use line, bar, and pie charts to view key-size vs. security, average/min/max times, and key-size efficiency.
- **Leaderboard**: Track the fastest algorithms and compare key generation, encryption, and signing times.

## API Routes

### Cryptographic Operations
- **POST /api/crypto/rsa/generate**: Generates an RSA key pair (2048 bits by default). Returns the public and private keys in PEM format (truncated preview) and the time taken.
- **POST /api/crypto/ecc/generate**: Generates an ECC key pair using the secp256k1 curve. Returns the public/private keys in hex format and time taken.
- **POST /api/crypto/rsa/encrypt**: Encrypts a message using hybrid RSA + AES-256-GCM. Returns the encrypted message, AES key (base64), IV, tag, and time taken.
- **POST /api/crypto/ecc/sign**: Signs a message using the ECC private key. Returns the signature and time taken.

### Benchmark Aggregation Endpoints
- **GET /api/battle/compare**: Aggregates and returns the average, min, and max times for each algorithm and operation type.
- **GET /api/battle/leaderboard**: Provides the leaderboard showing the average times for key generation, encryption, and signing for each algorithm.
- **GET /api/battle/stats**: Returns total operations, fastest and slowest times for each operation.

## Data Visualization

- **Line Chart (Key size vs Security)**: Displays static data to show the relationship between key size and security.
- **Bar Charts (avgTime, min/max)**: Shows average, minimum, and maximum operation times based on aggregated JSON data.
- **Pie Chart (Key-size Efficiency)**: Visualizes how different key sizes impact performance.

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or another supported database for storing operation results)

### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repository.git
    cd your-repository
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file and configure the necessary environment variables (e.g., database URL).

4. Start the application:
    ```bash
    npm start
    ```

5. Access the platform at `http://localhost:3000`.

## Contributing

Feel free to submit issues, pull requests, or suggestions for improvement. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
