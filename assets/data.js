const COURSES = [
  {
    number:"01", title:"Basic Trading", tag:"FOUNDATION",
    description:"Understand market structure, the logic behind directional movement.",
    lessons:[
      {title:"01 — What is Market Structure?", youtube:""},
      {title:"02 — Swing Highs & Swing Lows", youtube:""},
      {title:"03 — BOS & CHOCH", youtube:""}
    ]
  },
  {
    number:"02", title:"Support & Resistance", tag:"PRICE ACTION",
    description:"Build clean levels, understand reactions and study how support and resistance behave.",
    lessons:[
      {title:"01 — Finding Clean Levels", youtube:""},
      {title:"02 — RBS & SBR", youtube:""},
      {title:"03 — Confirmation & Entries", youtube:""}
    ]
  },
  {
    number:"03", title:"ICT Concepts", tag:"ADVANCED",
    description:"A structured home for liquidity, POI, imbalance and institutional-style market concepts.",
    lessons:[
      {title:"01 — Liquidity", youtube:""},
      {title:"02 — Fair Value Gaps", youtube:""},
      {title:"03 — Points of Interest", youtube:""}
    ]
  },
  {
    number:"04", title:"Gold / XAUUSD", tag:"MARKET",
    description:"Study the behavior, sessions and setups used when analyzing gold.",
    lessons:[
      {title:"01 — XAUUSD Basics", youtube:""},
      {title:"02 — Session Mapping", youtube:""},
      {title:"03 — Trade Planning", youtube:""}
    ]
  },
  {
    number:"05", title:"Risk Management", tag:"ESSENTIAL",
    description:"Position sizing, risk-to-reward, drawdown control and disciplined execution.",
    lessons:[
      {title:"01 — Risk Per Trade", youtube:""},
      {title:"02 — R:R & Position Size", youtube:""},
      {title:"03 — Daily Loss Rules", youtube:""}
    ]
  },
  {
    number:"06", title:"Trading Psychology", tag:"MINDSET",
    description:"Build a repeatable process and learn to separate your plan from your emotions.",
    lessons:[
      {title:"01 — Process Over Outcome", youtube:""},
      {title:"02 — Revenge Trading", youtube:""},
      {title:"03 — Building Consistency", youtube:""}
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
