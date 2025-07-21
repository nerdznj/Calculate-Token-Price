import { Connection, PublicKey } from "@solana/web3.js";
import fetch from "node-fetch";
import { Liquidity, LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";
import { getMint } from "@solana/spl-token";
import fs from "fs/promises";

// Public RPC endpoints for redundancy
const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
];

let connection;
let currentRpcIndex = 0;

function initializeConnection() {
  connection = new Connection(RPC_ENDPOINTS[currentRpcIndex], {
    commitment: 'confirmed',
    httpHeaders: {
      'Content-Type': 'application/json',
    }
  });
  console.log(`Connected to RPC: ${RPC_ENDPOINTS[currentRpcIndex]}`);
}

function switchToNextRPC() {
  currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
  initializeConnection();
  console.log(`Switched to RPC: ${RPC_ENDPOINTS[currentRpcIndex]}`);
}

// USDC mint address for price calculations
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Token name mappings for better display
const TOKEN_NAMES = {
  "So11111111111111111111111111111111111111112": "SOL",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs": "WETH",
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "stSOL",
  "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1": "bSOL",
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn": "jitoSOL",
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "BONK",
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm": "WIF",
  "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4": "BOME",
  "CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo": "POPCAT",
  "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ": "W",
  "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4": "JLP",
  "A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM": "USDCet",
  "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux": "HNT",
  "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof": "RENDER",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
  "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5": "MEW",
  "Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump": "CHILLGUY"
};

// Popular Solana tokens to analyze
const TOKENS = [
  { mint: "So11111111111111111111111111111111111111112", poolAddress: "" }, // SOL
  { mint: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", poolAddress: "" }, // WETH
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", poolAddress: "" }, // USDT
  { mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", poolAddress: "" }, // mSOL
  { mint: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", poolAddress: "" }, // stSOL
  { mint: "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1", poolAddress: "" }, // bSOL
  { mint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", poolAddress: "" }, // jitoSOL
  { mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", poolAddress: "" }, // BONK
  { mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", poolAddress: "" }, // WIF
  { mint: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4", poolAddress: "" }, // BOME
  { mint: "CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo", poolAddress: "" }, // POPCAT
  { mint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", poolAddress: "" }, // W
  { mint: "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4", poolAddress: "" }, // JLP
  { mint: "A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM", poolAddress: "" }, // USDCet
  { mint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", poolAddress: "" }, // HNT
  { mint: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", poolAddress: "" }, // RENDER
  { mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", poolAddress: "" }, // JUP
  { mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", poolAddress: "" }, // MEW
  { mint: "Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump", poolAddress: "" }, // CHILLGUY
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", poolAddress: "" }  // USDC
];

async function getTokenDecimals(mintAddress, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const mint = await getMint(connection, new PublicKey(mintAddress));
      return mint.decimals;
    } catch (err) {
      console.error(`Error fetching decimals for ${mintAddress} (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) {
        if (err.message.includes('429') || err.message.includes('rate')) {
          switchToNextRPC();
        }
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

async function getPoolAddress(tokenA, tokenB, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Searching pool for ${TOKEN_NAMES[tokenA] || tokenA}/${TOKEN_NAMES[tokenB] || tokenB}...`);
      
      const res = await fetch("https://api.raydium.io/v2/main/pairs", {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SolanaBot/1.0)'
        },
        timeout: 10000
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
      }
      
      const pools = await res.json();
      
      if (!Array.isArray(pools)) {
        throw new Error("Invalid API response format");
      }
      
      const pair = pools.find(
        (p) =>
          (p.token_0_mint === tokenA && p.token_1_mint === tokenB) ||
          (p.token_0_mint === tokenB && p.token_1_mint === tokenA)
      );
      
      if (!pair) {
        throw new Error(`No pool found for ${TOKEN_NAMES[tokenA] || tokenA}/${TOKEN_NAMES[tokenB] || tokenB}`);
      }
      
      console.log(`Found pool: ${pair.pool_id}`);
      return {
        poolAddress: pair.pool_id,
        reversed: pair.token_0_mint === tokenB,
      };
    } catch (err) {
      console.error(`Error fetching pool address (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 3000 * (i + 1)));
    }
  }
}

async function getVaultBalance(vaultPubkey, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const accountInfo = await connection.getAccountInfo(vaultPubkey);
      if (!accountInfo) {
        throw new Error(`Vault account not found: ${vaultPubkey.toBase58()}`);
      }
      if (accountInfo.data.length < 72) {
        throw new Error("Vault account data too small");
      }
      return accountInfo.data.readBigUInt64LE(64);
    } catch (err) {
      console.error(`Error fetching vault balance (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) {
        if (err.message.includes('429') || err.message.includes('rate')) {
          switchToNextRPC();
        }
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

async function getPoolBalances(poolAddress, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const accountInfo = await connection.getAccountInfo(new PublicKey(poolAddress));
      if (!accountInfo) {
        throw new Error("Pool account not found");
      }

      const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);
      const vaultA = poolState.baseVault;
      const vaultB = poolState.quoteVault;

      console.log(`Vault A: ${vaultA.toBase58()}`);
      console.log(`Vault B: ${vaultB.toBase58()}`);

      const [balanceA, balanceB] = await Promise.all([
        getVaultBalance(vaultA),
        getVaultBalance(vaultB),
      ]);

      return [balanceA, balanceB];
    } catch (err) {
      console.error(`Error fetching pool balances (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) {
        if (err.message.includes('429') || err.message.includes('rate')) {
          switchToNextRPC();
        }
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

async function getJupiterPrice(inputMint, outputMint, amount, inputDecimals, outputDecimals) {
  try {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
    console.log(`Jupiter API URL: ${url}`);
    
    const res = await fetch(url, {
      headers: { 
        "Accept": "application/json",
        'User-Agent': 'Mozilla/5.0 (compatible; SolanaBot/1.0)'
      },
      signal: AbortSignal.timeout(8000),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`Jupiter API response for ${TOKEN_NAMES[inputMint] || inputMint}:`, JSON.stringify(data, null, 2));
    
    if (!data.outAmount) {
      throw new Error("Invalid Jupiter response: No outAmount found");
    }
    
    const price = Number(data.outAmount) / Math.pow(10, outputDecimals) / (amount / Math.pow(10, inputDecimals));
    return price;
  } catch (err) {
    console.error(`Jupiter price fetch error for ${TOKEN_NAMES[inputMint] || inputMint}:`, err.message);
    return null;
  }
}

async function getTokenPrice(tokenMint, poolAddress = null) {
  try {
    console.log(`\nProcessing ${TOKEN_NAMES[tokenMint] || tokenMint}...`);
    
    // USDC has a fixed price of $1
    if (tokenMint === USDC_MINT) {
      return {
        token: TOKEN_NAMES[tokenMint],
        mint: tokenMint,
        poolAddress: "N/A",
        onChainPrice: 1.0,
        jupiterPrice: 1.0,
        timestamp: new Date().toISOString(),
      };
    }

    // Get token and USDC decimals
    const [decimalsToken, decimalsUSDC] = await Promise.all([
      getTokenDecimals(tokenMint),
      getTokenDecimals(USDC_MINT),
    ]);

    console.log(`Token decimals: ${decimalsToken}, USDC decimals: ${decimalsUSDC}`);

    // Find pool address
    let finalPoolAddress = poolAddress;
    let reversed = false;
    if (!poolAddress) {
      const poolInfo = await getPoolAddress(tokenMint, USDC_MINT);
      finalPoolAddress = poolInfo.poolAddress;
      reversed = poolInfo.reversed;
    }

    // Get pool balances
    const [balA, balB] = await getPoolBalances(finalPoolAddress);
    const balanceA = Number(balA) / Math.pow(10, reversed ? decimalsUSDC : decimalsToken);
    const balanceB = Number(balB) / Math.pow(10, reversed ? decimalsToken : decimalsUSDC);

    console.log(`Pool Balances:`);
    console.log(`   ${reversed ? 'USDC' : TOKEN_NAMES[tokenMint] || tokenMint}: ${balanceA.toLocaleString()}`);
    console.log(`   ${reversed ? TOKEN_NAMES[tokenMint] || tokenMint : 'USDC'}: ${balanceB.toLocaleString()}`);

    // Calculate on-chain price
    let onChainPrice = null;
    if (balanceA > 0 && balanceB > 0) {
      if (reversed) {
        onChainPrice = balanceA / balanceB; // USDC / Token
      } else {
        onChainPrice = balanceB / balanceA; // USDC / Token
      }
      console.log(`On-chain Price: 1 ${TOKEN_NAMES[tokenMint] || tokenMint} = $${onChainPrice.toFixed(6)} USDC`);
    } else {
      console.error("Invalid pool balances for price calculation");
    }

    // Get Jupiter price
    const jupiterPrice = await getJupiterPrice(
      tokenMint,
      USDC_MINT,
      Math.pow(10, decimalsToken),
      decimalsToken,
      decimalsUSDC
    );

    if (jupiterPrice) {
      console.log(`Jupiter Price: 1 ${TOKEN_NAMES[tokenMint] || tokenMint} = $${jupiterPrice.toFixed(6)} USDC`);
      
      // Compare prices
      if (onChainPrice && jupiterPrice) {
        const difference = Math.abs(onChainPrice - jupiterPrice);
        const percentDiff = (difference / onChainPrice) * 100;
        console.log(`Price Difference: ${difference.toFixed(6)} USDC (${percentDiff.toFixed(2)}%)`);
      }
    } else {
      console.log("Jupiter price not available.");
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      token: TOKEN_NAMES[tokenMint] || tokenMint,
      mint: tokenMint,
      poolAddress: finalPoolAddress,
      onChainPrice,
      jupiterPrice,
      poolBalances: {
        tokenBalance: reversed ? balanceB : balanceA,
        usdcBalance: reversed ? balanceA : balanceB,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`Error processing ${TOKEN_NAMES[tokenMint] || tokenMint}:`, err.message);
    return {
      token: TOKEN_NAMES[tokenMint] || tokenMint,
      mint: tokenMint,
      poolAddress: poolAddress || "N/A",
      onChainPrice: null,
      jupiterPrice: null,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
}

async function processTokens() {
  console.log("Starting Solana Token Price Calculator...");
  console.log(`Processing ${TOKENS.length} tokens...\n`);
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < TOKENS.length; i++) {
    const { mint, poolAddress } = TOKENS[i];
    
    if (!mint) {
      console.error(`Skipping token ${i + 1}: Token mint address is empty`);
      results.push({
        token: "Unknown",
        mint: "",
        poolAddress: "",
        onChainPrice: null,
        jupiterPrice: null,
        error: "Token mint address is empty",
        timestamp: new Date().toISOString(),
      });
      errorCount++;
      continue;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing Token ${i + 1}/${TOKENS.length}: ${TOKEN_NAMES[mint] || mint}`);
    console.log(`${'='.repeat(60)}`);
    
    const result = await getTokenPrice(mint, poolAddress || null);
    results.push(result);
    
    if (result.error) {
      errorCount++;
    } else {
      successCount++;
    }
    
    console.log(`Completed ${i + 1}/${TOKENS.length} tokens`);
  }

  // Summary report
  console.log(`\n${'='.repeat(60)}`);
  console.log(`SUMMARY REPORT`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Successful: ${successCount}/${TOKENS.length}`);
  console.log(`Failed: ${errorCount}/${TOKENS.length}`);
  console.log(`Success Rate: ${((successCount / TOKENS.length) * 100).toFixed(1)}%`);

  // Save results to JSON files
  try {
    const outputData = {
      summary: {
        totalTokens: TOKENS.length,
        successful: successCount,
        failed: errorCount,
        successRate: `${((successCount / TOKENS.length) * 100).toFixed(1)}%`,
        timestamp: new Date().toISOString(),
      },
      results: results,
    };
    
    await fs.writeFile("token_prices.json", JSON.stringify(outputData, null, 2));
    console.log("Results saved to token_prices.json");
    
    // Save price summary
    const pricesSummary = results
      .filter(r => r.onChainPrice || r.jupiterPrice)
      .map(r => ({
        token: r.token,
        onChainPrice: r.onChainPrice ? `$${r.onChainPrice.toFixed(6)}` : 'N/A',
        jupiterPrice: r.jupiterPrice ? `$${r.jupiterPrice.toFixed(6)}` : 'N/A',
      }));
    
    await fs.writeFile("price_summary.json", JSON.stringify(pricesSummary, null, 2));
    console.log("Price summary saved to price_summary.json");
    
  } catch (err) {
    console.error("Error saving files:", err.message);
  }

  return results;
}

// Main execution
(async () => {
  try {
    // Initialize RPC connection
    initializeConnection();
    
    console.log("Solana Token Price Calculator Started!");
    console.log(`Started at: ${new Date().toLocaleString()}`);
    
    const results = await processTokens();
    
    console.log(`\nAll done! Check the generated files:`);
    console.log(`token_prices.json - Complete results with details`);
    console.log(`price_summary.json - Quick price overview`);
    console.log(`Finished at: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
})();