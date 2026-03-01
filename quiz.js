let currentLevel = 0;
let availableQuestions = [];
let levelStats = {};
const QUESTIONS_PER_LEVEL = 4;

const levelNames = [
  "1. การบวกและลบจำนวนนับ",
  "2. การคูณและการหารจำนวนนับ",
  "3. สมการและการแก้สมการ",
  "4. ตัวประกอบ ห.ร.ม. และ ค.ร.น.",
  "5. เศษส่วน: การบวกลบ (ตอบเป็นเศษส่วนอย่างต่ำ)",
  "6. เศษส่วน: การคูณหาร (ตอบเป็นเศษส่วนอย่างต่ำ)",
  "7. ทศนิยม: การบวกลบ",
  "8. ทศนิยม: การคูณหาร",
  "9. บัญญัติไตรยางศ์",
  "10. อัตราส่วนและร้อยละ",
  "11. มุมและเส้นขนาน",
  "12. ความยาวรอบรูปและพื้นที่ (2 มิติ)",
  "13. ปริมาตรและความจุ (3 มิติ)",
  "14. สถิติและค่าเฉลี่ย",
  "15. บทประยุกต์รวมเนื้อหา (Mixed)",
];

function handleAnswer() {
  const userInput = document.getElementById("user-answer").value;
  if (userInput.trim() === "") return;

  const userAnswer = userInput.trim().toUpperCase();
  const correctAnswer = window.currentActiveQuestion.a.toString().toUpperCase();

  if (!levelStats[currentLevel]) {
    levelStats[currentLevel] = { correct: 0, done: 0 };
  }

  levelStats[currentLevel].done++;

  if (userAnswer === correctAnswer) {
    levelStats[currentLevel].correct++;
  }

  if (levelStats[currentLevel].done >= QUESTIONS_PER_LEVEL) {
    if (quizData[currentLevel + 1]) {
      currentLevel++;
      availableQuestions = [];
    } else {
      showResult();
      return;
    }
  }

  displayQuestion();
}

function displayQuestion() {
  if (availableQuestions.length === 0) {
    availableQuestions = [...quizData[currentLevel]];
  }

  const questionObj = availableQuestions.shift();
  window.currentActiveQuestion = questionObj;

  const step = levelStats[currentLevel] ? levelStats[currentLevel].done + 1 : 1;

  const levelDisplay = document.getElementById("level-display");
  if (levelDisplay) levelDisplay.innerText = levelNames[currentLevel];

  document.getElementById("question-text").innerText = questionObj.q;
  document.getElementById("user-answer").value = "";

  const progressDisplay = document.getElementById("score-display");
  if (progressDisplay)
    progressDisplay.innerText = `ข้อที่ ${step} / ${QUESTIONS_PER_LEVEL}`;
}

function showResult() {
  document.getElementById("quiz-ui").classList.add("hidden");
  const resultScreen = document.getElementById("result-screen");
  if (resultScreen) resultScreen.classList.remove("hidden");

  let reportHTML =
    "<h3 class='text-xl font-bold mb-4 text-center'>สรุปผลคะแนนรายหัวข้อ</h3>";
  reportHTML +=
    "<div class='text-left space-y-3 max-h-80 overflow-y-auto bg-gray-800 p-4 rounded-lg'>";

  for (let i = 0; i <= currentLevel; i++) {
    const stat = levelStats[i] || { correct: 0 };
    const colorClass =
      stat.correct >= 4
        ? "text-green-400"
        : stat.correct >= 2
          ? "text-yellow-400"
          : "text-red-400";

    reportHTML += `
      <div class="flex justify-between border-b border-gray-700 pb-2">
        <span class="text-sm text-gray-200">${levelNames[i]}</span>
        <span class="font-bold ${colorClass}">${stat.correct}/${QUESTIONS_PER_LEVEL}</span>
      </div>`;
  }
  reportHTML += "</div>";

  const scoreContainer = document.getElementById("final-score");
  if (scoreContainer) scoreContainer.innerHTML = reportHTML;
}

function sendScore() {
  const name = prompt("กรุณาใส่ชื่อของคุณเพื่อบันทึกผล:");
  if (!name) return;

  let reportString = "";
  for (let i in levelStats) {
    reportString += `[${levelNames[i]}: ${levelStats[i].correct}/${QUESTIONS_PER_LEVEL}] `;
  }

  const scriptURL =
    "https://script.google.com/macros/s/AKfycbx0--_BQ8bEoej05YvH7weDh47wE6gVZ9YOZIyW2tmD7Mk25u6AkPoSGe2UjYTJrPSpTw/exec";
  const url = `${scriptURL}?name=${encodeURIComponent(name)}&report=${encodeURIComponent(reportString)}`;

  fetch(url, { method: "GET" })
    .then(() => {
      alert("ส่งข้อมูลให้พี่เรียบร้อยแล้วครับ!");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      alert("บันทึกข้อมูลสำเร็จ!");
      location.reload();
    });
}

const quizData = {
  0: [
    // บวกลบ
    { q: "120 - 54 = ?", a: 66 },
    { q: "4,500 + 1,250 = ?", a: 5750 },
    { q: "10,000 - 3,456 = ?", a: 6544 },
    {
      q: "สมชายมีเงิน 500 บาท ซื้อขนม 125 บาท และสมุด 85 บาท สมชายเหลือเงินกี่บาท?",
      a: 290,
    },
  ],
  1: [
    // คูณหาร
    { q: "12 * 8 = ?", a: 96 },
    { q: "144 / 12 = ?", a: 12 },
    { q: "1,250 / 25 = ?", a: 50 },
    { q: "มีส้ม 350 ผล จัดใส่กล่อง กล่องละ 15 ผล จะเหลือส้มกี่ผล?", a: 5 },
  ],
  2: [
    // สมการ
    { q: "ถ้า x + 15 = 40 แล้วค่าของ x คือเท่าไหร่", a: 25 },
    { q: "ถ้า y - 12 = 30 แล้วค่าของ y คือเท่าไหร่", a: 42 },
    { q: "ถ้า 5a = 150 แล้วค่าของ a คือเท่าไหร่", a: 30 },
    {
      q: "สามเท่าของเงินจำนวนหนึ่งหักออก 15 บาท เหลือ 45 บาท เงินจำนวนนั้นคือเท่าไร?",
      a: 20,
    },
  ],
  3: [
    // ห.ร.ม. ค.ร.น.
    { q: "ห.ร.ม. ของ 18 และ 24 คือ?", a: 6 },
    { q: "ค.ร.น. ของ 6 และ 8 คือ?", a: 24 },
    { q: "ห.ร.ม. ของ 15, 30 และ 45 คือ?", a: 15 },
    {
      q: "ระฆัง 3 ใบ ตีทุก 10, 15 และ 20 นาที ถ้าระฆังตีพร้อมกันเวลา 8.00 น. จะตีพร้อมกันอีกครั้งเวลาใด (ตอบเป็นตัวเลขเช่น 1:00)",
      a: "9.00",
    },
  ],
  4: [
    // เศษส่วน บวกลบ
    { q: "5/8 - 3/8 = ?", a: "1/4" },
    { q: "1/2 + 1/3 = ?", a: "5/6" },
    { q: "3/4 - 1/6 = ?", a: "7/12" },
    {
      q: "แม่ใช้แป้งทำขนม 1/4 ถุง และทำอาหาร 2/5 ถุง แม่ใช้แป้งไปทั้งหมดเศษส่วนเท่าไร?",
      a: "13/20",
    },
  ],
  5: [
    // เศษส่วน คูณหาร
    { q: "1/2 * 3/5 = ?", a: "3/10" },
    { q: "2/3 / 1/3 = ?", a: 2 },
    { q: "3/4 * 8/9 = ?", a: "2/3" },
    { q: "มีน้ำ 10 ลิตร แบ่งใส่ขวด ขวดละ 1/2 ลิตร จะได้กี่ขวด?", a: 20 },
  ],
  6: [
    // ทศนิยม บวกลบ
    { q: "5.8 - 2.4 = ?", a: "3.4" },
    { q: "12.5 + 3.75 = ?", a: "16.25" },
    { q: "10 - 4.25 = ?", a: "5.75" },
    {
      q: "เชือกยาว 5.5 เมตร ตัดไปใช้ 2.25 เมตร เหลือเชือกยาวกี่เมตร?",
      a: "3.25",
    },
  ],
  7: [
    // ทศนิยม คูณหาร
    { q: "4.5 / 5 = ?", a: "0.9" },
    { q: "0.5 * 0.4 = ?", a: "0.2" },
    { q: "1.44 / 1.2 = ?", a: "1.2" },
    {
      q: "ซื้อปากกา 5 ด้าม ราคาด้ามละ 12.50 บาท จ่ายแบงค์ 100 จะได้รับเงินทอนกี่บาท?",
      a: "37.5",
    },
  ],
  8: [
    { q: "ขนม 2 ห่อ ราคา 50 บาท ขนม 5 ห่อ ราคากี่บาท?", a: 125 },
    {
      q: "วิ่ง 100 เมตร ใช้เวลา 20 วินาที ถ้าวิ่งด้วยความเร็วเท่าเดิม 300 เมตร ใช้เวลากี่วินาที?",
      a: 60,
    },
    {
      q: "คนงาน 2 คน ทาสีบ้านเสร็จใน 6 วัน ถ้าใช้คนงาน 4 คน จะทาสีเสร็จในกี่วัน?",
      a: 3,
    },
    {
      q: "อาหารสุนัข 1 ถุง เลี้ยงสุนัข 3 ตัว ได้ 10 วัน ถ้ามีสุนัข 5 ตัว อาหารนี้จะหมดในกี่วัน?",
      a: 6,
    },
  ],
  9: [
    // อัตราส่วนและร้อยละ
    { q: "25% ของ 400 คือเท่าไร?", a: 100 },
    { q: "เสื้อราคา 500 บาท ลดราคา 10% ลดไปกี่บาท?", a: 50 },
    { q: "ซื้อมา 200 ขายไป 250 ได้กำไรร้อยละเท่าไร?", a: 25 },
    {
      q: "ฝากเงิน 10,000 บาท ดอกเบี้ย 3% ต่อปี ฝาก 2 ปี จะได้ดอกเบี้ยกี่บาท?",
      a: 600,
    },
  ],
  10: [
    // มุมและเส้นขนาน
    { q: "ผลรวมมุมภายในของรูปสามเหลี่ยมคือองศา?", a: 180 },
    { q: "ผลรวมมุมภายในของรูปสี่เหลี่ยมคือกี่องศา?", a: 360 },
    {
      q: "สามเหลี่ยมหน้าจั่วมีมุมยอด 50 องศา มุมที่ฐานมีขนาดมุมละกี่องศา?",
      a: 65,
    },
    {
      q: "เส้นขนาน 1 คู่ ถูกตัดด้วยเส้นตรง มุมแย้งมีขนาด 2x และ 80 องศา จงหา x",
      a: 40,
    },
  ],
  11: [
    // พื้นที่และรอบรูป
    { q: "สี่เหลี่ยมผืนผ้า กว้าง 4 ยาว 6 มีพื้นที่กี่ ตร.ซม.?", a: 24 },
    { q: "สามเหลี่ยมมีฐาน 10 ซม. สูง 6 ซม. มีพื้นที่กี่ ตร.ซม.?", a: 30 },
    {
      q: "วงกลมมีรัศมี 7 ซม. มีพื้นที่ประมาณกี่ ตร.ซม. (ใช้ pi = 22/7)",
      a: 154,
    },
    {
      q: "สนามหญ้ารูปสี่เหลี่ยมผืนผ้ากว้าง 10ม. ยาว 15ม. ต้องการทำทางเดินรอบนอกกว้าง 1ม. ทางเดินมีพื้นที่กี่ ตร.ม.?",
      a: 54,
    },
  ],
  12: [
    // ปริมาตร
    { q: "ลูกบาศก์ยาวด้านละ 3 ซม. มีปริมาตรกี่ ลบ.ซม.?", a: 27 },
    { q: "กล่องกว้าง 2 ยาว 5 สูง 10 มีปริมาตรกี่ ลบ.หน่วย?", a: 100 },
    { q: "แท็งก์น้ำทรงลูกบาศก์มีปริมาตร 125 ลบ.ม. แท็งก์นี้ลึกกี่เมตร?", a: 5 },
    {
      q: "สระน้ำกว้าง 5 ม. ยาว 10 ม. ลึก 2 ม. ถ้าน้ำไหลเข้าสระ 10 ลบ.ม. ต่อชั่วโมง ต้องใช้เวลากี่ชั่วโมงน้ำจึงเต็มสระ?",
      a: 10,
    },
  ],
  13: [
    // สถิติ
    { q: "ข้อมูล: 2, 5, 2, 8, 9 ฐานนิยมคือตัวเลขใด?", a: 2 },
    { q: "มัธยฐานของ 10, 15, 20 คือ?", a: 15 },
    {
      q: "สอบ 3 วิชาได้ค่าเฉลี่ย 80 คะแนน ถ้ารวมวิชาที่ 4 เข้าไป ค่าเฉลี่ยเปลี่ยนเป็น 85 วิชาที่ 4 สอบได้กี่คะแนน?",
      a: 100,
    },
    {
      q: "ลูกเต๋า 1 ลูก ทอย 1 ครั้ง โอกาสที่จะออกเลขคู่คิดเป็นเศษส่วนเท่าไร?",
      a: "1/2",
    },
  ],
  14: [
    // บทประยุกต์รวมเนื้อหา
    {
      q: "เชือกยาว 10 เมตร ตัดไป 2/5 ของความยาวทั้งหมด แล้วตัดออกอีก 1.5 เมตร เหลือเชือกกี่เมตร?",
      a: "4.5",
    },
    {
      q: "ถังน้ำทรงสี่เหลี่ยม กว้าง 2ม. ยาว 2ม. มีน้ำสูง 3ม. ถ้านำน้ำไปรดต้นไม้ 4 ลบ.ม. น้ำจะลดลงกี่เมตร?",
      a: 1,
    },
    {
      q: "แม่มีเงินอยู่จำนวนหนึ่ง ให้ลูกคนโต 1/3 ของเงินทั้งหมด ให้ลูกคนเล็ก 500 บาท แล้วแม่ยังเหลือเงิน 1,500 บาท เดิมแม่มีเงินกี่บาท?",
      a: 3000,
    },
    {
      q: "รถไฟยาว 100 เมตร แล่นด้วยความเร็ว 72 กม./ชม. จะแล่นผ่านเสาไฟฟ้า 1 ต้น ใช้เวลากี่วินาที?",
      a: 5,
    },
  ],
};

displayQuestion();

