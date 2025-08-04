document.addEventListener("DOMContentLoaded", () => {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJR8qh2QD9PP0IIWSOKKPlQ0GsqyEvV1TfOU3TmBO7fYEX-xvXbjyNJbl2hdRP-FmYzA/exec";

  // Create loading banner element
  const loadingBanner = document.createElement("div");
  loadingBanner.id = "loading-banner";
  loadingBanner.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <p>Loading leaderboard data...</p>
    </div>
  `;
  document.body.appendChild(loadingBanner);

  // Add CSS for loading banner
  const style = document.createElement("style");
  style.textContent = `
    #loading-banner {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 32, 89, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      color: white;
      font-size: 1.5em;
    }
    .loading-content {
      text-align: center;
    }
    .spinner {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #0bbfe2;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  async function fetchLeaderboardData() {
    try {
      // Show loading banner
      loadingBanner.style.display = 'flex';
      
      const response = await fetch(SCRIPT_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    } finally {
      // Hide loading banner when done
      loadingBanner.style.display = 'none';
    }
  }

  function createLeaderboardRow(student, rank) {
    const tr = document.createElement("tr");
    
    // Apply special styling to top 3 ranks
    if (rank <= 3) {
      tr.classList.add(`rank-${rank}`);
    }
    
    // Create rank cell with appropriate icon
    const rankCell = document.createElement("td");
    if (rank === 1) rankCell.innerHTML = `<i class="fas fa-trophy"></i> ${rank}`;
    else if (rank === 2) rankCell.innerHTML = `<i class="fas fa-medal"></i> ${rank}`;
    else if (rank === 3) rankCell.innerHTML = `<i class="fas fa-award"></i> ${rank}`;
    else rankCell.textContent = rank;
    
    // Create name cell
    const nameCell = document.createElement("td");
    nameCell.className = "name_row";
    nameCell.textContent = student.name;
    nameCell.classList.add("name_row");
    const img = document.createElement("img");
    img.src = `assets/imgs/students/${student.name}.jpg`;
    img.alt = `${student.name} Avatar`;
    img.onerror = () => {
      img.src = 'assets/imgs/students/default-avatar.jpg'; // Fallback if image doesn't exist
    };
    nameCell.prepend(img);
    
    // Create school cell
    const schoolCell = document.createElement("td");
    schoolCell.textContent = student.school || "Not specified";
    
    // Create points cell
    const pointsCell = document.createElement("td");
    pointsCell.textContent = student.points || 0;
    
    // Append all cells to the row
    tr.append(rankCell, nameCell, schoolCell, pointsCell);
    return tr;
  }

  async function updateLeaderboard() {
    // Show loading banner at start of update
    loadingBanner.style.display = 'flex';
    
    const data = await fetchLeaderboardData();
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = '';
    
    if (data && data.length) {
      // Sort by points descending
      const sortedData = [...data].sort((a, b) => b.points - a.points);
      
      // Create and append rows for each student
      sortedData.forEach((student, index) => {
        if (student.name && student.name.trim() !== '') {
          tbody.appendChild(createLeaderboardRow(student, index + 1));
        }
      });
    } else {
      // Fallback empty state
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 20px;">
            No leaderboard data available at the moment. Please try again later.
          </td>
        </tr>
      `;
    }
    
    // Hide loading banner when done
    loadingBanner.style.display = 'none';
  }

  // Initial load
  updateLeaderboard();
  
  // Refresh every 30 seconds
  const refreshInterval = setInterval(updateLeaderboard, 300000);
  
  // Cleanup interval when page unloads
  window.addEventListener('beforeunload', () => {
    clearInterval(refreshInterval);
  });
});