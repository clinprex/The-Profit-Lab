// Each lesson: {title:"...", youtube:"YouTube link", notes:"optional text under the video"}
// subtitle is optional and shows under the course title.
const COURSES = [
  {
    number:"01", title:"Noobies", subtitle:"Understanding the Market", tag:"BEGINNER",
    description:"Start here. How the market works, reading candlesticks, trading sessions, using MT5 and protecting your account from day one.",
    lessons:[
      {title:"01 — Fundamental", youtube:""},
      {title:"02 — Candle Sticks", youtube:""},
      {title:"03 — Trade Sessions", youtube:""},
      {title:"04 — Basic MT5", youtube:""},
      {title:"05 — Risk Management For Starters", youtube:""},
      {title:"06 — Goals & Trade Limitations", youtube:""}
    ]
  },
  {
    number:"02", title:"MSNR", subtitle:"Strategy & Concept", tag:"INTERMEDIATE",
    description:"Malaysian Support & Resistance — classic V and A levels, SBR/RBS flips, QM/QML, OCL and Fibonacci retracement.",
    lessons:[
      {title:"01 — Introduction", youtube:""},
      {title:"02 — Support", youtube:""},
      {title:"03 — Resistance", youtube:""},
      {title:"04 — Classic V", youtube:""},
      {title:"05 — Classic A", youtube:""},
      {title:"06 — SBR", youtube:""},
      {title:"07 — RBS", youtube:""},
      {title:"08 — QM & QML", youtube:""},
      {title:"09 — OCL", youtube:""},
      {title:"10 — Fibo Retracement", youtube:""}
    ]
  },
  {
    number:"03", title:"Basic ICT", subtitle:"Model 2022", tag:"ADVANCED",
    description:"The ICT 2022 model step by step — HTF bias, killzones, MSS, fair value gaps, Silver Bullet, OTE and the Unicorn model.",
    lessons:[
      {title:"01 — Higher-Timeframe (HTF) Bias", youtube:""},
      {title:"02 — Killzone", youtube:""},
      {title:"03 — Displacement & Market Structure Shift (MSS)", youtube:""},
      {title:"04 — Fair Value Gap (FVG)", youtube:""},
      {title:"05 — ICT Silver Bullet", youtube:""},
      {title:"06 — Liquidity Raids (Turtle Soup)", youtube:""},
      {title:"07 — OTE / Premium-Discount Price", youtube:""},
      {title:"08 — Judas Setup", youtube:""},
      {title:"09 — SMT Divergence (Smart-Money-Technique)", youtube:""},
      {title:"10 — Unicorn Model", youtube:""}
    ]
  },
  {
    number:"04", title:"OrderFlow", subtitle:"Volume, Footprints & Heatmaps", tag:"EXPERT",
    description:"Read what's behind the candles — volume profile, footprints, heatmaps, absorption, delta traps, icebergs and exhaustion.",
    lessons:[
      {title:"01 — Fixed Range Volume Profile", youtube:""},
      {title:"02 — Session Range Volume Profile", youtube:""},
      {title:"03 — Timings", youtube:""},
      {title:"04 — Data Footprints", youtube:""},
      {title:"05 — Heatmaps", youtube:""},
      {title:"06 — Absorption & Reversal", youtube:""},
      {title:"07 — Imbalance Breakout", youtube:""},
      {title:"08 — Delta Trap", youtube:""},
      {title:"09 — IceBerg", youtube:""},
      {title:"10 — Exhaustion Fade", youtube:""}
    ]
  }
];

// Resources: set soon:true to show "Coming soon" (link disabled). Remove it once the file is uploaded.
// type can be "PDF", "VIDEO" or "FILE" — each gets its own filter chip.
const RESOURCES = [
  {type:"PDF",title:"The Profit Lab — Trading Journal",description:"Log every trade, review your week and spot your patterns.",href:"files/trading-journal.pdf",soon:true},
  {type:"PDF",title:"ICT / Market Structure Guide",description:"Liquidity, BOS/CHOCH, FVGs and POIs on one printable reference.",href:"files/ict-guide.pdf",soon:true},
  {type:"FILE",title:"TradingView Templates",description:"Chart layouts and indicator settings used in the lessons.",href:"files/",soon:true},
];
