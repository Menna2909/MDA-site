// Replace with your Apps Script Web App URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbyY9HUHhZTxEOP5X_RQBvCut4FBVzMVC0gRw1Xtdk7o91dNM688PuK_UoE-mx9Rk6tteA/exec";

document.addEventListener("DOMContentLoaded", function () {
  const loadingSpinner = document.querySelector(".loading-spinner");
  const tasksList = document.getElementById("tasksList");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Load tasks on page load
  loadTasks();

  // Load tasks from API
  function loadTasks(filterTrack = "all") {
    showLoading(true);

    fetch(`${API_URL}?operation=getTasks`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          renderTasks(data.tasks, filterTrack);
        } else {
          throw new Error(data.message || "Failed to load tasks");
        }
      })
      .catch((error) => {
        alert("Error: " + error.message);
        tasksList.innerHTML =
          '<div class="col-12"><div class="alert alert-danger">Failed to load tasks</div></div>';
      })
      .finally(() => {
        showLoading(false);
      });
  }

  // Render tasks
  function renderTasks(tasks, filterTrack = "all") {
    tasksList.innerHTML = "";

    if (!tasks || tasks.length === 0) {
      tasksList.innerHTML =
        '<div class="col-12"><div class="alert alert-info">No tasks found.</div></div>';
      return;
    }

    // Filter if needed
    const filteredTasks =
      filterTrack === "all"
        ? tasks
        : tasks.filter((task) => task.track === filterTrack);

    // Sort by track then task number
    filteredTasks.sort((a, b) => {
      if (a.track !== b.track) return a.track.localeCompare(b.track);
      return a.taskNumber - b.taskNumber;
    });

    //intilize mentor images to add abov the task
    const medicalMentorImage = "assets/imgs/Board/Menna Waleed.jpg";
    const pharmaMentorImage = "assets/imgs/Board/Ammar El-Husseiny.jpg";
    const dentistryMentorImage = "assets/imgs/Board/Omar El-Sonbaty.jpg";
    const PTMentorImage = "assets/imgs/Board/Ganat Wael.jpg";

    const med_submt_link = "https://docs.google.com/forms/d/e/1FAIpQLSdHw--KYyTMXgf2NmDSWX6bvqH4u_MTHL6ZG9d9238OAM1l8w/viewform?usp=dialog";
    const pharma_submt_link = "https://docs.google.com/forms/d/e/1FAIpQLSfo3z-T_aw9j94jZ5tvoVBAcRBYTApC_QW7oy-mGM102JzEyw/viewform?usp=dialog";
    const dentistry_submt_link = "https://docs.google.com/forms/d/e/1FAIpQLSc22ul4cgr3QVFlPO4Xw20Vv053visn42hndjBaSkL8w78u9Q/viewform?usp=dialog";
    const PT_submt_link = "https://docs.google.com/forms/d/e/1FAIpQLSdgeetZC3VVqykhGJ687tGFaJR9y9RjXTvMo2N8mIbVrxQ3BA/viewform?usp=dialog";

    // Display tasks
    filteredTasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = "col-md-6 col-lg-4";
      taskCard.innerHTML = `
            <div class="task-card h-100">
              <div class="task-card-content">
                <div class="mentorImgContainer">
                  <img src="${
                    task.track === "Medicine"
                      ? medicalMentorImage
                      : task.track === "Pharma"
                      ? pharmaMentorImage
                      : task.track === "Dentistry"
                      ? dentistryMentorImage
                      : PTMentorImage
                  }" alt="${task.track} Mentor" class="mentor-image">
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <span class="badge track-badge ${task.track}">${task.track}
                    </span>
                    <span class="text-muted">#${task.taskNumber}</span>
                  </div>
                  <h5 class="card-title mt-2">${task.description}</h5>
                  <p class="card-text">
                    <small class="text-muted">
                      Deadline: ${formatDate(task.deadline)}
                    </small>
                  </p>
                  </div>
                  </div>
              <div class="task-details">
                <h4>Task Details</h4>
                <div class="detail-item">
                    <span class="detail-label">Track:</span> ${task.track}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Task Number:</span> #${task.taskNumber}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Description:</span> ${task.description}
                </div>
                <div class="detail-item">
                <span class="detail-label">Deadline:</span> ${formatDate(task.deadline)}
                </div>
                <div class="detail-item">
                <span class="detail-label">Requirements:</span> ${task.requirements || 'No specific requirements'}
                </div>
                <a href="${ task.track === "Medicine" ? med_submt_link : 
                    task.track === "Pharma" ? pharma_submt_link :
                    task.track === "Dentistry" ? dentistry_submt_link :
                    PT_submt_link
                }" class="submit-btn" target="__blank">Submit Task</a>
              </div>
            </div>
          `;
      tasksList.appendChild(taskCard);
    });
  }

  // Helper functions
  function formatDate(dateString) {
    if (!dateString) return "No deadline";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function showLoading(show) {
    loadingSpinner.style.display = show ? "block" : "none";
    document.getElementById("tasksContainer").style.display = show
      ? "none"
      : "block";
  }
});
