# 🚀 Solana Token Price Calculator

محاسبه‌گر قیمت توکن‌های Solana - ابزاری برای محاسبه قیمت 20 توکن محبوب در شبکه Solana

## 📋 ویژگی‌ها

- ✅ محاسبه قیمت 20 توکن محبوب Solana
- 🔗 اتصال به چندین RPC عمومی (بدون نیاز به API key)
- 💰 محاسبه قیمت از دو منبع:
  - **On-Chain**: از طریق پول‌های نقدینگی Raydium
  - **Jupiter API**: از طریق DEX aggregator Jupiter
- 📊 مقایسه قیمت‌ها و محاسبه اختلاف
- 💾 ذخیره نتایج در فایل‌های JSON
- 🔄 سیستم Retry و تغییر خودکار RPC در صورت خرابی
- 📈 گزارش کامل با آمار موفقیت

## 🪙 توکن‌های پشتیبانی شده

1. **SOL** - Solana Native Token
2. **WETH** - Wrapped Ethereum
3. **USDT** - Tether USD
4. **mSOL** - Marinade Staked SOL
5. **stSOL** - Lido Staked SOL
6. **bSOL** - BlazeStake Staked SOL
7. **jitoSOL** - Jito Staked SOL
8. **BONK** - Bonk Inu
9. **WIF** - Dogwifhat
10. **BOME** - Book of Meme
11. **POPCAT** - Popcat
12. **W** - Wormhole Token
13. **JLP** - Jupiter LP Token
14. **USDCet** - USDC (Ethereum)
15. **HNT** - Helium Network Token
16. **RENDER** - Render Network
17. **JUP** - Jupiter Token
18. **MEW** - Cat in a dogs world
19. **CHILLGUY** - Chill Guy
20. **USDC** - USD Coin (برای مرجع قیمت)

## 🛠 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+ 
- npm یا yarn

### نصب Dependencies

```bash
# نصب پکیج‌ها
npm install

# یا با yarn
yarn install
```

### اجرای برنامه

```bash
# اجرای برنامه
npm start

# یا برای development
npm run dev
```

## 📁 فایل‌های خروجی

پس از اجرا، دو فایل JSON ایجاد می‌شود:

### 1. `token_prices.json`
فایل کامل با جزئیات کامل هر توکن:
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

### 2. `price_summary.json`
خلاصه قیمت‌ها برای مشاهده سریع:
```json
[
  {
    "token": "SOL",
    "onChainPrice": "$102.450000",
    "jupiterPrice": "$102.520000"
  },
  {
    "token": "BONK",
    "onChainPrice": "$0.000025",
    "jupiterPrice": "$0.000024"
  }
]
```

## 🔧 تنظیمات

### تغییر RPC Endpoints
می‌توانید لیست RPC endpoints را در فایل اصلی تغییر دهید:

```javascript
const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com", 
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
];
```

### اضافه کردن توکن جدید
برای اضافه کردن توکن جدید، آن را به آرایه `TOKENS` اضافه کنید:

```javascript
const TOKENS = [
  // ... توکن‌های موجود
  { mint: "YOUR_TOKEN_MINT_ADDRESS", poolAddress: "" }
];
```

## 🚨 مدیریت خطا

برنامه شامل سیستم‌های مدیریت خطای پیشرفته است:

- **Retry Logic**: 3 بار تلاش مجدد برای هر عملیات
- **RPC Switching**: تغییر خودکار RPC در صورت خرابی
- **Rate Limiting**: تاخیر 1.5 ثانیه بین درخواست‌ها
- **Timeout Handling**: مهلت زمانی برای درخواست‌های API

## 📊 نمونه خروجی

```
🎯 Starting Solana Token Price Calculator...
📋 Processing 20 tokens...

============================================================
🔢 Processing Token 1/20: SOL
============================================================

🚀 Processing SOL...
📊 Token decimals: 9, USDC decimals: 6
🔍 Searching pool for SOL/USDC...
✅ Found pool: 58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2
🏦 Vault A: 7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5
🏦 Vault B: 5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1
💰 Pool Balances:
   SOL: 1,234,567.89
   USDC: 126,543,210.12
💎 On-chain Price: 1 SOL = $102.450000 USDC
🪐 Jupiter Price: 1 SOL = $102.520000 USDC
📈 Price Difference: 0.070000 USDC (0.07%)
✅ Completed 1/20 tokens

============================================================
📊 SUMMARY REPORT
============================================================
✅ Successful: 18/20
❌ Failed: 2/20
🎯 Success Rate: 90.0%
💾 Results saved to token_prices.json
📋 Price summary saved to price_summary.json

🎉 All done! Check the generated files:
📄 token_prices.json - Complete results with details
📄 price_summary.json - Quick price overview
```

## 🔗 منابع مفید

- [Solana Documentation](https://docs.solana.com/)
- [Raydium SDK](https://github.com/raydium-io/raydium-sdk)
- [Jupiter API](https://docs.jup.ag/)
- [@solana/web3.js](https://github.com/solana-labs/solana-web3.js)

## 📝 یادداشت‌های مهم

- ⚠️ این ابزار فقط برای مقاصد آموزشی و تحلیلی است
- 💡 قیمت‌ها ممکن است با تاخیر نمایش داده شوند
- 🔄 برای استفاده تجاری، از API key های اختصاصی استفاده کنید
- 📊 همیشه قیمت‌ها را از چندین منبع بررسی کنید

## 🤝 مشارکت

برای مشارکت در بهبود این پروژه:
1. Fork کنید
2. Branch جدید ایجاد کنید
3. تغییرات خود را commit کنید
4. Pull Request ارسال کنید

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

---

**⚡ ساخته شده با ❤️ برای جامعه Solana**