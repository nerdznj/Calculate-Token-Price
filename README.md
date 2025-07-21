# Solana Token Price Calculator

A comprehensive tool for calculating real-time prices of popular Solana tokens using on-chain data and DEX aggregators.

## Features

- Real-time price calculation for 20 popular Solana tokens
- Multiple RPC endpoint support for reliability
- Dual price sources:
  - **On-Chain**: Direct calculation from Raydium liquidity pools
  - **Jupiter API**: Aggregated pricing from multiple DEXs
- Price comparison and arbitrage opportunity detection
- JSON output for data analysis
- Automatic failover and retry mechanisms
- Comprehensive reporting with success metrics

## Supported Tokens

| Symbol | Name | Type |
|--------|------|------|
| SOL | Solana | Native Token |
| WETH | Wrapped Ethereum | Bridge Token |
| USDT | Tether USD | Stablecoin |
| mSOL | Marinade Staked SOL | Liquid Staking |
| stSOL | Lido Staked SOL | Liquid Staking |
| bSOL | BlazeStake Staked SOL | Liquid Staking |
| jitoSOL | Jito Staked SOL | Liquid Staking |
| BONK | Bonk Inu | Meme Token |
| WIF | Dogwifhat | Meme Token |
| BOME | Book of Meme | Meme Token |
| POPCAT | Popcat | Meme Token |
| W | Wormhole Token | Infrastructure |
| JLP | Jupiter LP Token | LP Token |
| USDCet | USDC (Ethereum) | Bridge Token |
| HNT | Helium Network Token | Infrastructure |
| RENDER | Render Network | Utility Token |
| JUP | Jupiter Token | DEX Token |
| MEW | Cat in a dogs world | Meme Token |
| CHILLGUY | Chill Guy | Meme Token |
| USDC | USD Coin | Stablecoin |

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/Calculate-Token-Price.git
cd Calculate-Token-Price

# Install dependencies
npm install

# Run the calculator
npm start
```

## Usage

The application will automatically:
1. Connect to Solana RPC endpoints
2. Fetch token metadata and pool information
3. Calculate prices from both on-chain data and Jupiter API
4. Generate comprehensive reports
5. Save results to JSON files

### Output Files

**`token_prices.json`** - Complete results with detailed information:
```json
{
  "summary": {
    "totalTokens": 20,
    "successful": 18,
    "failed": 2,
    "successRate": "90.0%",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "results": [
    {
      "token": "SOL",
      "mint": "So11111111111111111111111111111111111111112",
      "poolAddress": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
      "onChainPrice": 102.45,
      "jupiterPrice": 102.52,
      "poolBalances": {
        "tokenBalance": 1234567.89,
        "usdcBalance": 126543210.12
      },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**`price_summary.json`** - Quick price overview:
```json
[
  {
    "token": "SOL",
    "onChainPrice": "$102.450000",
    "jupiterPrice": "$102.520000"
  }
]
```

## Configuration

### RPC Endpoints
The application uses multiple public RPC endpoints for redundancy:

```javascript
const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com", 
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
];
```

### Adding New Tokens
To add new tokens, update the `TOKENS` array in the main file:

```javascript
const TOKENS = [
  { mint: "YOUR_TOKEN_MINT_ADDRESS", poolAddress: "" }
];
```

## Error Handling

The application includes robust error handling:
- **Retry Logic**: 3 attempts for each operation
- **RPC Failover**: Automatic switching between RPC endpoints
- **Rate Limiting**: 1.5-second delays between requests
- **Timeout Management**: Configurable timeouts for API calls

## API Integration

### Raydium API
Used for discovering liquidity pools and fetching pool metadata.

### Jupiter API
Provides aggregated pricing data from multiple DEXs for comparison.

## Development

### Project Structure
```
├── solana_token_price_calculator.js  # Main application
├── package.json                      # Dependencies and scripts
├── README.md                         # Documentation
├── token_prices.json                 # Generated results (after run)
└── price_summary.json               # Generated summary (after run)
```

### Scripts
```bash
npm start     # Run the calculator
npm run dev   # Run with file watching
```

## Technical Details

### Price Calculation Methodology
1. **On-Chain Calculation**: Reads vault balances from Raydium pools and calculates price ratios
2. **Jupiter Aggregation**: Queries Jupiter API for best available rates across multiple DEXs
3. **Comparison**: Analyzes price differences to identify potential arbitrage opportunities

### Data Sources
- **Raydium**: Primary liquidity provider on Solana
- **Jupiter**: Leading DEX aggregator for price discovery
- **Solana RPC**: Direct blockchain data access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational and analytical purposes only. Always verify prices from multiple sources before making trading decisions. The developers are not responsible for any financial losses incurred from using this software.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

Built for the Solana ecosystem with focus on accuracy and reliability.