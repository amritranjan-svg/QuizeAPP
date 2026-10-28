// --- 1. ADMIN LOGIN & QUESTION SAVE LOGIC ---
window.checkPassword = function() {
  const passwordInput = document.getElementById("admin-pass").value;
  const errorMsg = document.getElementById("error-msg");
  if (passwordInput === "admin123") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "block";
    if (errorMsg) errorMsg.style.display = "none";
    loadAdminStats();
  } else {
    if (errorMsg) errorMsg.style.display = "block";
  }
};

window.logoutAdmin = function() {
  document.getElementById("login-section").style.display = "block";
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("admin-pass").value = "";
};

window.saveQuestion = function() {
  const qText = document.getElementById("q-text").value;
  const opt0 = document.getElementById("opt-0").value;
  const opt1 = document.getElementById("opt-1").value;
  const opt2 = document.getElementById("opt-2").value;
  const opt3 = document.getElementById("opt-3").value;
  const correctOpt = parseInt(document.getElementById("correct-opt").value);
  
  if (!qText || !opt0 || !opt1 || !opt2 || !opt3) {
    alert("Kripya sabhi fields bharein!");
    return;
  }
  
  let savedQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
  savedQuestions.push({
    question: qText,
    options: [opt0, opt1, opt2, opt3],
    correct: correctOpt
  });
  
  localStorage.setItem("quizQuestions", JSON.stringify(savedQuestions));
  alert("Question successfully save ho gaya!");
  
  document.getElementById("q-text").value = "";
  document.getElementById("opt-0").value = "";
  document.getElementById("opt-1").value = "";
  document.getElementById("opt-2").value = "";
  document.getElementById("opt-3").value = "";

  loadAdminStats();
};

window.uploadQuizFile = function() {
  const fileInput = document.getElementById("quiz-file-input");
  
  if (!fileInput || fileInput.files.length === 0) {
    alert("Kripya pehle ek JSON file select karein!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedQuestions = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuestions)) {
        alert("File ka format galat hai! Array of questions hona chahiye.");
        return;
      }

      let savedQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
      savedQuestions = savedQuestions.concat(importedQuestions);
      
      localStorage.setItem("quizQuestions", JSON.stringify(savedQuestions));
      alert(`${importedQuestions.length} questions successfully import aur save ho gaye!`);
      
      fileInput.value = "";
      loadAdminStats();
    } catch (err) {
      alert("JSON file ko read karne mein error aayi. Kripya valid JSON format use karein.");
    }
  };

  reader.readAsText(file);
};

function loadAdminStats() {
  const questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
  const users = JSON.parse(localStorage.getItem("quizUsers")) || [];
  const scores = JSON.parse(localStorage.getItem("quizScores")) || {};

  const qCountElem = document.getElementById("total-q-count");
  const userCountElem = document.getElementById("total-user-count");

  if (qCountElem) qCountElem.innerText = questions.length;
  if (userCountElem) userCountElem.innerText = users.length;

  const listContainer = document.getElementById("admin-questions-list");
  if (listContainer) {
    listContainer.innerHTML = "";
    if (questions.length === 0) {
      listContainer.innerHTML = "<p style='color: #94a3b8;'>Koi question available nahi hai.</p>";
    } else {
      questions.forEach((q, index) => {
        const item = document.createElement("div");
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 15px; border-radius: 8px; border: 1.5px solid #334155;";
        item.innerHTML = `
          <span style="color: #f8fafc; font-size: 14px;"><b>#${index + 1}</b> ${q.question}</span>
          <button onclick="deleteQuestion(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">Delete 🗑️</button>
        `;
        listContainer.appendChild(item);
      });
    }
  }

  const usersContainer = document.getElementById("admin-users-list");
  if (usersContainer) {
    usersContainer.innerHTML = "";
    if (users.length === 0) {
      usersContainer.innerHTML = "<p style='color: #94a3b8;'>Abhi koi user registered nahi hai.</p>";
    } else {
      users.forEach((u) => {
        const userScoreData = scores[u.mobile] ? `${scores[u.mobile].score} / ${scores[u.mobile].total}` : "Quiz Not Attempted";
        const item = document.createElement("div");
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 15px; border-radius: 8px; border: 1.5px solid #334155;";
        item.innerHTML = `
          <div>
            <span style="color: #f8fafc; font-size: 15px; font-weight: bold;">👤 ${u.name}</span><br>
            <span style="color: #94a3b8; font-size: 13px;">📱 Mobile: ${u.mobile} | 🏆 Score: <strong style="color: #4ade80;">${userScoreData}</strong></span>
          </div>
          <button onclick="deleteUser('${u.mobile}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">Delete User 🗑️</button>
        `;
        usersContainer.appendChild(item);
      });
    }
  }
}

window.deleteQuestion = function(index) {
  let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
  if (confirm("Kya aap sach mein is question ko delete karna chahte hain?")) {
    questions.splice(index, 1);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    loadAdminStats();
    alert("Question delete ho gaya!");
  }
};

window.deleteUser = function(mobile) {
  let users = JSON.parse(localStorage.getItem("quizUsers")) || [];
  let scores = JSON.parse(localStorage.getItem("quizScores")) || {};
  
  if (confirm("Kya aap sach mein is registered user ko delete karna chahte hain?")) {
    users = users.filter(u => u.mobile !== mobile);
    delete scores[mobile];
    
    localStorage.setItem("quizUsers", JSON.stringify(users));
    localStorage.setItem("quizScores", JSON.stringify(scores));
    
    loadAdminStats();
    alert("User successfully delete ho gaya!");
  }
};


// --- 2. USER REGISTER, LOGIN & QUIZ LOGIC ---
let currentIdx = 0;
let score = 0;
let currentUser = "";
let currentMobile = "";
let timer;
let timeLeft = 15;
let userAnswers = [];
let selectedOptionTemp = null; // Temporary selection

window.showLogin = function() {
  const regBox = document.getElementById("register-box");
  const loginBox = document.getElementById("login-box");
  if (regBox) regBox.style.display = "none";
  if (loginBox) loginBox.style.display = "block";
};

window.showRegister = function() {
  const regBox = document.getElementById("register-box");
  const loginBox = document.getElementById("login-box");
  if (loginBox) loginBox.style.display = "none";
  if (regBox) regBox.style.display = "block";
};

window.registerUser = function() {
  const name = document.getElementById("reg-name").value.trim();
  const mobile = document.getElementById("reg-mobile").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();

  if (!name || !mobile || !pass) {
    alert("Kripya sabhi details bharein!");
    return;
  }
  if (mobile.length < 10) {
    alert("Kripya sahi 10 digit ka mobile number daalein!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("quizUsers")) || [];
  let existingUser = users.find(u => u.mobile === mobile);

  if (existingUser) {
    alert("Yeh mobile number pehle se registered hai! Kripya Login karein.");
    showLogin();
    return;
  }

  users.push({ name: name, mobile: mobile, pass: pass });
  localStorage.setItem("quizUsers", JSON.stringify(users));

  alert("Registration successful! Ab aap login kar sakte hain.");
  document.getElementById("reg-name").value = "";
  document.getElementById("reg-mobile").value = "";
  document.getElementById("reg-pass").value = "";
  showLogin();
};

window.loginUser = function() {
  const mobile = document.getElementById("login-mobile").value.trim();
  const pass = document.getElementById("login-pass").value.trim();

  if (!mobile || !pass) {
    alert("Kripya mobile number aur password daalein!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("quizUsers")) || [];
  let user = users.find(u => u.mobile === mobile && u.pass === pass);

  if (!user) {
    alert("Galat mobile number ya password! Kripya dobara koshish karein.");
    return;
  }

  currentUser = user.name;
  currentMobile = user.mobile;
  score = 0;
  currentIdx = 0;
  userAnswers = [];

  const loginBox = document.getElementById("login-box");
  const quizBox = document.getElementById("quiz-box");
  
  if (loginBox) loginBox.style.display = "none";
  if (quizBox) quizBox.style.display = "block";

  loadQuestion();
};

function loadQuestion() {
  clearInterval(timer);
  selectedOptionTemp = null;
  
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const questionCount = document.getElementById("question-count");
  const nextBtn = document.getElementById("next-btn");
  
  if (!questionText) return; 

  if (nextBtn) {
    nextBtn.style.display = "block";
    nextBtn.innerText = "Agla Question ➡️";
  }

  const activeQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];

  if (activeQuestions.length === 0) {
    questionText.innerText = "Abhi koi question available nahi hai. Admin dashboard se question add karein!";
    if (questionCount) questionCount.innerText = "Question 0 of 0";
    if (nextBtn) nextBtn.style.display = "none";
    return;
  }

  if (currentIdx >= activeQuestions.length) {
    endQuiz(activeQuestions);
    return;
  }

  timeLeft = 20;
  startTimer(activeQuestions);

  const q = activeQuestions[currentIdx];
  if (questionCount) questionCount.innerText = `Question ${currentIdx + 1} of ${activeQuestions.length}`;
  if (questionText) questionText.innerText = q.question;
  
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.id = `opt-btn-${index}`;
      btn.onclick = function() {
        // Sabhi buttons ka background reset karein
        q.options.forEach((_, i) => {
          const b = document.getElementById(`opt-btn-${i}`);
          if (b) {
            b.style.background = "#1e293b";
            b.style.borderColor = "#334155";
            b.style.color = "#e2e8f0";
          }
        });
        
        // Selected button ko Green highlight karein
        btn.style.background = "rgba(34, 197, 94, 0.2)";
        btn.style.borderColor = "#22c55e";
        btn.style.color = "#fff";
        
        selectedOptionTemp = index;
      };
      optionsContainer.appendChild(btn);
    });
  }
}

function startTimer(activeQuestions) {
  const timerText = document.getElementById("timer-text");
  timer = setInterval(() => {
    timeLeft--;
    if (timerText) timerText.innerText = `⏱️ Time: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      proceedNext(activeQuestions);
    }
  }, 1000);
}

window.nextQuestion = function() {
  clearInterval(timer);
  const activeQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
  proceedNext(activeQuestions);
};

function proceedNext(activeQuestions) {
  const q = activeQuestions[currentIdx];
  const chosen = selectedOptionTemp !== null ? selectedOptionTemp : -1;
  
  if (chosen === q.correct) {
    score++;
  }

  userAnswers.push({
    question: q.question,
    options: q.options,
    selected: chosen,
    correct: q.correct
  });

  currentIdx++;
  loadQuestion();
}

function endQuiz(activeQuestions) {
  clearInterval(timer);
  
  let scores = JSON.parse(localStorage.getItem("quizScores")) || {};
  scores[currentMobile] = {
    score: score,
    total: activeQuestions.length
  };
  localStorage.setItem("quizScores", JSON.stringify(scores));

  const quizBox = document.getElementById("quiz-box");
  const resultBox = document.getElementById("result-box");
  
  if (quizBox) quizBox.style.display = "none";
  if (resultBox) resultBox.style.display = "block";
  
  const displayName = document.getElementById("user-display-name");
  const displayMobile = document.getElementById("user-display-mobile");
  const scoreText = document.getElementById("score-text");

  if (displayName) displayName.innerText = `Naam: ${currentUser}`;
  if (displayMobile) displayMobile.innerText = `Mobile: ${currentMobile}`;
  if (scoreText) scoreText.innerText = `${score} / ${activeQuestions.length}`;

  let reviewContainer = document.getElementById("quiz-review-section");
  if (!reviewContainer) {
    reviewContainer = document.createElement("div");
    reviewContainer.id = "quiz-review-section";
    reviewContainer.style.cssText = "margin-top: 20px; text-align: left; max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;";
    resultBox.appendChild(reviewContainer);
  }

  reviewContainer.innerHTML = "<h3 style='color: #fff; margin-bottom: 5px; font-size: 16px;'>📊 Question Review (Sahi / Galat):</h3>";

  userAnswers.forEach((ans, index) => {
    const isCorrect = ans.selected === ans.correct;
    const card = document.createElement("div");
    card.style.cssText = `padding: 12px; border-radius: 8px; background: #0f172a; border: 1.5px solid ${isCorrect ? '#22c55e' : '#ef4444'};`;
    
    let userAnsText = ans.selected !== -1 ? ans.options[ans.selected] : "Koi jawab nahi diya (Time Out)";
    let correctAnsText = ans.options[ans.correct];

    card.innerHTML = `
      <p style='color: #f8fafc; font-size: 14px; font-weight: bold;'>Q${index + 1}: ${ans.question}</p>
      <p style='color: ${isCorrect ? '#4ade80' : '#fca5a5'}; font-size: 13px; margin-top: 4px;'>
        Aapka Jawab: ${userAnsText} ${isCorrect ? '✅ (Sahi)' : '❌ (Galat)'}
      </p>
      ${!isCorrect ? `<p style='color: #4ade80; font-size: 13px;'>Sahi Jawab: ${correctAnsText}</p>` : ''}
    `;
    reviewContainer.appendChild(card);
  });
}