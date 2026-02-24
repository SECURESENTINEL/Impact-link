const ngoId = localStorage.getItem("ngoId");

/* ================= NAVIGATION ================= */

function showSection(id){
  document.querySelectorAll(".section").forEach(sec => sec.style.display="none");
  document.getElementById(id).style.display = "block";

  if(id === "dashboard") loadStats();
  if(id === "activities") loadActivities();
  if(id === "requests") loadRequests();
  if(id === "notifications") loadNotifications();
}

function logout(){
  localStorage.clear();
  window.location.href = "login.html";
}

/* ================= DASHBOARD STATS ================= */

async function loadStats(){
  const activitiesRes = await fetch("http://localhost:5000/api/activities");
  const activities = await activitiesRes.json();

  const myActivities = activities.filter(a => a.ngoId === ngoId);

  const requestsRes = await fetch(`http://localhost:5000/api/activities/requests/${ngoId}`);
  const requests = await requestsRes.json();

  const pending = requests.filter(r => r.status === "pending");

  const notifRes = await fetch(`http://localhost:5000/api/notifications/ngo/${ngoId}`);
  const notifications = await notifRes.json();

  document.getElementById("totalActivities").innerText = myActivities.length;
  document.getElementById("totalRequests").innerText = pending.length;
  document.getElementById("totalNotifications").innerText = notifications.length;
}


/* ================= CREATE ACTIVITY ================= */

document.getElementById("activityForm").onsubmit = async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  data.ngoId = ngoId;

  await fetch("http://localhost:5000/api/activities/create", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  alert("Activity Created Successfully");
  e.target.reset();
};

/* ================= LOAD ACTIVITIES ================= */

async function loadActivities(){
  const res = await fetch("http://localhost:5000/api/activities");
  const activities = await res.json();

  const myActivities = activities.filter(a => a.ngoId === ngoId);

  const list = document.getElementById("activityList");
  list.innerHTML = "";

  myActivities.forEach(a => {
    list.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>${a.description}</p>
        <small>${a.location} | ${new Date(a.date).toDateString()}</small>
      </div>
    `;
  });
}

/* ================= LOAD REQUESTS ================= */

async function loadRequests(){
  const res = await fetch(`http://localhost:5000/api/activities/requests/${ngoId}`);
  const requests = await res.json();

  const list = document.getElementById("requestList");
  list.innerHTML = "";

  requests.forEach(r => {
    list.innerHTML += `
      <div class="card">
        <p><strong>Activity:</strong> ${r.activityId.title}</p>
        <p><strong>Volunteer:</strong> ${r.volunteerId.name}</p>
        <p>Status: ${r.status}</p>

        ${r.status === "pending" ? `
          <button onclick="updateStatus('${r._id}','accepted')">Accept</button>
          <button onclick="updateStatus('${r._id}','rejected')">Reject</button>
        ` : ''}
      </div>
    `;
  });
}

/* ================= UPDATE REQUEST STATUS ================= */

async function updateStatus(id,status){
  await fetch(`http://localhost:5000/api/activities/update/${id}`,{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({status})
  });

  alert("Status Updated");
  loadRequests();
}

/* ================= LOAD NOTIFICATIONS ================= */

async function loadNotifications(){
  const res = await fetch(`http://localhost:5000/api/notifications/ngo/${ngoId}`);
  const notifications = await res.json();

  const list = document.getElementById("notificationList");
  list.innerHTML = "";

  notifications.forEach(n => {
    list.innerHTML += `
      <div class="card">
        <p>${n.message}</p>
      </div>
    `;
  });
}

/* Load dashboard initially */
loadStats();
