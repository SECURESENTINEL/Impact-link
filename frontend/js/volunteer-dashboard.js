const volunteerId = localStorage.getItem("volunteerId");

/* Navigation */
function showSection(id){
  document.querySelectorAll(".section").forEach(sec => sec.style.display="none");
  document.getElementById(id).style.display = "block";

  if(id === "dashboard") loadStats();
  if(id === "browse") loadActivities();
  if(id === "requests") loadRequests();
  if(id === "accepted") loadAccepted();
  if(id === "notifications") loadNotifications();
}

function logout(){
  localStorage.clear();
  window.location.href = "login.html";
}

/* ================= DASHBOARD STATS ================= */
async function loadStats(){

  const reqRes = await fetch(`https://impact-link-backend.onrender.com/api/activities/volunteer-requests/${volunteerId}`);
  const requests = await reqRes.json();

  const notifRes = await fetch(`https://impact-link-backend.onrender.com/api/notifications/volunteer/${volunteerId}`);
  const notifications = await notifRes.json();

  document.getElementById("totalRequests").innerText = requests.length;
  document.getElementById("acceptedCount").innerText =
    requests.filter(r => r.status === "accepted").length;
  document.getElementById("notificationCount").innerText = notifications.length;
}

/* ================= BROWSE ACTIVITIES ================= */
async function loadActivities(){

  const res = await fetch("https://impact-link-backend.onrender.com/api/activities");
  const activities = await res.json();

  const reqRes = await fetch(`https://impact-link-backend.onrender.com/api/activities/volunteer-requests/${volunteerId}`);
  const requests = await reqRes.json();

  const requestedIds = requests.map(r => r.activityId._id);

  const list = document.getElementById("activityList");
  list.innerHTML = "";

  activities.forEach(a => {

    const alreadyRequested = requestedIds.includes(a._id);

    list.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>${a.description}</p>
        <small>${a.location} | ${new Date(a.date).toDateString()}</small>
        <button 
          onclick="requestJoin('${a._id}')"
          ${alreadyRequested ? "disabled" : ""}
        >
          ${alreadyRequested ? "Requested" : "Request to Join"}
        </button>
      </div>
    `;
  });
}

/* ================= REQUEST JOIN ================= */
async function requestJoin(activityId){

  const res = await fetch("https://impact-link-backend.onrender.com/api/activities/request",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      activityId,
      volunteerId
    })
  });

  const data = await res.json();

  if(res.ok){
    alert("Request Sent");
    loadActivities();
  } else {
    alert(data.error);
  }
}

/* ================= MY REQUESTS ================= */
async function loadRequests(){

  const res = await fetch(`https://impact-link-backend.onrender.com/api/activities/volunteer-requests/${volunteerId}`);
  const requests = await res.json();

  const list = document.getElementById("requestList");
  list.innerHTML = "";

  requests.forEach(r => {
    list.innerHTML += `
      <div class="card">
        <h3>${r.activityId.title}</h3>
        <p>Status: ${r.status}</p>
      </div>
    `;
  });
}

/* ================= ACCEPTED ================= */
async function loadAccepted(){

  const res = await fetch(`https://impact-link-backend.onrender.com/api/activities/volunteer-requests/${volunteerId}`);
  const requests = await res.json();

  const accepted = requests.filter(r => r.status === "accepted");

  const list = document.getElementById("acceptedList");
  list.innerHTML = "";

  accepted.forEach(r => {
    list.innerHTML += `
      <div class="card">
        <h3>${r.activityId.title}</h3>
        <p>${r.activityId.location}</p>
        <small>${new Date(r.activityId.date).toDateString()}</small>
      </div>
    `;
  });
}

/* ================= NOTIFICATIONS ================= */
async function loadNotifications(){

  const res = await fetch(`https://impact-link-backend.onrender.com/api/notifications/volunteer/${volunteerId}`);
  const notifications = await res.json();

  const list = document.getElementById("notificationList");
  list.innerHTML = "";

  notifications.forEach(n => {
  list.innerHTML += `
    <div class="card">
      <p>${n.notificationId.message}</p>
    </div>
  `;
});

}

loadStats();
