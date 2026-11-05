/* Without Any Action — data. Marks: [S] read at the page image, [O] only in a text layer, [L] later literature,
   [K] catalogue entry only; everything unmarked is a game value. */
(function (root) {
  "use strict";
  const T = "Military commission, CM 334178, NARA RG 153";   // transcript, vols. I–XVIII (NAID 6121078–6121095)
  const WA = {};

  WA.DAY0 = [1942, 5, 14];   // 14 June 1942 (month 0-based), day 0 of scenario II
  WA.MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

  WA.MEN = {
    dasch: { name: "George John Dasch", group: "ny" }, burger: { name: "Ernst Peter Burger", group: "ny" },
    heinck: { name: "Heinrich Heinck", group: "ny" }, quirin: { name: "Richard Quirin", group: "ny" },
    kerling: { name: "Edward Kerling", group: "fl" }, thiel: { name: "Werner Thiel", group: "fl" },
    haupt: { name: "Herbert Haupt", group: "fl" }, neubauer: { name: "Hermann Neubauer", group: "fl" }
  };

  /* ---------------------------------------------------------------- I A: Amagansett, 12/13 June 1942 */
  WA.AMA_INTRO = { t1: "Amagansett Coast Guard station, Long Island, a little before midnight on 12 June 1942. Fog; 'very dark'; low tide. Seaman Second Class John C. Cullen is due out at 00:10 on the patrol east. The order of 11 April says two men to a watch, both ways from the station.",
    src: `${T}, vol. I, pp. 101, 109 (Cullen) [S]; vol. II, exhibit P-13-A (order of 11 April 1942) [S]` };
  WA.AMA = [
    { at: 25, k: "beach", t1: "Not quite half a mile from the station Cullen meets men at the water's edge. One says they are fishermen who have run aground; he offers about a hundred dollars, then about three hundred. Cullen takes the money – he counts $260 later – and goes back.",
      src: `${T}, vol. I, pp. 101–111 (Cullen) [S]; Eastern Sea Frontier, War Diary, June 1942, NAID 78184481, image 539 [S]` },
    { at: 65, k: "file", t1: "01:05: the chief boatswain's mate in charge, Warren Barnes, is called at his house; at 01:12 he is at the station, at 01:15 on the beach. The duty man, Jenette, has gone down with three men and rifles.",
      src: `${T}, vol. I, pp. 121–127 (Barnes) [S]` },
    { at: 115, k: "file", t1: "01:55: the report reaches the District Intelligence Officer of the Third Naval District; about 02:00 the Eastern Sea Frontier. Eight Coast Guardsmen are on the beach – the report upstairs says 'at least 100'. An Army lieutenant comes with twenty men.",
      src: "Eastern Sea Frontier, War Diary, June 1942, NAID 78184481, images 539–543 [S]" },
    { at: 150, k: "file", t1: "After 02:30 the FBI in New York is reached; it already has the story – from the Army.",
      src: "Eastern Sea Frontier, War Diary, June 1942, NAID 78184481, image 544 [S]" },
    { at: 255, k: "beach", t1: "About 04:15: engines heard to the south, offshore. A smell of diesel.",
      src: "Eastern Sea Frontier, War Diary, June 1942, NAID 78184481 [S]" },
    { at: 330, k: "beach", t1: "First light: four wooden boxes, six inches under the sand, wrapped in paper and canvas, tin cans inside; 150 feet to the north-east a bag of clothes and two shovels. On top: a raincoat, bathing trunks, a sneaker, cigarettes.",
      src: `${T}, vol. I, pp. 127–130 (Barnes) [S]` }
  ];
  WA.AMA_AFTER = [
    { k: "file", t1: "11:00, 13 June: a conference in New York; the FBI takes the lead. By about 22:00 its agents have Amagansett. The four men have long since taken a train to New York.",
      src: "Eastern Sea Frontier, War Diary, June 1942, NAID 78184481 [S]; the train: Dobbs 2004 [L]" }
  ];

  /* ---------------------------------------------------------------- I B: Ponte Vedra, 16/17 June 1942 */
  WA.PV_INTRO = { t1: "Section Base Mayport, mouth of the St. Johns River, evening of 16 June 1942. Two patrol boats, YP-31 and YP-32, the guard ship HP-7 at the river mouth, a minesweeper. The usual patrol runs north, between St. Johns Lightship and Fernandina. On the beach road south of the river the Army's 104th Infantry runs a motor patrol 'along the inhabited area of the beach road'.",
    src: "Section Base Mayport-Jacksonville, War Diary, June 1942, NAID 133928462, image 124 [S]; " + T + ", vol. IV, p. 529 (Lt. Col. Potter; order of 3 June 1942, P-96) [S]" };
  // the schematic coast, north to south (positions drawn for play)
  WA.ZONES = [
    { id: "north", name: "Fernandina – St. Johns Lightship", note: "the usual night patrol" },
    { id: "light", name: "Two miles round the lightship", note: "the river mouth" },
    { id: "beaches", name: "Lightship – Ponte Vedra", note: "off Atlantic and Jacksonville Beach" },
    { id: "south", name: "South of Ponte Vedra", note: "empty dunes, the road on the beach ridge" },
    { id: "port", name: "In port", note: "crew rest, repairs" }
  ];
  WA.PV_RECORD = [
    { k: "file", t1: "16 June, 21:05: YP-31 stands out 'to patrol area North of St. Johns Light Ship'. YP-32 lies in port; HP-7 is guard ship at the mouth.",
      src: "Section Base Mayport, War Diary, 16 June 1942, NAID 133928462, image 124 [S]" },
    { k: "file", t1: "17 June, 00:00–07:00: YP-31 'Patrolling area South from St. Mary's Sea Buoy to St. Johns Lightship' – north of the river. No boat is south of the mouth all night.",
      src: "Section Base Mayport, War Diary, 17 June 1942, NAID 133928462, image 125 [S]" },
    { k: "file", t1: "U-584, war diary, 17 June, 08:00 German time (about 02:00 on the beach): 'S.-Unternehmung gemäss Befehl durchgeführt. Starke Luftüberwachung.' – special operation carried out as ordered; strong air patrols.",
      src: "U-584, Kriegstagebuch, NARA T1022, roll 3392, image 650 [S]" },
    { k: "beach", t1: "The four walk north along the beach, 'passing some houses'; at daybreak, near Jacksonville Beach, they rest behind 'a concrete wall' – a sea wall. By bus they reach Jacksonville about noon.",
      src: `${T}, vol. X, p. 1800 (Thiel's statement) [S]; QS-B (bus, hotels) [O]` }
  ];

  /* ---------------------------------------------------------------- II: The Call, 14–27 June */
  WA.CALL_EVENTS = [
    { t: 0, k: "file", t1: "Sunday, 14 June, 19:51, FBI New York: 'FRANK DANIEL POSTORIUS called this office by telephone.' He has come from Germany 'two days ago'; on Thursday or Friday he will go to Washington to see 'Mr. HOOVER or his secretary'. He will not say where he is staying and refuses to come to the office; he asks that his call be recorded and Washington told.",
      src: `${T}, vol. XVI, p. 2583 (Def. Exh. G, memo of Special Agent McWhorter) [S]` },
    { t: 1, k: "file", t1: "15 June: Assistant Director E. J. Connelley takes charge of the case in New York. The Bureau has no name for any of the men.",
      src: `${T}, vol. XVI, p. 2588 (Connelley) [O]` },
    { t: 3, k: "press", t1: "In Florida a newspaper asks whether the FBI has arrested four Germans landed on the coast. The FBI says nothing.",
      src: "FBI Vault, George Dasch, part 1, p. 4 [O]; Evening Star, 9 Aug. 1942, p. A-4: 'after 10 days of rumors' [S]" },
    { t: 5, k: "file", t1: "Friday, 19 June, about 10:00: from the Mayflower Hotel in Washington a man calls FBI headquarters as 'George Davis', 'leader of a group of eight men'. At 10:30 an agent fetches him. Before that he had tried to reach a Colonel Cramer of the Provost Marshal General's office – without success.",
      src: `${T}, vol. V, pp. 695–696 (Traynor) [O]; stipulation, vol. IV, p. 476 [S]` },
    { t: 5, k: "file", t1: "Headquarters had not been told of the call from New York. 'I had received no such notification.'",
      src: `${T}, vol. XI, p. 1854 (Traynor, FBI headquarters, cross-examination) [S]` },
    { t: 6, k: "file", t1: "20 June, 17:00–17:30, New York: Quirin, Heinck and Burger arrested, after Burger met the other two at Rogers Peet on Fifth Avenue.",
      src: `FBI Vault, George Dasch, part 1, p. 10 [S]; ${T}, vol. IV, p. 476 [S]` },
    { t: 8, k: "file", t1: "22 June: the handkerchief Dasch handed over is developed with ammonia. In secret ink: an address in Lisbon, a pastor in New Jersey, Walter Froehling in Chicago, and 'Helmut Leiner, who he stated was a friend of Kerling's, with whom he could always contact and locate Kerling'.",
      src: `${T}, vol. V, pp. 694–695, 739, 741 (Traynor) [S]` },
    { t: 9, k: "file", t1: "23 June, about 22:00: Edward Kerling is arrested in front of the Shelton Hotel on Lexington Avenue, on his way – he said – to meet his wife. Between 23:30 and 23:50 Werner Thiel, outside the Commodore on 42nd Street.",
      src: `${T}, vol. IX, p. 1509 (Fisher) [S]; vol. X, p. 1758 (Foster) [S]; Kerling's statement, vol. IX, p. 1562 [O]` },
    { t: 10, k: "file", t1: "24 June, 20:00: Dasch, held since the 19th in 'protective custody', is formally arrested.",
      src: `${T}, vol. IV, p. 476 (stipulation) [S]` },
    { t: 11, k: "beach", t1: "25 June: FBI agents with Kerling, off the Silver Meteor at 08:30, drive south from Ponte Vedra 'about 4 miles' on Route 140 and search on foot. By a barbed-wire fence, a concrete foundation and three palm stumps, about 100 yards from the water, they dig up four boxes. Thirty feet to the north: two shovels and four German naval caps. Only FBI men are there.",
      src: `${T}, vol. IX, pp. 1576–1578 (Holtzman) [S]; vol. X, pp. 1702–1703 (Prior) [S]` },
    { t: 12, k: "file", t1: "26 June: Naval intelligence in New York learns of the Florida landing – 'by accident'. That night, for the first time, a Mayport boat patrols 'between St. Johns Lightship and Ponte Vedra, Fla.'",
      src: "Eastern Sea Frontier, War Diary, June 1942, NAID 78184481 [S]; Section Base Mayport, War Diary, 26 June 1942, NAID 133928462, image 136 [S]" },
    { t: 13, k: "file", t1: "27 June, 09:08, Chicago: Herbert Haupt is arrested at the Webster Street elevated station; at 18:45 Hermann Neubauer, in the Sheridan Plaza Hotel.",
      src: `${T}, vol. IX, p. 1603 (Hirsh) [S]; vol. X, p. 1706 (Fisher) [S]; vol. IV, p. 476 [S]` }
  ];
  WA.CALL_ACTIONS = [
    { id: "canvass", label: "Canvass Long Island", note: "stations, hotels, shops near Amagansett" },
    { id: "lab", label: "Work the Amagansett evidence", note: "boxes, clothes, the cap" },
    { id: "contacts", label: "Watch known German-American contacts", note: "costs secrecy" },
    { id: "liaise", label: "Share with the Navy and Coast Guard", note: "costs secrecy, wins trust" },
    { id: "quiet", label: "Keep the press out", note: "rumours run in Florida" },
    { id: "south", label: "Search Jacksonville hotels and trains", note: "only with a Florida lead" }
  ];

  /* ---------------------------------------------------------------- III: The Credit, 27 June – 8 August (and after) */
  WA.CREDIT_STAGES = [
    { id: "announce", when: "27 June 1942, evening, New York" },
    { id: "coast", when: "28 June 1942" },
    { id: "rumour", when: "29 June 1942" },
    { id: "commission", when: "2–8 July 1942" },
    { id: "lenient", when: "1 August 1942" },
    { id: "end", when: "8 August 1942" }
  ];
  WA.PRESS = [
    { s: "coast", k: "press", t1: "Sunday Star, Washington, front page: 'FBI Capture of 8, Landed by Subs, Thwarts Spectacular Nazi Plot'. In the FBI's chronology the first four landed on Long Island and 'Two days later they got Dasch in New York'. Hoover 'refused, for obvious reasons, to reveal where or when' the first information came. The Coast Guard has 'intensified precautions'.",
      src: "Sunday Star (Washington), 28 June 1942, p. A-1, special dispatch from New York [S]" },
    { s: "coast", k: "press", t1: "Page A-4: 'The Nazi Plot That Failed'. FBI photographs, released to the press: 'Scene south of Jacksonville, Fla., showing location of boxes of explosives still in hole on the beach'.",
      src: "Sunday Star, 28 June 1942, p. A-4, A.P. Wirephoto [S]" },
    { s: "rumour", k: "press", t1: "'Nazi Saboteurs' Contact Men Seized by Federal Agents.' For the first time a place in Florida is named: they 'landed at Ponte Vedra Beach, near Jacksonville, Fla., June 17, Mr. Hoover said'. 'We have their full statements of confession.'",
      src: "Evening Star, 29 June 1942, p. A-1, AP [S]; quotation [O]" },
    { s: "rumour", k: "press", t1: "'The FBI did not reveal how the dynamiters were caught. An unofficial report was that a lone unarmed Coast Guardsman …'",
      src: "Evening Star, 29 June 1942, p. A-2, AP [O]" },
    { s: "commission", k: "file", t1: "2 July: by Proclamation 2561 the President closes the civil courts to enemies entering the country to commit sabotage; a military order names a commission of seven generals. The Star: '7 ARMY GENERALS TO TRY SABOTEURS HERE'.",
      src: "Proclamation 2561 and Military Order, 2 July 1942, 7 Federal Register 5101, 5103 [S]; Evening Star, 2 July 1942, p. A-1 [S]" },
    { s: "commission", k: "file", t1: "From 8 July the commission sits behind closed doors. Cullen tells of the night on the beach; on 27 July, called by the defence, McWhorter and Connelley testify on the call of 14 June.",
      src: `${T}, vols. I, XVI [S]; closed doors: Fisher 2003 [L]` },
    { s: "commission", k: "file", t1: "15 July: the Coast Guard's own story of Amagansett is released through the Office of War Information – the Boston Daily Globe: 'NAZI SABOTEURS' LANDING DETAILED BY COAST GUARD'.",
      src: "Boston Daily Globe, 16 July 1942, AP, copy in USCG file NAID 207525008, image 2 [S]" },
    { s: "commission", k: "file", t1: "16 July: the District Coast Guard Officer in Boston tells every station what Amagansett teaches: the need for 'coolness'; bring strangers to the station; do not open boxes 'with a can opener'.",
      src: "USCG, First Naval District, 'Landing of Enemy Agents', 16 July 1942, NAID 207525008, p. 1 [S]" },
    { s: "lenient", k: "file", t1: "23 July: the Senate passes S. 2643, a medal of honor for J. Edgar Hoover for the arrest of 'enemy agents, saboteurs, and fifth columnists during the month of June 1942'. 25 July: Coast Guard Headquarters orders an organized beach patrol in all coastal districts.",
      src: "FBI Vault, J. Edgar Hoover, part 5, p. 57 [S]; The Coast Guard at War XVII: Beach Patrol (1945), p. 5 [S]" },
    { s: "lenient", k: "file", t1: "31 July: in Ex parte Quirin the Supreme Court holds that the commission may try the eight; the reasons follow on 29 October.",
      src: "Ex parte Quirin, 317 U.S. 1 (1942) [S]" }
  ];
  WA.END_RECORD = [
    "On 8 August 1942 six of the eight were put to death in the District of Columbia jail. The President, the White House announced, had spared two – Burger with a life sentence, Dasch with thirty years – 'because they helped the Government apprehend and convict the others'.",
    "In April 1948 President Truman granted clemency to Dasch and Burger on condition of deportation; both were sent to Germany."
  ];
  WA.END_SRC = "Evening Star, 8 Aug. 1942, p. A-1 [S], quotation [O]; White House press release, 26 April 1948, NAID 284841056 [S]";
  WA.AFTER = [
    { t1: "In Chicago, Haupt's parents and others were tried for treason for having sheltered him; the Supreme Court upheld Hans Max Haupt's conviction in 1947.", src: "Haupt v. United States, 330 U.S. 631 (1947) [S]" },
    { t1: "In New York the conviction of Anthony Cramer, who had met Thiel and Kerling, was reversed in 1945.", src: "Cramer v. United States, 325 U.S. 1 (1945) [S]" },
    { t1: "John Cullen received the Legion of Merit on 22 November 1943.", src: "US Coast Guard photograph 26-G-11-22-43 (NAID 205588339) [S]" },
    { t1: "In 1997 the FBI's own 'Short History' said that Dasch 'turned himself in' and helped to find the rest. A later case history on the FBI's website says the New York call was something 'of which Headquarters was aware' – the transcript says it was not.", src: "FBI, A Short History of the FBI (1997), FBI Vault, p. 12 [S]; fbi.gov, 'Nazi Saboteurs and George Dasch' [O]; " + T + ", vol. XVI, p. 2590 [S]" },
    { t1: "Dasch told his own story in 1959.", src: "G. J. Dasch, Eight Spies Against America (1959) [L]" }
  ];

  /* ---------------------------------------------------------------- the reckoning */
  WA.VERSIONS = {
    fbi: { title: "What the FBI said", text: "Eight men landed from submarines – four on Long Island, four near Jacksonville – and the FBI caught them all within two weeks. 'Two days later they got Dasch in New York.' Hoover would not say 'where or when' the first information had come.",
      src: "Sunday Star, 28 June 1942, p. A-1 [S]" },
    record: { title: "What the record says", text: "The first information came from Dasch. On 14 June the New York office wrote a memo 'only for the purpose of recording the call' and did not send it on – 'Not that I know of, sir'. On 19 June he walked in in Washington; for a week the Bureau held him and took his statement. To shield him it agreed a story: a tip from a rooming house had led agents to the hotel 'where we picked up DASCH and BURGER'. The Florida boxes were found because Kerling, under arrest, led agents to them.",
      src: `${T}, vol. XVI, pp. 2583, 2590 [S]; FBI Vault, George Dasch, part 1, pp. 3, 23 [S]; ${T}, vol. IX, pp. 1576–1578 [S]` },
    coast: { title: "What the Coast Guard said", text: "A lone patrolman met the first four on the beach, kept his head, took their money and reported; the station found the boxes at dawn. After the war its own history had the Florida boxes found by 'local fishermen' and Dasch 'picked up at Yorkville'. Both are wrong.",
      src: "Boston Daily Globe, 16 July 1942, AP [S]; The Coast Guard at War XVII: Beach Patrol (1945), p. 5, notes 1–2 [S]" },
    beach: { title: "What the beach at Ponte Vedra saw", text: "Nothing. That night the only patrol boat out ran north of the river; the Army's motor patrol kept to the inhabited stretch of the beach road. The first night patrol off Ponte Vedra is in the war diary for 26 June – the night after the FBI dug up the boxes.",
      src: "Section Base Mayport, War Diary, 17 and 26 June 1942, NAID 133928462, images 125, 136 [S]; " + T + ", vol. IV, p. 529 [S]" }
  };

  /* ---------------------------------------------------------------- fixed record panels */
  WA.FIXED = {
    ama: "No one on the US side ever fired a shot or made an arrest on the beach. The Coast Guard patrols were unarmed; the investigation of enemy agents was the FBI's.",
    pv: "Nobody saw the landing at Ponte Vedra. The game lets you try – the record does not.",
    call: "How the Florida men were found, no witness told the commission; the times of arrest were agreed between counsel, without places.",
    credit: "The commission's verdicts and the deaths of 8 August are the record, never a move. This game shows no photograph of the dead."
  };
  WA.FIXED_SRC = { call: `${T}, vol. IV, p. 476 [S]` };

  if (typeof module !== "undefined") module.exports = WA; else root.WA = WA;
})(typeof window !== "undefined" ? window : globalThis);
